/* eslint-disable jsdoc/require-returns, jsdoc/require-param */
import {
  EnvAnswer,
  EnvConfig,
  EnvExam,
  EnvExamAttempt,
  EnvGeneratedExam,
  EnvMultipleChoiceQuestion,
  EnvQuestionSet,
  EnvQuestionSetAttempt
} from '@prisma/client';
import { type Static } from '@fastify/type-provider-typebox';
import * as schemas from '../schemas';

interface CompletedChallengeId {
  completedChallenges: {
    id: string;
  }[];
}

/**
 * Checks if all exam prerequisites have been met by the user.
 */
export function checkPrerequisites(
  user: CompletedChallengeId,
  prerequisites: EnvExam['prerequisites']
) {
  return prerequisites.every(p =>
    user.completedChallenges.some(c => c.id === p)
  );
}

export type UserExam = Omit<
  EnvExam,
  'questionSets' | 'config' | 'id' | 'prerequisites' | 'deprecated'
> & {
  config: Omit<EnvExam['config'], 'tags' | 'questionSets'>;
  questionSets: (Omit<EnvQuestionSet, 'questions'> & {
    questions: (Omit<
      EnvMultipleChoiceQuestion,
      'answers' | 'tags' | 'deprecated'
    > & {
      answers: Omit<EnvAnswer, 'isCorrect'>[];
    })[];
  })[];
} & { generatedExamId: string; examId: string };

/**
 * Takes the generated exam and the original exam, and creates the user-facing exam.
 */
export function constructUserExam(
  generatedExam: EnvGeneratedExam,
  exam: EnvExam
): UserExam {
  // Map generated exam to user exam (a.k.a. public exam information for user)
  const userQuestionSets = generatedExam.questionSets.map(gqs => {
    // Get matching question from `exam`, but remove `is_correct` from `exam.questions[].answers[]`
    const examQuestionSet = exam.questionSets.find(eqs => eqs.id === gqs.id)!;

    const { questions } = examQuestionSet;

    const userQuestions = gqs.questions.map(gq => {
      const examQuestion = questions.find(eq => eq.id === gq.id)!;

      // Remove `isCorrect` from question answers
      const answers = gq.answers.map(generatedAnswerId => {
        const examAnswer = examQuestion.answers.find(
          ea => ea.id === generatedAnswerId
        )!;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isCorrect, ...answer } = examAnswer;
        return answer;
      });

      return {
        id: examQuestion.id,
        audio: examQuestion.audio,
        text: examQuestion.text,
        answers
      };
    });

    const userQuestionSet = {
      type: examQuestionSet.type,
      questions: userQuestions,
      id: examQuestionSet.id,
      context: examQuestionSet.context
    };
    return userQuestionSet;
  });

  // Order questionSets in same order as original exam
  const orderedUserQuestionSets = userQuestionSets.sort((a, b) => {
    return (
      exam.questionSets.findIndex(qs => qs.id === a.id) -
      exam.questionSets.findIndex(qs => qs.id === b.id)
    );
  });

  const config = {
    totalTimeInMS: exam.config.totalTimeInMS,
    name: exam.config.name,
    note: exam.config.note,
    retakeTimeInMS: exam.config.retakeTimeInMS
  };

  const userExam: UserExam = {
    examId: exam.id,
    generatedExamId: generatedExam.id,
    config,
    questionSets: orderedUserQuestionSets
  };

  return userExam;
}

/**
 * Ensures all questions and answers in the attempt are from the generated exam.
 */
export function validateAttempt(
  generatedExam: EnvGeneratedExam,
  questionSets: EnvExamAttempt['questionSets']
) {
  for (const attemptQuestionSet of questionSets) {
    const generatedQuestionSet = generatedExam.questionSets.find(
      qt => qt.id === attemptQuestionSet.id
    );
    if (!generatedQuestionSet) {
      throw new Error(
        `Question type ${attemptQuestionSet.id} not found in generated exam.`
      );
    }

    for (const attemptQuestion of attemptQuestionSet.questions) {
      const generatedQuestion = generatedQuestionSet.questions.find(
        q => q.id === attemptQuestion.id
      );
      if (!generatedQuestion) {
        throw new Error(
          `Question ${attemptQuestion.id} not found in generated exam.`
        );
      }

      for (const attemptAnswer of attemptQuestion.answers) {
        const generatedAnswer = generatedQuestion.answers.find(
          a => a === attemptAnswer
        );
        if (!generatedAnswer) {
          throw new Error(
            `Answer ${attemptAnswer} not found in generated exam.`
          );
        }
      }
    }
  }

  return true;
}

/**
 * Checks all question sets and questions in the generated exam are in the attempt.
 *
 * TODO: Consider throwing with specific issue.
 *
 * @param questionSets An exam attempt.
 * @param generatedExam The corresponding generated exam.
 * @returns Whether or not the attempt can be considered finished.
 */
export function checkAttemptAgainstGeneratedExam(
  questionSets: EnvQuestionSetAttempt[],
  generatedExam: Pick<EnvGeneratedExam, 'questionSets'>
): boolean {
  // Check all question sets and questions are in generated exam
  for (const generatedQuestionSet of generatedExam.questionSets) {
    const attemptQuestionSet = questionSets.find(
      q => q.id === generatedQuestionSet.id
    );
    if (!attemptQuestionSet) {
      return false;
    }

    for (const generatedQuestion of generatedQuestionSet.questions) {
      const attemptQuestion = attemptQuestionSet.questions.find(
        q => q.id === generatedQuestion.id
      );
      if (!attemptQuestion) {
        return false;
      }

      const atLeastOneAnswer = attemptQuestion.answers.length > 0;
      if (!atLeastOneAnswer) {
        return false;
      }

      // All answers in attempt must be in generated exam
      const allAnswersInGeneratedExam = attemptQuestion.answers.every(a =>
        generatedQuestion.answers.includes(a)
      );
      if (!allAnswersInGeneratedExam) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Adds the current time submission time to all questions in the attempt if the question answer has changed.
 */
export function userAttemptToDatabaseAttemptQuestionSets(
  userAttempt: Static<
    typeof schemas.examEnvironmentPostExamAttempt.body.properties.attempt
  >,
  latestAttempt: EnvExamAttempt
): EnvExamAttempt['questionSets'] {
  const databaseAttemptQuestionSets: EnvExamAttempt['questionSets'] = [];

  for (const questionSet of userAttempt.questionSets) {
    const latestQuestionSet = latestAttempt.questionSets.find(
      qs => qs.id === questionSet.id
    );

    // If no latest attempt, add submission time to all questions
    if (!latestQuestionSet) {
      databaseAttemptQuestionSets.push({
        ...questionSet,
        questions: questionSet.questions.map(q => {
          return { ...q, submissionTimeInMS: Date.now() };
        })
      });
    } else {
      const databaseAttemptQuestionSet = {
        ...questionSet,
        questions: questionSet.questions.map(q => {
          const latestQuestion = latestQuestionSet.questions.find(
            lq => lq.id === q.id
          );

          // If no latest question, add submission time
          if (!latestQuestion) {
            return { ...q, submissionTimeInMS: Date.now() };
          }

          // If answers have changed, add submission time
          if (
            JSON.stringify(q.answers) !== JSON.stringify(latestQuestion.answers)
          ) {
            return { ...q, submissionTimeInMS: Date.now() };
          }

          return latestQuestion;
        })
      };

      databaseAttemptQuestionSets.push(databaseAttemptQuestionSet);
    }
  }

  return databaseAttemptQuestionSets;
}

/**
 * Generates an exam for the user, based on the exam configuration.
 */
export function generateExam(exam: EnvExam): Omit<EnvGeneratedExam, 'id'> {
  const examCopy = structuredClone(exam);

  const TIMEOUT_IN_MS = 5_000;
  const START_TIME = Date.now();

  const shuffledQuestionSets = shuffleArray(examCopy.questionSets).map(qs => {
    const shuffledQuestions = shuffleArray(
      qs.questions.filter(q => !q.deprecated)
    ).map(q => {
      const shuffledAnswers = shuffleArray(q.answers);
      return {
        ...q,
        answers: shuffledAnswers
      };
    });

    return {
      ...qs,
      questions: shuffledQuestions
    };
  });

  // Convert question set config by type: [[all question sets of type], [another type], ...]
  const typeConvertedQuestionSetsConfig = examCopy.config.questionSets.reduce(
    (acc, curr) => {
      // If type is already in accumulator, add to it.
      const typeIndex = acc.findIndex(a => a[0]?.type === curr.type);
      acc[typeIndex]?.push(curr) ?? acc.push([curr]);
      return acc;
    },
    [] as unknown as [EnvConfig['questionSets']]
  );

  // Heuristic:
  // TODO: The lower the number of questions able to fulfill the criteria, the harder the question set.
  // TODO: Sort difficulty, push question, sort new difficulty, push question, ...
  typeConvertedQuestionSetsConfig.forEach(qsc => {
    // Currently, the sorted order is random as this allows the existing algorithm to be retried until
    // a successful exam generation.
    qsc.sort(() => Math.round(Math.random() * 2 - 1));
  });

  const sortedQuestionSetsConfig = typeConvertedQuestionSetsConfig.flat();

  // Move all questions from set that are used to fulfill tag config.
  const questionSetsConfigWithQuestions = sortedQuestionSetsConfig.map(qsc => {
    return {
      ...qsc,
      questionSets: [] as EnvQuestionSet[]
    };
  });

  // Sort tag config by number of tags in descending order.
  const sortedTagConfig = examCopy.config.tags.sort(
    (a, b) => b.group.length - a.group.length
  );

  questionSetsConfigWithQuestionsLoop: for (const questionSetConfig of questionSetsConfigWithQuestions) {
    sortedTagConfigLoop: for (const tagConfig of sortedTagConfig) {
      shuffledQuestionSetsLoop: for (const questionSet of shuffledQuestionSets.filter(
        sqs => sqs.type === questionSetConfig.type
      )) {
        // If questionSet does not have enough questions for config, do not consider.
        if (
          questionSetConfig.numberOfQuestions > questionSet.questions.length
        ) {
          continue shuffledQuestionSetsLoop;
        }
        // If tagConfig is finished, skip.
        if (tagConfig.numberOfQuestions === 0) {
          continue sortedTagConfigLoop;
        }
        // If questionSetConfig has been fulfilled, skip.
        if (isQuestionSetConfigFulfilled(questionSetConfig)) {
          continue questionSetsConfigWithQuestionsLoop;
        }

        // Find question with at least all tags in the set.
        const questions = questionSet.questions.filter(q =>
          tagConfig.group.every(t => q.tags.some(qt => qt === t))
        );

        questionsLoop: for (const question of questions) {
          // Does question fulfill criteria for questionSetConfig:
          const numberOfCorrectAnswers = question.answers.filter(
            a => a.isCorrect
          ).length;
          const numberOfIncorrectAnswers = question.answers.filter(
            a => !a.isCorrect
          ).length;

          if (
            questionSetConfig.numberOfCorrectAnswers <=
              numberOfCorrectAnswers &&
            questionSetConfig.numberOfIncorrectAnswers <=
              numberOfIncorrectAnswers
          ) {
            if (isQuestionSetConfigFulfilled(questionSetConfig)) {
              continue questionSetsConfigWithQuestionsLoop;
            }
            // Push questionSet if it does not exist. Otherwise, just push question
            const qscqs = questionSetConfig.questionSets.find(
              qs => qs.id === questionSet.id
            );
            const questionWithCorrectNumberOfAnswers = {
              ...question,
              answers: getRandomAnswers(question, questionSetConfig)
            };
            if (!qscqs) {
              if (
                questionSetConfig.numberOfSet ===
                questionSetConfig.questionSets.length
              ) {
                break questionsLoop;
              }
              const newQuestionSetWithQuestion = {
                ...questionSet,
                questions: [questionWithCorrectNumberOfAnswers]
              };
              questionSetConfig.questionSets.push(newQuestionSetWithQuestion);
            } else {
              if (
                qscqs.questions.length === questionSetConfig.numberOfQuestions
              ) {
                break questionsLoop;
              }
              qscqs.questions.push(questionWithCorrectNumberOfAnswers);
            }

            // TODO: Issue is question set is not being removed. So, one question set is used multiple times to fulfill config.
            // Just remove question set once used? Evaluate:
            shuffledQuestionSets.splice(
              shuffledQuestionSets.findIndex(qs => qs.id === questionSet.id),
              1
            );
            // New issue: Once the set is removed, tag config might not be able to be fulfilled.

            // Remove question from questionSet, decrement tagConfig.numberOfQuestions and `questionSetConfig.numberOfQuestions`
            questionSet.questions.splice(
              questionSet.questions.findIndex(q => q.id === question.id),
              1
            );
            tagConfig.numberOfQuestions -= 1;
          }
        }
      }
    }

    // Add questions to questionSetsConfigWithQuestions until fulfilled.
    while (!isQuestionSetConfigFulfilled(questionSetConfig)) {
      if (Date.now() - START_TIME > TIMEOUT_IN_MS) {
        throw `Unable to generate exam within ${TIMEOUT_IN_MS}ms`;
      }
      // Ensure all questionSets ARE FULL
      if (
        questionSetConfig.numberOfSet > questionSetConfig.questionSets.length
      ) {
        const questionSet = shuffledQuestionSets.find(qs => {
          if (qs.type === questionSetConfig.type) {
            if (qs.questions.length >= questionSetConfig.numberOfQuestions) {
              if (qs.questions.length >= questionSetConfig.numberOfQuestions) {
                // Find questionSetConfig.numberOfQuestions who have `questionSetConfig.numberOfCorrectAnswers` and `questionSetConfig.numberOfIncorrectAnswers`
                const questions = qs.questions.filter(q => {
                  const numberOfCorrectAnswers = q.answers.filter(
                    a => a.isCorrect
                  ).length;
                  const numberOfIncorrectAnswers = q.answers.filter(
                    a => !a.isCorrect
                  ).length;
                  return (
                    numberOfCorrectAnswers >=
                      questionSetConfig.numberOfCorrectAnswers &&
                    numberOfIncorrectAnswers >=
                      questionSetConfig.numberOfIncorrectAnswers
                  );
                });

                if (questions.length >= questionSetConfig.numberOfQuestions) {
                  return true;
                }
              }
            }
          }
        });

        if (!questionSet) {
          throw `Invalid Exam Configuration for ${examCopy.id}. Not enough questions for question type ${questionSetConfig.type}.`;
        }
        // Remove questionSet from shuffledQuestionSets
        shuffledQuestionSets.splice(
          shuffledQuestionSets.findIndex(qs => qs.id === questionSet.id),
          1
        );

        const questions = questionSet.questions.filter(q => {
          const numberOfCorrectAnswers = q.answers.filter(
            a => a.isCorrect
          ).length;
          const numberOfIncorrectAnswers = q.answers.filter(
            a => !a.isCorrect
          ).length;
          return (
            numberOfCorrectAnswers >=
              questionSetConfig.numberOfCorrectAnswers &&
            numberOfIncorrectAnswers >=
              questionSetConfig.numberOfIncorrectAnswers
          );
        });

        const questionSetWithCorrectNumberOfAnswers = {
          ...questionSet,
          questions: questions.map(q => ({
            ...q,
            answers: getRandomAnswers(q, questionSetConfig)
          }))
        };

        questionSetConfig.questionSets.push(
          questionSetWithCorrectNumberOfAnswers
        );
      }

      // Ensure all existing questionSets have correct number of questions
      for (const questionSet of questionSetConfig.questionSets) {
        if (
          questionSet.questions.length < questionSetConfig.numberOfQuestions
        ) {
          const questions = shuffledQuestionSets
            .find(qs => qs.id === questionSet.id)
            ?.questions.filter(
              q => !questionSet.questions.find(qsq => qsq.id === q.id)
            );
          if (!questions) {
            throw `Invalid Exam Configuration for ${examCopy.id}. Not enough questions for question type ${questionSetConfig.type}.`;
          }

          const questionsWithEnoughAnswers = questions.filter(q => {
            const numberOfCorrectAnswers = q.answers.filter(
              a => a.isCorrect
            ).length;
            const numberOfIncorrectAnswers = q.answers.filter(
              a => !a.isCorrect
            ).length;
            return (
              numberOfCorrectAnswers >=
                questionSetConfig.numberOfCorrectAnswers &&
              numberOfIncorrectAnswers >=
                questionSetConfig.numberOfIncorrectAnswers
            );
          });

          // Push as many questions as needed to fulfill questionSetConfig
          const questionsToAdd = questionsWithEnoughAnswers.splice(
            0,
            questionSetConfig.numberOfQuestions - questionSet.questions.length
          );

          questionSet.questions.push(
            ...questionsToAdd.map(q => ({
              ...q,
              answers: getRandomAnswers(q, questionSetConfig)
            }))
          );

          // Remove questions from shuffledQuestionSets
          questionsToAdd.forEach(q => {
            const index = shuffledQuestionSets
              .find(qs => qs.id === questionSet.id)!
              .questions.findIndex(qs => qs.id === q.id);

            shuffledQuestionSets
              .find(qs => qs.id === questionSet.id)
              ?.questions.splice(index, 1);
          });
        }
      }
    }
  }

  for (const tagConfig of sortedTagConfig) {
    if (tagConfig.numberOfQuestions > 0) {
      throw `Invalid Exam Configuration for exam "${examCopy.id}". Not enough questions for tag group "${tagConfig.group.join(',')}".`;
    }
  }

  const questionSets = questionSetsConfigWithQuestions.flatMap(qsc => {
    const questionSets = qsc.questionSets;
    return questionSets.map(qs => {
      const questions = qs.questions.map(q => {
        const answers = q.answers.map(a => a.id);
        return {
          id: q.id,
          answers
        };
      });
      return {
        id: qs.id,
        questions
      };
    });
  });

  return {
    examId: examCopy.id,
    questionSets,
    deprecated: false
  };
}

function isQuestionSetConfigFulfilled(
  questionSetConfig: EnvConfig['questionSets'][number] & {
    questionSets: EnvQuestionSet[];
  }
) {
  return (
    questionSetConfig.numberOfSet === questionSetConfig.questionSets.length &&
    questionSetConfig.questionSets.every(qs => {
      return qs.questions.length === questionSetConfig.numberOfQuestions;
    })
  );
}

/**
 * Gets random answers for a question.
 */
function getRandomAnswers(
  question: EnvMultipleChoiceQuestion,
  questionSetConfig: EnvConfig['questionSets'][number]
): EnvMultipleChoiceQuestion['answers'] {
  const { numberOfCorrectAnswers, numberOfIncorrectAnswers } =
    questionSetConfig;

  const randomAnswers = shuffleArray(question.answers);
  const incorrectAnswers = randomAnswers
    .filter(a => !a.isCorrect)
    .splice(0, numberOfIncorrectAnswers);
  const correctAnswers = randomAnswers
    .filter(a => a.isCorrect)
    .splice(0, numberOfCorrectAnswers);

  if (!incorrectAnswers || !correctAnswers) {
    throw new Error(
      `Question ${question.id} does not have enough correct/incorrect answers.`
    );
  }

  const answers = incorrectAnswers.concat(correctAnswers);
  return answers;
}

/* eslint-disable jsdoc/require-description-complete-sentence */
/**
 * Shuffles an array using the Fisher-Yates algorithm.
 *
 * https://bost.ocks.org/mike/shuffle/
 */
function shuffleArray<T>(array: Array<T>) {
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m]!;
    array[m] = array[i]!;
    array[i] = t;
  }

  return array;
}
/* eslint-enable jsdoc/require-description-complete-sentence */
