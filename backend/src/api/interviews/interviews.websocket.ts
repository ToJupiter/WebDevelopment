import { Server as HttpServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { verifyToken } from '@/services/jwt.service';
import prisma from '@/services/prisma.service';
import { createAudioTranscription } from '@/services/groq.service';
import { createTempFile, deleteTempFile } from '@/services/file.service';
import { Prisma } from '@/generated/prisma/client';
import config from '@/config';

function parseCookies(request: any) {
  const list: any = {};
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function(cookie: any) {
    let [ name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
}

interface InterviewMessage {
  type: 'auth' | 'answer_audio' | 'answer_text' | 'next_question' | 'end_session';
  payload?: any;
}

interface Question {
  question_id: string;
  text: string;
  topic?: string;
}

export function setupInterviewWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/interviews/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    const cookies = parseCookies(req);
    const tokenFromCookie = cookies[config.cookieName];
    let userId: string | null = null;
    let sessionId: string | null = null;
    let currentQuestions: Question[] = [];
    let currentQuestionIndex = 0;

    console.log('New WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message: InterviewMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'auth':
            await handleAuth(message.payload);
            break;
          case 'answer_audio':
            await handleAudioAnswer(message.payload);
            break;
          case 'answer_text':
            await handleTextAnswer(message.payload);
            break;
          case 'end_session':
            handleEndSession();
            break;
          default:
            sendError('Unknown message type');
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        sendError('Internal server error');
      }
    });

    // --- Handlers ---

    async function handleAuth(payload: { token?: string; session_id: string }) {
      const token = payload.token || tokenFromCookie;
      if (!token) {
        sendError('Authentication required');
        ws.close();
        return;
      }
      const decoded = verifyToken(token);
      if (!decoded) {
        sendError('Invalid token');
        ws.close();
        return;
      }

      userId = decoded.user_id;
      sessionId = payload.session_id;

      const session = await prisma.interviewSession.findUnique({
        where: { session_id: sessionId },
      });

      if (!session || session.user_id !== userId) {
        sendError('Session not found or unauthorized');
        ws.close();
        return;
      }

      // Load Questions
      currentQuestions = session.questions as unknown as Question[];
      
      // Determine where to start (if resuming)
      const existingAnswers = (session.user_answers as unknown as any[]) || [];
      currentQuestionIndex = existingAnswers.length;

      if (currentQuestionIndex >= currentQuestions.length) {
        sendMessage('finished', { message: 'Interview already completed' });
      } else {
        sendNextQuestion();
      }
    }

    async function handleAudioAnswer(payload: { audio_base64: string }) {
      if (!userId || !sessionId) return sendError('Not authenticated');

      const buffer = Buffer.from(payload.audio_base64, 'base64');
      const tempPath = await createTempFile(buffer, '.webm'); // Assuming webm from browser

      try {
        // 1. Transcribe
        const transcription = await createAudioTranscription(tempPath);
        const textAnswer = transcription.text;

        // 2. Save Answer
        await saveAnswerToDB(textAnswer);

        // 3. Ack to client
        sendMessage('transcription', { text: textAnswer, question_id: currentQuestions[currentQuestionIndex].question_id });

        // 4. Move Next
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
          sendNextQuestion();
        } else {
          sendMessage('finished', { message: 'All questions answered' });
        }

      } catch (error) {
        console.error('Transcription error:', error);
        sendError('Failed to process audio');
      } finally {
        await deleteTempFile(tempPath);
      }
    }

    async function handleTextAnswer(payload: { text: string }) {
      if (!userId || !sessionId) return sendError('Not authenticated');
      
      await saveAnswerToDB(payload.text);
      
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestions.length) {
        sendNextQuestion();
      } else {
        sendMessage('finished', { message: 'All questions answered' });
      }
    }

    async function saveAnswerToDB(answerText: string) {
      if (!sessionId) return;
      
      const currentQ = currentQuestions[currentQuestionIndex];
      const newAnswer = {
        question_id: currentQ.question_id,
        question_text: currentQ.text,
        answer: answerText,
        timestamp: new Date()
      };

      // Atomic update of the JSON array
      // Note: Prisma doesn't support direct array push easily for JSON, 
      // so we fetch, push, update. In high concurency this is bad, 
      // but for single user session it's acceptable.
      const session = await prisma.interviewSession.findUnique({ where: { session_id: sessionId }});
      const currentAnswers = (session?.user_answers as unknown as any[]) || [];
      
      await prisma.interviewSession.update({
        where: { session_id: sessionId },
        data: {
          user_answers: [...currentAnswers, newAnswer] as Prisma.InputJsonValue
        }
      });
    }

    function sendNextQuestion() {
      const q = currentQuestions[currentQuestionIndex];
      sendMessage('question', {
        index: currentQuestionIndex,
        total: currentQuestions.length,
        question_id: q.question_id,
        text: q.text
      });
    }

    function handleEndSession() {
      // Trigger AI feedback generation logic here if needed, 
      // or client calls the REST submit endpoint to finalize.
      ws.close();
    }

    function sendMessage(type: string, payload: any) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, payload }));
      }
    }

    function sendError(message: string) {
      sendMessage('error', { message });
    }
  });
}