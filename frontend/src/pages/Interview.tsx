import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/ui/Common';
import { Send, Clock, RefreshCw } from 'lucide-react';
import { InterviewFeedback } from '../types';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import { useInterviewSocket } from '../hooks/useInterviewSocket';

const Interview = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { lastMessage, sendMessage } = useInterviewSocket(sessionId);
  
  const [timer, setTimer] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Current Question State
  const [question, setQuestion] = useState<{ id: string; text: string; index: number; total: number } | null>(null);
  const [answers, setAnswers] = useState<{ question_id: string; answer: string }[]>([]);

  // Timer Logic - Auto start when question is present
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (question && !isProcessing && !feedback) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [question, isProcessing, feedback]);

  // WebSocket Message Handling
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'question':
        setQuestion({
          id: lastMessage.payload.question_id,
          text: lastMessage.payload.text,
          index: lastMessage.payload.index,
          total: lastMessage.payload.total,
        });
        setCurrentAnswer(""); 
        setTimer(0);
        setIsProcessing(false);
        break;
      
      case 'finished':
        // Triggered by socket when no more questions
        // We rely on the effect below to handle final submission if needed, 
        // OR we can trust the 'finished' event to be the signal to stop.
        // However, we usually send the LAST answer before this.
        // The backend might send 'finished' after the last answer ack.
        // We just need to stop processing.
        break;

      case 'error':
        console.error("Socket error:", lastMessage.payload.message);
        setIsProcessing(false);
        break;
    }
  }, [lastMessage]);

  const startSession = async () => {
    try {
      setIsProcessing(true);
      const res = await api.post('/interviews/sessions', {
        session_name: `Practice Session ${new Date().toLocaleDateString()}`,
        interview_type: 'simulated'
      });
      setSessionId(res.data.data.session_id);
    } catch (error) {
      console.error("Failed to start session", error);
      setIsProcessing(false);
    }
  };

  const submitAnswer = () => {
    if (!question) return;

    setIsProcessing(true);
    const finalAnswer = currentAnswer.trim() || "No answer provided.";
    
    // Update local answers state
    const newAnswers = [...answers, { question_id: question.id, answer: finalAnswer }];
    setAnswers(newAnswers);

    // Send to WebSocket
    // Note: The backend will reply with next 'question' OR 'finished'
    sendMessage('answer_text', { text: finalAnswer });
  };
  
  // Watch for 'finished' message to submit all answers to backend for final scoring
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
      if (lastMessage?.type === 'finished') {
          setIsProcessing(true);
          api.post(`/interviews/sessions/${sessionId}/submit`, {
              user_answers: answersRef.current
          }).then(res => {
              setFeedback(res.data.data.ai_feedback);
              setSessionId(null);
          }).catch(err => console.error(err))
          .finally(() => setIsProcessing(false));
      }
  }, [lastMessage, sessionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreData = feedback ? [
    { name: 'Score', uv: feedback.score || 0, fill: '#6366f1' },
    { name: 'Max', uv: 100, fill: '#e2e8f0' }
  ] : [];

  if (!sessionId && !feedback && !isProcessing) {
      return (
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
            <Card className="max-w-md w-full text-center p-8">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Interview</h2>
                <p className="text-slate-500 mb-8">
                    Start a simulated technical interview. You'll have time to type your answers to 4 questions.
                </p>
                <Button onClick={startSession} className="w-full" size="lg">Start Session</Button>
            </Card>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col relative overflow-hidden">
          {question && (
             <div className="w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((question.index + 1) / question.total) * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Question {question.index + 1} of {question.total}</span>
                    <div className="flex items-center gap-2 text-slate-500 font-mono">
                        <Clock size={16} />
                        {formatTime(timer)}
                    </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
                    {question.text}
                </h2>
                
                <textarea 
                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono text-sm leading-relaxed"
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={isProcessing}
                    autoFocus
                />
                
                <div className="mt-6 flex justify-end">
                    <Button 
                        onClick={submitAnswer} 
                        disabled={!currentAnswer.trim() || isProcessing}
                        icon={<Send size={16} />}
                        className="px-8"
                    >
                        {isProcessing ? 'Submitting...' : 'Submit Answer'}
                    </Button>
                </div>
             </div>
          )}

          {!question && !feedback && (
             <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">Connecting to interviewer...</div>
          )}
        </div>
      </div>

      {(feedback || isProcessing) && !question && (
        <div className={`w-full lg:w-96 flex flex-col transition-all duration-500`}>
             {isProcessing && !feedback ? (
                <Card className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium">Analyzing...</p>
                </Card>
             ) : feedback ? (
               <div className="space-y-4 h-full overflow-y-auto">
                 <Card className="text-center relative overflow-hidden">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-2">Confidence Score</h3>
                    <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="60%" outerRadius="100%" data={scoreData} startAngle={180} endAngle={0} cy="70%">
                        <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="uv" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pt-8">
                        <span className="text-4xl font-bold text-slate-900">{feedback.score}</span>
                    </div>
                    </div>
                 </Card>

                 <Card title="AI Feedback" className="flex-1">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{feedback.summary}</p>
                 </Card>

                 <Button 
                    className="w-full" 
                    variant="outline" 
                    icon={<RefreshCw size={16} />}
                    onClick={() => {
                        setFeedback(null);
                        setAnswers([]);
                        setQuestion(null);
                        setCurrentAnswer("");
                    }}
                 >
                    Start New Session
                 </Button>
               </div>
             ) : null}
        </div>
      )}
    </div>
  );
};

export default Interview;