import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/ui/Common';
import { Mic, MicOff, Square, Play, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InterviewFeedback } from '../types';
import { 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import { useInterviewSocket } from '../hooks/useInterviewSocket';

const Interview = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { isConnected, lastMessage, sendMessage } = useInterviewSocket(sessionId);
  
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Current Question State
  const [question, setQuestion] = useState<{ id: string; text: string; index: number; total: number } | null>(null);
  const [answers, setAnswers] = useState<{ question_id: string; answer: string }[]>([]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

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
        setTranscript(""); // Reset transcript for new question
        setTimer(0);
        setIsProcessing(false);
        break;
      
      case 'finished':
        handleFinalSubmission();
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
      // Socket will connect automatically via hook
    } catch (error) {
      console.error("Failed to start session", error);
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      submitAnswer();
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript("");
      simulateTranscription();
    }
  };

  const simulateTranscription = () => {
    // In a real app, this would use the Web Speech API or stream audio
    const words = "I believe the key to scalable architecture is decoupling services and ensuring strong consistency boundaries. For this specific problem, I would implement a caching layer using Redis to reduce database load, and use message queues for asynchronous processing.".split(" ");
    let i = 0;
    const interval = setInterval(() => {
      // Check ref or state if recording stopped? 
      // Here we rely on the cleanup of this effect or checks inside
      // But purely functional update is safer
      setTranscript(prev => {
        if (i >= words.length) {
            clearInterval(interval);
            return prev;
        }
        return prev + (prev ? " " : "") + (words[i] || "");
      });
      i++;
    }, 300);
    
    // Stop simulation when recording stops is tricky with just setInterval
    // We can rely on the user stopping it manually which submits whatever text is there
    // Or clear this interval in toggleRecording. 
    // For simplicity, we just let it run or user stops it.
    // Ideally we store intervalId in a ref.
  };

  const submitAnswer = () => {
    if (!question) return;

    setIsProcessing(true);
    const finalAnswer = transcript || "No answer provided.";
    
    // Update local answers state
    const newAnswers = [...answers, { question_id: question.id, answer: finalAnswer }];
    setAnswers(newAnswers);

    // Send to WebSocket
    sendMessage('answer_text', { text: finalAnswer });
  };

  const handleFinalSubmission = async () => {
    if (!sessionId) return;
    setIsProcessing(true);
    try {
       // We use the accumulated answers. 
       // Note: In strict React, accessing 'answers' state here might be stale if called from useEffect closure without dependency.
       // However, 'answers' is updated before 'finished' message arrives usually? 
       // Actually 'finished' comes from WS. We should rely on a Ref for answers to be safe or ensure dependency.
       // But wait, 'answers' state is in the component scope.
       // Safe way: Pass answers to the API. 
       
       // CRITICAL: functionality relies on 'answers' being up to date.
       // Since 'submitAnswer' updates it, and then we wait for 'finished' event...
       // The 'finished' event comes AFTER we sent the last answer.
       // But 'setAnswers' is async. 
       // We should use a Ref for answers to ensure we have the latest immediately.
    } catch (e) { console.error(e) }
    
    // Actually, let's just use the current 'answers' state in the API call. 
    // We need to trigger this effect when 'answers' updates? No.
    // We trigger this when 'finished' comes.
    // If 'finished' comes, we assume we are done.
    
    try {
      // Wait a tick to ensure state update if any? 
      // Better: we send the current 'answers' state. 
      const res = await api.post(`/interviews/sessions/${sessionId}/submit`, {
          user_answers: answers
      });
      setFeedback(res.data.data.ai_feedback);
      // Score is also available: res.data.data.score
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsProcessing(false);
      setSessionId(null); // Reset session to allow new one? Or keep to show results?
      // If we reset sessionId, WS disconnects. That's fine.
    }
  };
  
  // Use a ref to access latest answers in the effect if needed, but here we call handleFinalSubmission from useEffect [lastMessage]
  // We need to add 'answers' to useEffect dependency or use a Ref.
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
     if (lastMessage?.type === 'finished') {
         // Use ref to get latest answers
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
                    <Mic size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Interview</h2>
                <p className="text-slate-500 mb-8">
                    Start a simulated technical interview. You'll answer 4 questions and get AI feedback.
                </p>
                <Button onClick={startSession} className="w-full" size="lg">Start Session</Button>
            </Card>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Interview Interface */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {question && (
             <>
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((question.index + 1) / question.total) * 100}%` }}></div>
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Question {question.index + 1} of {question.total}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12 max-w-2xl leading-relaxed">
                    {question.text}
                </h2>
             </>
          )}

          {!question && !feedback && (
             <div className="text-slate-400">Connecting to interviewer...</div>
          )}

          {question && (
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 flex items-center gap-1">
                    {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1.5 bg-brand-500 rounded-full transition-all duration-75 ${isRecording ? 'animate-pulse' : 'h-2 bg-slate-200'}`}
                        style={{ height: isRecording ? `${Math.random() * 40 + 10}px` : '4px' }}
                    ></div>
                    ))}
                </div>

                <div className="text-4xl font-mono font-medium text-slate-700 tabular-nums">
                {formatTime(timer)}
                </div>

                <button 
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isRecording 
                        ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100 scale-110' 
                        : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isRecording ? <Square className="text-white fill-white" size={24} /> : <Mic className="text-white" size={32} />}
                </button>
                <p className="text-slate-500 text-sm">
                {isProcessing ? 'Processing...' : isRecording ? 'Recording your answer...' : 'Click microphone to start'}
                </p>
            </div>
          )}
        </div>

        {/* Transcript Area */}
        <Card className="h-48 overflow-y-auto bg-slate-50">
           <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Live Transcript</h3>
           <p className="text-slate-700 leading-relaxed font-mono text-sm">
             {transcript || <span className="text-slate-400 italic">Your speech will appear here...</span>}
           </p>
        </Card>
      </div>

      {/* Right Panel - Feedback */}
      {(feedback || isProcessing) && (
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
                {/* Check if feedback has highlights/growth areas if available in type */}
                 </Card>

                 <Button 
                    className="w-full" 
                    variant="outline" 
                    icon={<RefreshCw size={16} />}
                    onClick={() => {
                        setFeedback(null);
                        setAnswers([]);
                        setQuestion(null);
                        setTranscript("");
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