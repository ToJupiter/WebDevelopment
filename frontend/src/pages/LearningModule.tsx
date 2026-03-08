import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, ProgressBar, Input } from "../components/ui/Common";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  PlayCircle,
  Upload,
  X,
  Check,
  Clock,
  Plus,
  Edit,
  Trash2,
  Send,
  Sparkles
} from "lucide-react";
import api from "../services/api";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useAuth } from "../context/AuthContext";

const LearningModule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmapId, moduleId } = useParams<{ roadmapId: string; moduleId: string }>();

  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'exercises'>('content');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [exerciseInput, setExerciseInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [exerciseResult, setExerciseResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [exerciseFormData, setExerciseFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    examples: ''
  });
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (roadmapId && moduleId) {
      fetchModule();
    }
  }, [roadmapId, moduleId]);

  const fetchModule = async () => {
    try {
        const [moduleRes, exercisesRes, submissionsRes] = await Promise.all([
          api.get(`/roadmaps/${roadmapId}/modules/${moduleId}`),
          api.get(`/exercises?module_id=${moduleId}`).catch(() => ({ data: { data: [] } })),
          api.get(`/exercises/submissions/my?module_id=${moduleId}`).catch(() => ({ data: { data: [] } }))
        ]);
        
        if (moduleRes.data.success) {
            const moduleData = moduleRes.data.data;
            moduleData.exercises = exercisesRes.data.data || [];
            setModule(moduleData);
            
            const submittedIds = (submissionsRes.data.data || []).map((sub: any) => sub.exercise.exercise_id);
            setSubmissions(submittedIds);
        }
    } catch (error) {
        console.error("Failed to load module", error);
    } finally {
        setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Read file content for text files
      if (file.type.startsWith('text/') || file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.java')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setExerciseInput(event.target?.result as string || '');
        };
        reader.readAsText(file);
      }
    }
  };

  const submitExercise = async () => {
      if (!selectedExercise) {
          alert("Please select an exercise first.");
          return;
      }
      
      if (!exerciseInput.trim() && !uploadedFile) {
          alert("Please provide your solution or upload a file.");
          return;
      }

      setSubmitting(true);
      try {
          const res = await api.post(`/exercises/${selectedExercise.exercise_id}/submit`, {
              answer_text: exerciseInput
          });
          
          if (res.data.success) {
            setExerciseResult({ success: true, message: 'Exercise submitted successfully!' });
            // Update submissions list
            setSubmissions(prev => [...new Set([...prev, selectedExercise.exercise_id])]);
            // Clear input
            setExerciseInput('');
            setUploadedFile(null);
            
            // Refresh module data to get latest progress
            fetchModule();
          }
      } catch (e) {
          console.error("Exercise submission failed", e);
          setExerciseResult({ success: false, message: 'Submission failed. Please try again.' });
      } finally {
          setSubmitting(false);
      }
  };

  const handleCreateOrUpdateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await api.put(`/exercises/${editingExercise.exercise_id}`, exerciseFormData);
      } else {
        await api.post('/exercises', {
          ...exerciseFormData,
          module_id: moduleId
        });
      }
      setShowExerciseModal(false);
      setEditingExercise(null);
      setExerciseFormData({ title: '', description: '', difficulty: 'medium', examples: '' });
      fetchModule();
    } catch (error) {
      console.error('Failed to save exercise', error);
      alert('Failed to save exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    try {
      await api.delete(`/exercises/${exerciseId}`);
      fetchModule();
    } catch (error) {
      console.error('Failed to delete exercise', error);
      alert('Failed to delete exercise');
    }
  };

  const openEditExerciseModal = (exercise: any) => {
    setEditingExercise(exercise);
    setExerciseFormData({
      title: exercise.title,
      description: exercise.description || '',
      difficulty: exercise.difficulty || 'medium',
      examples: exercise.examples || ''
    });
    setShowExerciseModal(true);
  };

  const handleAiChat = async () => {
    if (!aiQuestion.trim()) return;
    
    setAiLoading(true);
    try {
      const res = await api.post(`/roadmaps/${roadmapId}/modules/${moduleId}/notes/ai-chat`, {
        question: aiQuestion
      });
      
      if (res.data.success) {
        setAiResponse(res.data.data.answer);
        setAiQuestion('');
      }
    } catch (error) {
      console.error('AI chat failed', error);
      setAiResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading module content...</div>;
  if (!module) return <div className="p-12 text-center text-red-500">Module not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main content */}
      <div className="lg:col-span-12 space-y-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            >
              <ArrowLeft size={16} />
              Back to Roadmap
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{module.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
               <Badge color="blue">Module</Badge>
               {module.estimated_hours && <Badge color="gray">{module.estimated_hours}h</Badge>}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-slate-200 bg-white rounded-t-xl">
            <nav className="-mb-px flex space-x-8 px-6">
                <button
                    onClick={() => { setActiveTab('content'); setExerciseResult(null); }}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'content'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <BookOpen size={16} className="inline mr-2" />
                    Lesson Content
                </button>
                <button
                    onClick={() => { setActiveTab('exercises'); setSelectedExercise(null); setExerciseResult(null); }}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'exercises'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Code2 size={16} className="inline mr-2" />
                    Exercises
                    {module.exercises && module.exercises.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs">
                        {module.exercises.length}
                      </span>
                    )}
                </button>
            </nav>
        </div>

        {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lesson Content */}
              <Card className="!p-8 lg:col-span-2">
                  {module.content ? (
                    <MarkdownRenderer content={module.content} className="text-slate-700" />
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
                      <p className="text-slate-500">No content available for this module yet.</p>
                      {module.description && (
                        <p className="text-slate-600 mt-4 max-w-2xl mx-auto">{module.description}</p>
                      )}
                    </div>
                  )}
              </Card>

              {/* AI Assistant - Cody */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Cody</h3>
                      <p className="text-xs text-slate-500">AI Learning Assistant</p>
                    </div>
                  </div>

                  {aiResponse && (
                    <div className="mb-4 p-4 bg-brand-50 border border-brand-200 rounded-lg">
                      {/* <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiResponse}</p> */}
                        <MarkdownRenderer 
                            content={aiResponse} 
                            className="text-sm text-slate-700"
                        />
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Hi! I'm Cody. How can I help you?</p>
                    
                    <div className="relative">
                      <textarea
                        className="bg-white w-full px-3 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none resize-none text-sm"
                        rows={3}
                        placeholder="Ask me anything about this lesson..."
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAiChat();
                          }
                        }}
                      />
                      <button
                        onClick={handleAiChat}
                        disabled={aiLoading || !aiQuestion.trim()}
                        className="absolute bottom-2 right-2 p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {aiLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </Card>
              </div>
            </div>
        )}

        {activeTab === 'exercises' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Exercise List */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-slate-900">Exercise List</h3>
                          {(user?.role === 'admin' || user?.role === 'creator') && (
                            <button
                              onClick={() => { setShowExerciseModal(true); setEditingExercise(null); }}
                              className="p-2 bg-brand-100 text-brand-600 rounded-lg hover:bg-brand-200 transition-colors"
                              title="Add Exercise"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>

                        {module.exercises && module.exercises.length > 0 ? (
                            <div className="space-y-2">
                                {module.exercises.map((ex: any, i: number) => {
                                  const isSubmitted = submissions.includes(ex.exercise_id);
                                  return (
                                    <div
                                        key={ex.exercise_id || i}
                                        className={`relative group rounded-lg border-2 transition-all ${
                                            selectedExercise?.exercise_id === ex.exercise_id
                                                ? 'border-brand-500 bg-brand-50 shadow-md'
                                                : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <button
                                          onClick={() => { 
                                            setSelectedExercise(ex); 
                                            setExerciseInput(''); 
                                            setUploadedFile(null);
                                            setExerciseResult(null);
                                          }}
                                          className="w-full text-left p-4"
                                        >
                                          <div className="flex items-start gap-3">
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                  isSubmitted ? 'bg-green-500 text-white' :
                                                  selectedExercise?.exercise_id === ex.exercise_id
                                                      ? 'bg-brand-500 text-white'
                                                      : 'bg-slate-200 text-slate-600'
                                              }`}>
                                                  {isSubmitted ? <Check size={14} /> : i + 1}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                                                      {ex.title || `Exercise ${i + 1}`}
                                                  </h4>
                                                  <div className="flex items-center gap-2 mt-1">
                                                    {ex.difficulty && (
                                                        <span className={`text-xs inline-block px-2 py-0.5 rounded ${
                                                            ex.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                            ex.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {ex.difficulty}
                                                        </span>
                                                    )}
                                                    {isSubmitted && (
                                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                        Submitted
                                                      </span>
                                                    )}
                                                  </div>
                                              </div>
                                          </div>
                                        </button>

                                        {/* Admin Actions */}
                                        {(user?.role === 'admin' || user?.role === 'creator') && (
                                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); openEditExerciseModal(ex); }}
                                              className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                                            >
                                              <Edit size={12} />
                                            </button>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); handleDeleteExercise(ex.exercise_id); }}
                                              className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        )}
                                    </div>
                                  );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Code2 className="mx-auto mb-3 text-slate-300" size={40} />
                                <p className="text-slate-500 text-sm mb-4">No exercises available yet</p>
                                {(user?.role === 'admin' || user?.role === 'creator') && (
                                  <Button size="sm" onClick={() => { setShowExerciseModal(true); setEditingExercise(null); }}>
                                    Add First Exercise
                                  </Button>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Exercise Detail & Submission */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedExercise ? (
                        <>
                            <Card>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{selectedExercise.title || 'Exercise'}</h3>
                                
                                {/* Exercise Description */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Problem Description</h4>
                                    <MarkdownRenderer 
                                      content={selectedExercise.prompt || selectedExercise.description || 'No description provided.'} 
                                      className="text-slate-600 bg-slate-50 p-4 rounded-lg"
                                    />
                                </div>

                                {/* Submission Area */}
                                <div className="border-t border-slate-200 pt-6">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Your Solution</h4>
                                    
                                    {/* Code Editor */}
                                    <textarea 
                                        className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="// Write your solution code here...&#10;// Supports multiple programming languages&#10;&#10;function solve() {&#10;    // Your code&#10;}"
                                        value={exerciseInput}
                                        onChange={(e) => setExerciseInput(e.target.value)}
                                    />

                                    {/* File Upload */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Or upload a file
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-brand-400 transition-colors">
                                                    <div className="flex items-center justify-center gap-2 text-slate-600">
                                                        <Upload size={20} />
                                                        <span className="text-sm">
                                                            {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 text-center mt-1">
                                                        Supports .py, .js, .java, .txt and other text files
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                    accept=".py,.js,.java,.txt,.c,.cpp,.go,.rs,.ts,.tsx,.jsx"
                                                />
                                            </label>
                                            {uploadedFile && (
                                                <button
                                                    onClick={() => { setUploadedFile(null); setExerciseInput(''); }}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-between">
                                        <Button 
                                            onClick={submitExercise} 
                                            disabled={submitting || (!exerciseInput.trim() && !uploadedFile)}
                                            className="bg-brand-600 hover:bg-brand-700"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Solution'}
                                        </Button>
                                        
                                        {exerciseResult && (
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                                exerciseResult.success 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {exerciseResult.success ? (
                                                    <><Check size={20} /> <span className="font-semibold">Correct!</span></>
                                                ) : (
                                                    <><X size={20} /> <span className="font-semibold">Try Again</span></>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Result Details */}
                                    {exerciseResult && exerciseResult.message && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Feedback</h5>
                                            <p className="text-sm text-slate-600">{exerciseResult.message}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </>
                    ) : (
                        <Card>
                            <div className="text-center py-16">
                                <Code2 className="mx-auto mb-4 text-slate-300" size={64} />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select an Exercise</h3>
                                <p className="text-slate-500">Choose an exercise from the list to get started</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Exercise Create/Edit Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingExercise ? 'Edit Exercise' : 'Create New Exercise'}</h2>
              <button onClick={() => { setShowExerciseModal(false); setEditingExercise(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateExercise} className="space-y-4">
              <Input
                label="Exercise Title"
                value={exerciseFormData.title}
                onChange={(e) => setExerciseFormData({...exerciseFormData, title: e.target.value})}
                placeholder="e.g., Build a Counter Component"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Markdown supported)
                </label>
                <textarea
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none font-mono text-sm"
                  rows={8}
                  value={exerciseFormData.description}
                  onChange={(e) => setExerciseFormData({...exerciseFormData, description: e.target.value})}
                  placeholder="## Problem&#10;&#10;Create a counter component that...&#10;&#10;### Requirements&#10;- Increment button&#10;- Decrement button&#10;- Display current count"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Supports Markdown formatting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                <select
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  value={exerciseFormData.difficulty}
                  onChange={(e) => setExerciseFormData({...exerciseFormData, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowExerciseModal(false); setEditingExercise(null); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExercise ? 'Update' : 'Create'} Exercise
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
