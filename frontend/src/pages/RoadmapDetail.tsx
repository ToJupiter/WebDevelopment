import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar, Input } from '../components/ui/Common';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Clock, Plus, Edit, Trash2, X, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    content: '',
    order_index: 0,
    estimated_hours: 0
  });

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

  const handleCreateOrUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModule) {
        await api.put(`/roadmaps/${id}/modules/${editingModule.module_id}`, moduleFormData);
      } else {
        await api.post(`/roadmaps/${id}/modules`, moduleFormData);
      }
      setShowModuleModal(false);
      setEditingModule(null);
      setModuleFormData({ title: '', description: '', content: '', order_index: 0, estimated_hours: 0 });
      loadData();
    } catch (error) {
      console.error('Failed to save module', error);
      alert('Failed to save module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await api.delete(`/roadmaps/${id}/modules/${moduleId}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete module', error);
      alert('Failed to delete module');
    }
  };

  const openEditModuleModal = (module: any) => {
    setEditingModule(module);
    setModuleFormData({
      title: module.title,
      description: module.description || '',
      content: module.content || '',
      order_index: module.order_index || 0,
      estimated_hours: module.estimated_hours || 0
    });
    setShowModuleModal(true);
  };

  const handleUpdateImage = async () => {
    if (!newImageUrl.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    try {
      await api.put(`/roadmaps/${id}`, { image_url: newImageUrl });
      setShowImageModal(false);
      setNewImageUrl('');
      loadData();
    } catch (error) {
      console.error('Failed to update image', error);
      alert('Failed to update image');
    }
  };

  const handleCreateModule = () => {
    // Auto-calculate order_index
    const nextOrderIndex = modules.length + 1;
    setModuleFormData({
      title: '',
      description: '',
      content: '',
      order_index: nextOrderIndex,
      estimated_hours: 0
    });
    setEditingModule(null);
    setShowModuleModal(true);
  };

  // Calculate total hours from modules
  const totalHours = modules.reduce((acc: number, m: any) => acc + Number(m.estimated_hours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Notion-style Immersive Header */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
        {/* Background Image */}
        <img 
          src={roadmap.image_url || `https://picsum.photos/1200/400?random=${id}`}
          alt={roadmap.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/1200/400?random=${id}`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col justify-between p-8">
          {/* Top Bar */}
          <div className="flex justify-between items-start">
            <button
              onClick={() => navigate('/roadmaps')}
              className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            >
              <ArrowLeft size={16} />
              Back to Roadmaps
            </button>
            
            <div className="flex gap-2">
              {(user?.role === 'admin' || user?.role === 'creator') && (
                <>
                  <button
                    onClick={() => { setShowImageModal(true); setNewImageUrl(roadmap.image_url || ''); }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20 opacity-0 group-hover:opacity-100"
                    title="Change cover image"
                  >
                    <ImageIcon size={16} />
                    Change Cover
                  </button>
                  <button
                    onClick={handleCreateModule}
                    className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
                  >
                    <Plus size={16} />
                    Add Module
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded-full">
                {roadmap.category}
              </span>
              {roadmap.status && (
                <span className="px-3 py-1.5 bg-brand-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                  {roadmap.status}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {roadmap.title}
            </h1>
            
            <p className="text-lg text-white/90 drop-shadow-md max-w-3xl">
              {roadmap.description || 'Master this skill with our comprehensive learning path'}
            </p>

            <div className="flex items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <BookOpen size={18} />
                {modules.length} Modules
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} />
                {totalHours} Hours
              </span>
              {isEnrolled && (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  {Math.round(completionPercentage)}% Complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button className="px-4 py-3 border-b-2 border-brand-500 text-brand-600 font-semibold">
          Course Content
        </button>
        <button 
          onClick={() => navigate(`/roadmaps/${id}/ai-notes`)}
          className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-brand-600 font-semibold flex items-center gap-2"
        >
          <Sparkles size={16} />
          AI Notes
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-slate-900">Course Content</h2>
                 {isEnrolled ? (
                    <span className="text-sm text-slate-500 font-medium">{progress?.modules?.filter((m: any) => m.status === 'completed').length || 0} / {modules.length} Completed</span>
                 ) : (
                    <span className="text-sm text-slate-500 font-medium">{modules.length} Modules</span>
                 )}
              </div>
           </div>
           
           <div className="p-6">
              
              <div className="p-6 space-y-3">
                 {modules.length === 0 ? (
                   <div className="text-center py-12">
                     <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
                     <p className="text-slate-500 mb-4">No modules yet</p>
                     {(user?.role === 'admin' || user?.role === 'creator') && (
                       <Button onClick={() => { setShowModuleModal(true); setEditingModule(null); }}>
                         Add First Module
                       </Button>
                     )}
                   </div>
                 ) : (
                   modules.map((module: any, idx: number) => {
                      const p = progressMap.get(module.module_id);
                      const status = p?.status || (isEnrolled ? 'not_started' : 'locked');
                      const isLocked = !isEnrolled;
                      
                      return (
                          <div 
                            key={module.module_id} 
                            className={`group relative border rounded-lg p-4 transition-all ${
                              isLocked 
                                ? 'bg-slate-50 border-slate-200 hover:border-brand-300' 
                                : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md'
                            } ${status === 'in_progress' ? 'ring-2 ring-brand-100 border-brand-500' : ''}`}
                          >
                            <div 
                              onClick={() => {
                                  if (isEnrolled) {
                                    status !== 'locked' && navigate(`/roadmaps/${id}/modules/${module.module_id}`);
                                  } else {
                                    handleEnroll();
                                  }
                              }}
                              className="flex items-center gap-4 cursor-pointer"
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
                               <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold ${status === 'in_progress' ? 'text-brand-700' : 'text-slate-800'}`}>
                                    {idx + 1}. {module.title}
                                  </h3>
                                  {module.description && (
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{module.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                     {module.estimated_hours && (
                                         <span className="flex items-center gap-1"><Clock size={12} /> {module.estimated_hours}h</span>
                                     )}
                                     <span className="flex items-center gap-1"><BookOpen size={12} /> Module</span>
                                  </div>
                               </div>
                               {status === 'in_progress' && (
                                 <Button size="sm" className="shrink-0">Continue</Button>
                               )}
                               {!isEnrolled && (
                                 <Button size="sm" variant="outline" className="shrink-0">Start</Button>
                               )}
                            </div>

                            {/* Admin Actions */}
                            {(user?.role === 'admin' || user?.role === 'creator') && (
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); openEditModuleModal(module); }}
                                  className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.module_id); }}
                                  className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                      );
                   })
                 )}
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

      {/* Module Create/Edit Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingModule ? 'Edit Module' : 'Create New Module'}</h2>
              <button onClick={() => { setShowModuleModal(false); setEditingModule(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateModule} className="space-y-4">
              <Input
                label="Module Title"
                value={moduleFormData.title}
                onChange={(e) => setModuleFormData({...moduleFormData, title: e.target.value})}
                placeholder="e.g., Introduction to React Hooks"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  rows={3}
                  value={moduleFormData.description}
                  onChange={(e) => setModuleFormData({...moduleFormData, description: e.target.value})}
                  placeholder="Brief description of what students will learn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none font-mono text-sm"
                  rows={12}
                  value={moduleFormData.content}
                  onChange={(e) => setModuleFormData({...moduleFormData, content: e.target.value})}
                  placeholder="# Lesson Title&#10;&#10;Write your lesson content here using Markdown...&#10;&#10;## Section 1&#10;Content here..."
                />
                <p className="text-xs text-slate-500 mt-1">Supports Markdown formatting</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order Index</label>
                  <input
                    type="number"
                    className="bg-slate-100 w-full px-3 py-2 border border-slate-300 rounded-lg outline-none cursor-not-allowed"
                    value={moduleFormData.order_index}
                    disabled
                    title="Auto-calculated based on module position"
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto-calculated</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                    value={moduleFormData.estimated_hours}
                    onChange={(e) => setModuleFormData({...moduleFormData, estimated_hours: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowModuleModal(false); setEditingModule(null); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingModule ? 'Update' : 'Create'} Module
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Image Change Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Change Cover Image</h2>
              <button onClick={() => { setShowImageModal(false); setNewImageUrl(''); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Preview */}
              {newImageUrl && (
                <div className="relative h-48 rounded-lg overflow-hidden border border-slate-200">
                  <img 
                    src={newImageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}

              <Input
                label="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use high-quality images (1200x400px recommended). 
                  Free sources: Unsplash, Pexels, or Pixabay.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowImageModal(false); setNewImageUrl(''); }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateImage}>
                  Update Cover
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetail;
