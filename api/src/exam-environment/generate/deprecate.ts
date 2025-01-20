import { PrismaClient } from '@prisma/client';
import { MONGOHQ_URL } from '../../utils/env';

const args = process.argv.slice(2);
const ENV_EXAM_ID = args[0];

if (!ENV_EXAM_ID) {
  throw 'First argument must be the EnvExam _id';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: MONGOHQ_URL
    }
  }
});

async function main() {
  console.info('Connecting to cluster...');
  await prisma.$connect();
  console.info('Connected.');

  try {
    await prisma.envExam.update({
      where: {
        id: ENV_EXAM_ID
      },
      data: {
        deprecated: true
      }
    });
    console.info(`Exam "${ENV_EXAM_ID}" deprecated...`);
    const res = await prisma.envGeneratedExam.updateMany({
      where: {
        examId: ENV_EXAM_ID
      },
      data: {
        deprecated: true
      }
    });

    console.info(`${res.count} generated exams deprecated...`);
  } catch (e) {
    console.error('Unable to deprecate exam due to:');
    console.error(e);
  }

  console.info(`Finished deprecating exam.`);
}

void main();
