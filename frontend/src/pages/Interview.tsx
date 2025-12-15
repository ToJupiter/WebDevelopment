import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui/Common';
import { Mic, MicOff, Square, Play, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateInterviewFeedback } from '../services/gemini';
import { InterviewFeedback } from '../types';
import { 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    "Tell me about a challenging technical problem you solved recently.",
    "Explain the concept of closures in JavaScript.",
    "How do you handle state management in a large React application?",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      handleSubmission();
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript("");
      setFeedback(null);
      setTimer(0);
      // Simulate real-time transcription
      simulateTranscription();
    }
  };

  const simulateTranscription = () => {
    const words = "I recently worked on optimizing a large-scale data visualization dashboard. The main challenge was rendering thousands of data points without blocking the main thread. I implemented a virtualization strategy using react-window and moved data processing to a Web Worker. This reduced the initial load time by 40% and improved frame rates significantly during interactions.".split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (!isRecording && i >= words.length) clearInterval(interval);
      setTranscript(prev => prev + (prev ? " " : "") + (words[i] || ""));
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 500);
  };

  const handleSubmission = async () => {
    setIsProcessing(true);
    const result = await generateInterviewFeedback(questions[questionIndex], transcript || "User provided answer...");
    setFeedback(result);
    setIsProcessing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreData = feedback ? [
    { name: 'Score', uv: feedback.score, fill: '#6366f1' },
    { name: 'Max', uv: 100, fill: '#e2e8f0' }
  ] : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Interview Interface */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
             <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Question {questionIndex + 1} of {questions.length}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12 max-w-2xl leading-relaxed">
            {questions[questionIndex]}
          </h2>

          <div className="flex flex-col items-center gap-6">
             {/* Audio Visualizer Placeholder */}
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
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100 scale-110' 
                    : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1'
                }`}
             >
                {isRecording ? <Square className="text-white fill-white" size={24} /> : <Mic className="text-white" size={32} />}
             </button>
             <p className="text-slate-500 text-sm">
               {isRecording ? 'Recording your answer...' : 'Click microphone to start'}
             </p>
          </div>
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
      <div className={`w-full lg:w-96 flex flex-col transition-all duration-500 ${feedback ? 'opacity-100 translate-x-0' : 'opacity-50 lg:translate-x-4 grayscale'}`}>
         {isProcessing ? (
           <Card className="flex-1 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-600 font-medium">Analyzing your response...</p>
             <p className="text-slate-400 text-sm mt-2">Checking technical accuracy and clarity</p>
           </Card>
         ) : feedback ? (
           <div className="space-y-4 h-full overflow-y-auto">
             <Card className="text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
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
               
               <div className="space-y-4">
                 <div>
                   <h4 className="flex items-center text-emerald-600 font-semibold text-sm mb-2">
                     <CheckCircle2 size={16} className="mr-2" /> Strengths
                   </h4>
                   <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-emerald-300">
                     {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="flex items-center text-amber-600 font-semibold text-sm mb-2">
                     <AlertCircle size={16} className="mr-2" /> Areas for Improvement
                   </h4>
                   <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-amber-300">
                     {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                   </ul>
                 </div>
               </div>
             </Card>

             <Button 
               className="w-full" 
               variant="outline" 
               icon={<RefreshCw size={16} />}
               onClick={() => {
                 setFeedback(null);
                 setTranscript("");
                 setQuestionIndex((prev) => (prev + 1) % questions.length);
               }}
             >
               Next Question
             </Button>
           </div>
         ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Play className="ml-1 text-slate-300" />
               </div>
               <p className="font-medium text-slate-500">Ready for feedback?</p>
               <p className="text-sm mt-1">Record your answer to get instant AI analysis on your performance.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default Interview;