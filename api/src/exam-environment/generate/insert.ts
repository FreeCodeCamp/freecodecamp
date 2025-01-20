import { readFile } from 'fs/promises';
import { EnvExam, PrismaClient } from '@prisma/client';
import { MONGOHQ_URL } from '../../utils/env';

const args = process.argv.slice(2);
const EXAM_JSON_PATH = args[0];

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

  if (!EXAM_JSON_PATH) {
    throw 'First argument must be the file path to the exam';
  }

  const exam_str = await readFile(EXAM_JSON_PATH, 'utf-8');

  const exam = JSON.parse(exam_str) as EnvExam;

  try {
    const res = await prisma.envExam.create({
      data: exam
    });

    console.info(
      `Exam "${res.config.name}" has been assigned id: "${res.id}".`
    );
  } catch (e) {
    console.error('Unable to insert exam due to:');
    console.error(e);
  }
}

void main();
