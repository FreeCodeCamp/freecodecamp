import { graphql, navigate } from 'gatsby';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { ObserveKeys } from 'react-hotkeys';
import { Trans, useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { useLocation } from '@reach/router';
import {
  Container,
  Col,
  Row,
  Button,
  Quiz,
  useQuiz,
  Spacer,
  Callout
} from '@freecodecamp/ui';
import { useFeature } from '@growthbook/growthbook-react';

// Local Utilities
import { shuffleArray } from '../../../../../shared/utils/shuffle-array';
import LearnLayout from '../../../components/layouts/learn';
import type {
  ChallengeNode,
  ChallengeMeta,
  NavigationPaths,
  Test,
  User
} from '../../../redux/prop-types';
import ChallengeDescription from '../components/challenge-description';
import Hotkeys from '../components/hotkeys';
import ChallengeTitle from '../components/challenge-title';
import CompletionModal from '../components/completion-modal';
import { getChallengePaths } from '../utils/challenge-paths';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  closeModal,
  updateSolutionFormValues,
  initTests,
  submitQuizAttempt
} from '../redux/actions';
import { isSignedInSelector, userSelector } from '../../../redux/selectors';
import { ButtonLink, Link } from '../../../components/helpers';
import {
  isChallengeCompletedSelector,
  isQuizAttemptSubmittingSelector
} from '../redux/selectors';
import PrismFormatted from '../components/prism-formatted';
import { usePageLeave } from '../hooks';
import ExitQuizModal from './exit-quiz-modal';
import FinishQuizModal from './finish-quiz-modal';
import { getAvailableQuizzes, getReviewBlock } from './helpers';
import { QuizLockedMessage } from './quiz-locked-message';

import './show.css';

const COOL_DOWN_PERIOD_IN_MS = 1000 * 60 * 60; // one hour

// Redux Setup
const mapStateToProps = createSelector(
  isChallengeCompletedSelector,
  isSignedInSelector,
  userSelector,
  isQuizAttemptSubmittingSelector,
  (
    isChallengeCompleted: boolean,
    isSignedIn: boolean,
    user: User,
    isQuizAttemptSubmitting: boolean
  ) => ({
    isChallengeCompleted,
    isSignedIn,
    user,
    isQuizAttemptSubmitting
  })
);
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      initTests,
      updateChallengeMeta,
      challengeMounted,
      updateSolutionFormValues,
      submitQuizAttempt,
      openCompletionModal: () => openModal('completion'),
      openExitQuizModal: () => openModal('exitQuiz'),
      closeExitQuizModal: () => closeModal('exitQuiz'),
      openFinishQuizModal: () => openModal('finishQuiz'),
      closeFinishQuizModal: () => closeModal('finishQuiz')
    },
    dispatch
  );

// Types
interface ShowQuizProps {
  challengeMounted: (arg0: string) => void;
  data: { challengeNode: ChallengeNode };
  description: string;
  initTests: (xs: Test[]) => void;
  isChallengeCompleted: boolean;
  pageContext: {
    challengeMeta: ChallengeMeta;
    nextCurriculumPaths: NavigationPaths;
  };
  isSignedIn: boolean;
  user: User;
  isQuizAttemptSubmitting: boolean;
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  updateSolutionFormValues: () => void;
  submitQuizAttempt: ({
    challengeId,
    quizId
  }: {
    challengeId: string;
    quizId: string;
  }) => void;
  openCompletionModal: () => void;
  openExitQuizModal: () => void;
  closeExitQuizModal: () => void;
  openFinishQuizModal: () => void;
  closeFinishQuizModal: () => void;
}

const ShowQuiz = ({
  challengeMounted,
  data: {
    challengeNode: {
      challenge: {
        fields: { tests, blockHashSlug },
        id: challengeId,
        title,
        description,
        challengeType,
        helpCategory,
        superBlock,
        chapter,
        module,
        block,
        translationPending,
        quizzes
      }
    }
  },
  pageContext: { challengeMeta, nextCurriculumPaths },
  initTests,
  updateChallengeMeta,
  isChallengeCompleted,
  user: { quizAttempts = [] },
  isQuizAttemptSubmitting,
  submitQuizAttempt,
  openCompletionModal,
  openExitQuizModal,
  closeExitQuizModal,
  openFinishQuizModal,
  closeFinishQuizModal
}: ShowQuizProps) => {
  const { t } = useTranslation();
  const curLocation = useLocation();

  const container = useRef<HTMLElement | null>(null);

  // `isPassed` is used as a flag to conditionally render the finish or submit button.
  // The difference between `isPassed` and `isChallengeCompleted` is,
  // the value of `isPassed` is set when campers click the finish quiz button,
  // while `isChallengeCompleted` comes from the DB and is only set to `true`
  // when campers click the submit button on the completion modal.
  const [isPassed, setIsPassed] = useState(false);

  const [showUnanswered, setShowUnanswered] = useState(false);

  const [exitConfirmed, setExitConfirmed] = useState(false);
  const showNextCurriculum = useFeature('fcc-10').on;

  const blockNameTitle = `${t(
    `intro:${superBlock}.blocks.${block}.title`
  )} - ${title}`;

  const attemptedQuiz = quizAttempts.find(
    attempt => attempt.challengeId === challengeId
  );

  const timeUntilCooldownExpires = attemptedQuiz
    ? attemptedQuiz.timestamp + COOL_DOWN_PERIOD_IN_MS - Date.now()
    : 0;

  const minutesUntilCooldownExpires = Math.ceil(
    timeUntilCooldownExpires / 1000 / 60
  );

  const [availableQuizzes] = useState(
    getAvailableQuizzes({ quizzes, attemptedQuiz })
  );

  const [quizId] = useState(
    Math.floor(Math.random() * availableQuizzes.length)
  );

  const quiz = availableQuizzes[quizId].questions;

  const reviewBlock = getReviewBlock({ chapter, module });

  // Initialize the data passed to `useQuiz`
  const [initialQuizData] = useState(
    quiz.map(question => {
      const distractors = question.distractors.map((distractor, index) => {
        return {
          label: (
            <PrismFormatted className='quiz-answer-label' text={distractor} />
          ),
          value: index + 1
        };
      });

      const answer = {
        label: (
          <PrismFormatted
            className='quiz-answer-label'
            text={question.answer}
          />
        ),
        value: 4
      };

      return {
        question: <PrismFormatted text={question.text} />,
        answers: shuffleArray([...distractors, answer]),
        correctAnswer: answer.value
      };
    })
  );

  const {
    questions: quizData,
    validateAnswers,
    validated,
    correctAnswerCount
  } = useQuiz({
    initialQuestions: initialQuizData,
    validationMessages: {
      correct: t('learn.quiz.correct-answer'),
      incorrect: t('learn.quiz.incorrect-answer')
    },
    passingGrade: 85,
    onSuccess: () => {
      openCompletionModal();
      setIsPassed(true);
    },
    onFailure: () => {
      setIsPassed(false);
      submitQuizAttempt({
        challengeId,
        quizId: quizId.toString()
      });
    }
  });

  // We show the quiz if:
  // - Campers have successfully completed the quiz
  // - Campers failed the quiz but the cooldown period has expired
  // - Campers just finished answering the quiz and are shown the quiz feedback (`validated` being `true`)
  const shouldShowQuiz =
    isChallengeCompleted || timeUntilCooldownExpires <= 0 || validated;

  const isQuizDisabled = isQuizAttemptSubmitting || validated;

  const unanswered = quizData.reduce<number[]>(
    (acc, curr, id) => (curr.selectedAnswer == null ? [...acc, id + 1] : acc),
    []
  );

  useEffect(() => {
    initTests(tests);
    const challengePaths = getChallengePaths({
      showNextCurriculum,
      currentCurriculumPaths: challengeMeta,
      nextCurriculumPaths
    });
    updateChallengeMeta({
      ...challengeMeta,
      title,
      challengeType,
      helpCategory,
      ...challengePaths
    });
    challengeMounted(challengeMeta.id);
    container.current?.focus();
    // This effect should be run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinishQuiz = () => {
    setShowUnanswered(true);

    if (unanswered.length === 0) {
      openFinishQuizModal();
    }
  };

  const handleFinishQuizModalBtnClick = () => {
    validateAnswers();
    closeFinishQuizModal();
  };

  const handleSubmitAndGo = () => {
    openCompletionModal();
  };

  const handleExitQuiz = () => {
    openExitQuizModal();
  };

  const handleExitQuizModalBtnClick = () => {
    setExitConfirmed(true);
    void navigate(blockHashSlug);
    closeExitQuizModal();
  };

  // If campers pass the quiz, we don't immediately submit the quiz attempt.
  // Instead, we wait until they click the submit button on the completion modal
  // so that the block completion and quiz attempt are recorded at the same time.
  // Otherwise, there could be a case where campers close the completion modal without submitting
  // while the attempt has been recorded,
  // and the next time they visit the quiz, they would not be allowed to take it
  // due to `isChallengeCompleted` being `false` and recent attempt being truthy.
  const handleCompletionModalBtnClick = () => {
    submitQuizAttempt({
      challengeId,
      quizId: quizId.toString()
    });
  };

  const onWindowClose = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!shouldShowQuiz) {
        return;
      }

      event.preventDefault();
      window.confirm(t('misc.navigation-warning'));
    },
    [t, shouldShowQuiz]
  );

  const onHistoryChange = useCallback(() => {
    // We don't block navigation in the following cases.
    // - When campers have submitted the quiz:
    //   - If they don't pass, the Finish Quiz button is disabled, there isn't anything for them to do other than leaving the page
    //   - If they pass, the Submit-and-go button shows up, and campers should be allowed to leave the page
    // - When they have clicked the exit button on the exit modal
    if (!shouldShowQuiz || isQuizDisabled || exitConfirmed) {
      return;
    }

    void navigate(`${curLocation.pathname}`);
    openExitQuizModal();
  }, [
    curLocation.pathname,
    isQuizDisabled,
    exitConfirmed,
    openExitQuizModal,
    shouldShowQuiz
  ]);

  usePageLeave({
    onWindowClose,
    onHistoryChange
  });

  function getErrorMessage() {
    if (showUnanswered && unanswered.length > 0) {
      return t('learn.quiz.unanswered-questions', {
        unansweredQuestions: unanswered.join(', ')
      });
    }

    if (validated && isPassed) {
      return t('learn.quiz.have-n-correct-questions', {
        correctAnswerCount,
        total: quiz.length
      });
    }

    if (validated && !isPassed) {
      return (
        <>
          <p>
            {t('learn.quiz.have-n-correct-questions', {
              correctAnswerCount,
              total: quiz.length
            })}
          </p>
          {reviewBlock && (
            <p>
              <Trans i18nKey='learn.quiz.review-material-and-try-again'>
                <Link to={`/learn/${superBlock}/#${reviewBlock.dashedName}`}>
                  placeholder
                </Link>
                <span>{{ minutesUntilCooldownExpires }}</span>
              </Trans>
            </p>
          )}
        </>
      );
    }

    return '';
  }

  const errorMessage = getErrorMessage();

  const renderQuizActions = () => {
    if (!validated) {
      return (
        <>
          <Button
            block={true}
            variant='primary'
            onClick={handleFinishQuiz}
            disabled={isQuizDisabled}
          >
            {t('buttons.finish-quiz')}
          </Button>
          <Spacer size='xxs' />
          <Button block={true} variant='primary' onClick={handleExitQuiz}>
            {t('buttons.exit-quiz')}
          </Button>
        </>
      );
    }

    if (isPassed) {
      return (
        <>
          <Button block={true} variant='primary' onClick={handleSubmitAndGo}>
            {t('buttons.submit-and-go')}
          </Button>
          <Spacer size='xxs' />
          <Button
            block={true}
            variant='primary'
            onClick={handleExitQuiz}
            disabled
          >
            {t('buttons.exit-quiz')}
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          block={true}
          variant='primary'
          onClick={handleFinishQuiz}
          disabled={isQuizDisabled}
        >
          {t('buttons.finish-quiz')}
        </Button>
        <Spacer size='xxs' />
        <ButtonLink block href={`/learn/${superBlock}/#${block}`}>
          {t('buttons.exit-quiz')}
        </ButtonLink>
      </>
    );
  };

  return (
    <Hotkeys
      executeChallenge={!isPassed ? handleFinishQuiz : handleSubmitAndGo}
      containerRef={container}
    >
      <LearnLayout>
        <Helmet
          title={`${blockNameTitle} | ${t('learn.learn')} | freeCodeCamp.org`}
        />
        <Container className='quiz-challenge-container'>
          <Row>
            <Spacer size='m' />
            <ChallengeTitle
              isCompleted={isChallengeCompleted}
              translationPending={translationPending}
            >
              {title}
            </ChallengeTitle>

            <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
              <Spacer size='m' />
              {!shouldShowQuiz && reviewBlock ? (
                <QuizLockedMessage
                  superBlock={superBlock}
                  reviewBlock={reviewBlock.dashedName}
                  block={block}
                  minutesUntilCooldownExpires={minutesUntilCooldownExpires}
                />
              ) : (
                <>
                  {isChallengeCompleted && (
                    <Callout variant='info'>
                      {t('learn.quiz.already-passed')}
                    </Callout>
                  )}
                  <ChallengeDescription
                    description={description}
                    superBlock={superBlock}
                  />
                  <Spacer size='l' />
                  <ObserveKeys>
                    <Quiz questions={quizData} disabled={isQuizDisabled} />
                  </ObserveKeys>
                  <Spacer size='m' />
                  <div aria-live='polite' aria-atomic='true'>
                    {errorMessage}
                  </div>
                  <Spacer size='m' />
                  {renderQuizActions()}
                  <Spacer size='l' />
                </>
              )}
            </Col>
          </Row>
        </Container>
        <CompletionModal onComplete={handleCompletionModalBtnClick} />
        <ExitQuizModal onExit={handleExitQuizModalBtnClick} />
        <FinishQuizModal onFinish={handleFinishQuizModalBtnClick} />
      </LearnLayout>
    </Hotkeys>
  );
};

ShowQuiz.displayName = 'ShowQuiz';

export default connect(mapStateToProps, mapDispatchToProps)(ShowQuiz);

export const query = graphql`
  query QuizChallenge($id: String!) {
    challengeNode(id: { eq: $id }) {
      challenge {
        id
        title
        description
        challengeType
        helpCategory
        superBlock
        chapter
        module
        block
        fields {
          blockHashSlug
          blockName
          slug
          tests {
            text
            testString
          }
        }
        quizzes {
          questions {
            distractors
            text
            answer
          }
        }
        translationPending
      }
    }
  }
`;
