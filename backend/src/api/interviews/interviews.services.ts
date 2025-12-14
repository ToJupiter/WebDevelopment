import { InterviewType, Prisma } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';
import { createChatCompletion, extractFirstMessageContent, ChatMessage } from '@/services/groq.service';

export interface InterviewQuestion {
  question_id: string;
  text: string;
  topic?: string;
  context?: string;
}

export interface InterviewAnswer {
  question_id: string;
  answer: string;
}

const questionBank: InterviewQuestion[] = [
  {
    question_id: 'react-lifecycle',
    text: 'Explain the React component lifecycle and how it relates to rendering patterns.',
    topic: 'React',
  },
  {
    question_id: 'async-await',
    text: 'Describe how async/await differs from raw Promises and event loop timing.',
    topic: 'JavaScript',
  },
  {
    question_id: 'rest-security',
    text: 'What techniques do you use to secure a REST API in production?',
    topic: 'Security',
  },
  {
    question_id: 'sql-optimization',
    text: 'How do you approach optimizing a slow SQL query?',
    topic: 'Database',
  },
  {
    question_id: 'testing-strategy',
    text: 'Explain your testing pyramid for a new feature.',
    topic: 'Testing',
  },
  {
    question_id: 'design-tradeoffs',
    text: 'Describe how you balance developer productivity versus technical debt.',
    topic: 'Architecture',
  },
  {
    question_id: 'teamwork',
    text: 'How do you collaborate effectively with product and design during a release?',
    topic: 'Soft Skills',
  },
];

const SESSION_QUESTION_COUNT = 4;

async function selectQuestionsForUser(userId: string) {
  const progress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    orderBy: { last_accessed_at: 'desc' },
    take: 5,
  });
  const recentTopics = new Set<string>();
  progress.forEach((entry) => {
    if (entry.module_id) {
      recentTopics.add(entry.module_id);
    }
  });

  const selected: InterviewQuestion[] = [];
  const usedIds = new Set<string>();

  for (const question of questionBank) {
    if (selected.length >= SESSION_QUESTION_COUNT) {
      break;
    }
    if (recentTopics.has(question.question_id)) {
      usedIds.add(question.question_id);
      selected.push(question);
    }
  }

  for (const question of questionBank) {
    if (selected.length >= SESSION_QUESTION_COUNT) {
      break;
    }
    if (!usedIds.has(question.question_id)) {
      usedIds.add(question.question_id);
      selected.push(question);
    }
  }

  return selected;
}

interface InterviewFeedback {
  summary: string;
  score: number;
  highlights?: string;
  areas_for_growth?: string;
  raw?: string;
}

async function buildInterviewFeedback(questions: InterviewQuestion[], answers: InterviewAnswer[]) {
  const questionList = questions.map((question, index) => `${index + 1}. ${question.text}`).join('\n');
  const answerList = answers.map((answer, index) => `${index + 1}. ${answer.question_id}: ${answer.answer}`).join('\n');
  const systemMessage: ChatMessage = {
    role: 'system',
    content: 'You are an interview coach. Provide concise, constructive feedback.',
  };
  const userMessage: ChatMessage = {
    role: 'user',
    content: `Questions:\n${questionList}\n\nAnswers:\n${answerList}\n\nRespond as JSON with summary, score, highlights, areas_for_growth. Score between 0 and 100.`,
  };

  const completion = await createChatCompletion([systemMessage, userMessage], 'openai/gpt-oss-20b', 0.5);
  const raw = extractFirstMessageContent(completion);
  let parsed: Partial<InterviewFeedback> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = {};
    }
  }

  const scoreCandidate = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score ?? NaN);
  const normalizedScore = Number.isFinite(scoreCandidate) ? Math.min(Math.max(scoreCandidate, 0), 100) : 0;

  return {
    summary: parsed.summary ?? raw ?? 'Insights currently unavailable.',
    score: normalizedScore,
    highlights: parsed.highlights,
    areas_for_growth: parsed.areas_for_growth,
    raw,
  };
}

export async function createInterviewSession(userId: string, payload: { session_name: string; interview_type: InterviewType }) {
  const questions = await selectQuestionsForUser(userId);
  const payloadJson = questions as unknown as Prisma.InputJsonValue;
  return prisma.interviewSession.create({
    data: {
      user_id: userId,
      session_name: payload.session_name,
      interview_type: payload.interview_type,
      questions: payloadJson,
    },
  });
}

export async function submitInterviewSession(userId: string, sessionId: string, answers: InterviewAnswer[]) {
  const session = await prisma.interviewSession.findUnique({ where: { session_id: sessionId } });
  if (!session || session.user_id !== userId) {
    return null;
  }
  const storedQuestions = (session.questions as unknown as InterviewQuestion[]) ?? [];
  const feedback = await buildInterviewFeedback(storedQuestions, answers);
  const answersJson = answers as unknown as Prisma.InputJsonValue;
  return prisma.interviewSession.update({
    where: { session_id: sessionId },
    data: {
      user_answers: answersJson,
      ai_feedback: feedback,
      score: feedback.score,
    },
  });
}

export async function listSessions(userId: string) {
  const sessions = await prisma.interviewSession.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      session_id: true,
      session_name: true,
      interview_type: true,
      score: true,
      created_at: true,
      ai_feedback: true,
    },
  });
  return sessions.map((session) => ({
    ...session,
    score: session.score ? Number(session.score) : null,
  }));
}