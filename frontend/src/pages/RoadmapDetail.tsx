import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar } from '../components/ui/Common';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Clock } from 'lucide-react';
import api from '../services/api';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Parallel fetch: Roadmap Definition + User Progress
      const [roadmapRes, progressRes] = await Promise.all([
        api.get(`/roadmaps/${id}`),
        api.get(`/progress/roadmaps/${id}`).catch(err => ({ data: { success: false, data: null } })) // Allow progress fetch to fail (e.g. not enrolled)
      ]);

      if (roadmapRes.data.success) {
        setRoadmap(roadmapRes.data.data);
      }
      
      if (progressRes.data?.success) {
        setProgress(progressRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load roadmap data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading roadmap...</div>;
  if (!roadmap) return <div className="p-12 text-center text-red-500">Roadmap not found or failed to load.</div>;

  // Merge Data
  const modules = roadmap.modules || [];
  const progressMap = new Map();
  if (progress && progress.modules) {
    progress.modules.forEach((pm: any) => progressMap.set(pm.module_id, pm));
  }

  // Calculate completion
  const completionPercentage = progress?.overall_progress || 0;
  const isEnrolled = !!progress;

  const handleEnroll = async () => {
    try {
      await api.post(`/roadmaps/${id}/enroll`);
      loadData(); // Reload to get progress structure
    } catch (e) {
      console.error("Enrollment failed", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Modules */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-900 relative p-8 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h1 className="text-3xl font-bold text-white relative z-10 capitalize">{roadmap.title}</h1>
              <p className="text-indigo-100 relative z-10 mt-2">{roadmap.description || 'Master this skill path.'}</p>
           </div>
           
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
                 {isEnrolled ? (
                    <span className="text-sm text-slate-500">{progress?.modules?.filter((m: any) => m.status === 'completed').length || 0} / {modules.length} Completed</span>
                 ) : (
                    <span className="text-sm text-slate-500">{modules.length} Modules</span>
                 )}
              </div>
              
              <div className="space-y-3">
                 {modules.map((module: any, idx: number) => {
                    const p = progressMap.get(module.module_id);
                    const status = p?.status || (isEnrolled ? 'not_started' : 'locked');
                    const isLocked = !isEnrolled; // Simple logic: fail to view if not enrolled? Or open view but track status? 
                    // Better: If not enrolled, show as locked or just 'view'. 
                    // But typically you enroll to track.
                    
                    return (
                        <div 
                          key={module.module_id} 
                          onClick={() => {
                              if (isEnrolled) {
                                module.status !== 'locked' && navigate(`/roadmaps/${id}/modules/${module.module_id}`);
                              } else {
                                handleEnroll(); // Or prompt
                              }
                          }}
                          className={`group border rounded-lg p-4 flex items-center gap-4 transition-all ${
                            isLocked 
                              ? 'bg-slate-50 border-slate-200 cursor-pointer hover:border-brand-300' 
                              : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
                          } ${status === 'in_progress' ? 'ring-2 ring-brand-100 border-brand-500' : ''}`}
                        >
                           <div className="flex-shrink-0">
                              {status === 'completed' ? (
                                <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                              ) : status === 'locked' || !isEnrolled ? (
                                <Lock className="text-slate-400 w-6 h-6" />
                              ) : status === 'in_progress' ? (
                                <div className="w-6 h-6 rounded-full border-2 border-brand-500 flex items-center justify-center">
                                   <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                              )}
                           </div>
                           <div className="flex-1">
                              <h3 className={`font-semibold ${status === 'in_progress' ? 'text-brand-700' : 'text-slate-800'}`}>
                                {idx + 1}. {module.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                 {module.estimated_hours && (
                                     <span className="flex items-center gap-1"><Clock size={12} /> {module.estimated_hours}h</span>
                                 )}
                                 <span className="flex items-center gap-1"><BookOpen size={12} /> Module</span>
                              </div>
                           </div>
                           {status === 'in_progress' && (
                             <Button size="sm">Continue</Button>
                           )}
                           {!isEnrolled && (
                             <Button size="sm" variant="outline">Start</Button>
                           )}
                        </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar - Progress & Info */}
      <div className="space-y-6">
        <Card title="Your Progress">
           {isEnrolled ? (
               <>
               <div className="flex items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <circle 
                            cx="64" cy="64" r="56" 
                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={351.86} 
                            strokeDashoffset={351.86 * (1 - (completionPercentage / 100))} 
                            className="text-brand-500 transition-all duration-1000" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">{Math.round(completionPercentage)}%</span>
                     </div>
                  </div>
               </div>
               <p className="text-center text-sm text-slate-600 mb-6">Keep it up! You're on track.</p>
               </>
           ) : (
               <div className="text-center py-6">
                   <p className="text-slate-600 mb-4">Join this roadmap to track your progress and earn a certificate.</p>
                   <Button className="w-full" onClick={handleEnroll}>Enroll Now</Button>
               </div>
           )}
        </Card>

        {/* AI Tutor Card - Kept as per user preference (Help button kept, so this is consistent) */}
        {/* <div className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-bold text-lg">Need Help?</h3>
             <p className="text-indigo-200 text-sm mt-2 mb-4">Ask our AI tutor for instant clarification on any topic.</p>
             <Button size="sm" className="bg-white text-indigo-900 border-none hover:bg-indigo-50">Ask AI Tutor</Button>
           </div>
           <div className="absolute -bottom-4 -right-4 text-indigo-800 opacity-50">
             <BookOpen size={120} />
           </div>
        </div> */}
      </div>
    </div>
  );
};

export default RoadmapDetail;
