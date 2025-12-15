import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, ProgressBar } from "../components/ui/Common";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  PlayCircle
} from "lucide-react";
import api from "../services/api";

const LearningModule = () => {
  const navigate = useNavigate();
  const { roadmapId, moduleId } = useParams<{ roadmapId: string; moduleId: string }>();

  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'exercise'>('content');
  const [exerciseInput, setExerciseInput] = useState("");
  const [exerciseResult, setExerciseResult] = useState<any>(null);

  useEffect(() => {
    if (roadmapId && moduleId) {
      fetchModule();
    }
  }, [roadmapId, moduleId]);

  const fetchModule = async () => {
    try {
        const res = await api.get(`/roadmaps/${roadmapId}/modules/${moduleId}`);
        if (res.data.success) {
            setModule(res.data.data);
        }
    } catch (error) {
        console.error("Failed to load module", error);
    } finally {
        setLoading(false);
    }
  };

  const submitExercise = async () => {
      // Assuming module has exercises, pick the first one or iterate
      // For now, simple mock submission if no real exercise ID
      const exerciseId = module?.exercises?.[0]?.exercise_id;
      if (!exerciseId) {
          alert("No exercise found for this module.");
          return;
      }
      try {
          const res = await api.post(`/exercises/${exerciseId}/submit`, {
              code_answer: exerciseInput
          });
          setExerciseResult(res.data);
      } catch (e) {
          console.error("Exercise submission failed", e);
      }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading module content...</div>;
  if (!module) return <div className="p-12 text-center text-red-500">Module not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
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
        <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'content'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <BookOpen size={16} className="inline mr-2" />
                    Lesson Content
                </button>
                <button
                    onClick={() => setActiveTab('exercise')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'exercise'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Code2 size={16} className="inline mr-2" />
                    Exercises
                </button>
            </nav>
        </div>

        {activeTab === 'content' && (
            <Card className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: module.content || '<p>No content available.</p>' }} />
                {/* Fallback if content is empty but description exists */}
                {!module.content && module.description && <p>{module.description}</p>}
            </Card>
        )}

        {activeTab === 'exercise' && (
            <div className="space-y-6">
                {module.exercises && module.exercises.length > 0 ? (
                    module.exercises.map((ex: any, i: number) => (
                        <Card key={ex.exercise_id || i} title={ex.title || `Exercise ${i+1}`}>
                             <p className="mb-4 text-slate-700">{ex.prompt || "Solve the problem below."}</p>
                             <textarea 
                                className="w-full h-48 p-4 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg mb-4"
                                placeholder="// Write your solution code here..."
                                value={exerciseInput}
                                onChange={(e) => setExerciseInput(e.target.value)}
                             />
                             <div className="flex justify-between items-center">
                                 <Button onClick={submitExercise}>Run Code</Button>
                                 {exerciseResult && (
                                     <span className={exerciseResult.success ? "text-green-600" : "text-red-600"}>
                                         {exerciseResult.success ? "Passed!" : "Failed"}
                                     </span>
                                 )}
                             </div>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <p className="text-slate-500 text-center">No exercises available for this module yet.</p>
                    </Card>
                )}
            </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
         <Card title="Module Info">
             <p className="text-sm text-slate-600 mb-4">{module.description}</p>
             <Button variant="outline" className="w-full" onClick={() => setActiveTab(activeTab === 'content' ? 'exercise' : 'content')}>
                 {activeTab === 'content' ? 'Go to Exercises' : 'Back to Lesson'}
             </Button>
         </Card>
      </div>
    </div>
  );
};

export default LearningModule;
