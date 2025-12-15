import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar } from '../components/ui/Common';
import { CheckCircle2, Circle, Lock, PlayCircle, FileText, Award, ChevronDown } from 'lucide-react';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const modules = [
    { id: '1', title: 'Internet Fundamentals', status: 'completed', duration: '45m', type: 'video' },
    { id: '2', title: 'HTML & CSS Basics', status: 'completed', duration: '2h 15m', type: 'project' },
    { id: '3', title: 'JavaScript Syntax', status: 'active', duration: '1h 30m', type: 'code' },
    { id: '4', title: 'DOM Manipulation', status: 'locked', duration: '1h', type: 'video' },
    { id: '5', title: 'Async JavaScript', status: 'locked', duration: '2h', type: 'code' },
    { id: '6', title: 'React Ecosystem', status: 'locked', duration: '4h', type: 'project' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Modules */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-900 relative p-8 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h1 className="text-3xl font-bold text-white relative z-10 capitalize">{id?.replace('-', ' ')} Roadmap</h1>
              <p className="text-indigo-100 relative z-10 mt-2">Master the modern stack from scratch.</p>
           </div>
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
                 <span className="text-sm text-slate-500">{modules.filter(m => m.status === 'completed').length} / {modules.length} Completed</span>
              </div>
              
              <div className="space-y-3">
                 {modules.map((module, idx) => (
                    <div 
                      key={module.id} 
                      onClick={() => module.status !== 'locked' && navigate(`/learning/${module.id}`)}
                      className={`group border rounded-lg p-4 flex items-center gap-4 transition-all ${
                        module.status === 'locked' 
                          ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed' 
                          : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
                      } ${module.status === 'active' ? 'ring-2 ring-brand-100 border-brand-500' : ''}`}
                    >
                       <div className="flex-shrink-0">
                          {module.status === 'completed' ? (
                            <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                          ) : module.status === 'locked' ? (
                            <Lock className="text-slate-400 w-6 h-6" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-brand-500 flex items-center justify-center">
                               <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                            </div>
                          )}
                       </div>
                       <div className="flex-1">
                          <h3 className={`font-semibold ${module.status === 'active' ? 'text-brand-700' : 'text-slate-800'}`}>
                            {idx + 1}. {module.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                             <span className="flex items-center gap-1"><PlayCircle size={12} /> {module.duration}</span>
                             <span className="flex items-center gap-1"><FileText size={12} /> {module.type}</span>
                          </div>
                       </div>
                       {module.status === 'active' && (
                         <Button size="sm">Continue</Button>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar - Progress & Info */}
      <div className="space-y-6">
        <Card title="Your Progress">
           <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 * (1 - 0.35)} className="text-brand-500 transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">35%</span>
                 </div>
              </div>
           </div>
           <p className="text-center text-sm text-slate-600 mb-6">Keep it up! You're on track to finish by next month.</p>
           <Button className="w-full" variant="secondary">Download Syllabus</Button>
        </Card>

        <Card title="Certificate">
           <div className="bg-slate-50 rounded-lg p-4 border border-dashed border-slate-300 text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                 <Award size={24} />
              </div>
              <p className="text-sm font-medium text-slate-900">Locked</p>
              <p className="text-xs text-slate-500 mt-1">Complete all modules to earn your certificate of completion.</p>
           </div>
        </Card>

        <div className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-bold text-lg">Need Help?</h3>
             <p className="text-indigo-200 text-sm mt-2 mb-4">Ask our AI tutor for instant clarification on any topic.</p>
             <Button size="sm" className="bg-white text-indigo-900 border-none hover:bg-indigo-50">Ask AI Tutor</Button>
           </div>
           <div className="absolute -bottom-4 -right-4 text-indigo-800 opacity-50">
             <BookOpenIcon size={120} />
           </div>
        </div>
      </div>
    </div>
  );
};

const BookOpenIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
)

export default RoadmapDetail;
