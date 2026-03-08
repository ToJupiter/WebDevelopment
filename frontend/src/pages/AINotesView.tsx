import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui/Common';
import { ArrowLeft, Sparkles, Trash2, MessageSquare, Bot } from 'lucide-react';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import MarkdownRenderer from '../components/MarkdownRenderer';
import api from '../services/api';

const AINotesView = () => {
  const { id: roadmapId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    if (roadmapId) {
      loadData();
    }
  }, [roadmapId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get roadmap info
      const roadmapRes = await api.get(`/roadmaps/${roadmapId}`);
      if (roadmapRes.data.success) {
        setRoadmap(roadmapRes.data.data);
        
        // Get all modules
        const modules = roadmapRes.data.data.modules || [];
        
        // Fetch notes for each module
        const allNotes: any[] = [];
        for (const module of modules) {
          try {
            const notesRes = await api.get(`/roadmaps/${roadmapId}/modules/${module.module_id}/notes/ai-notes`);
            if (notesRes.data.success && notesRes.data.data.length > 0) {
              allNotes.push({
                module_title: module.title,
                module_id: module.module_id,
                notes: notesRes.data.data
              });
            }
          } catch (e) {
            // Module might not have notes, skip
          }
        }
        
        setNotes(allNotes);
      }
    } catch (error) {
      console.error('Failed to load AI notes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${noteId}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete note', error);
      alert('Failed to delete note');
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/roadmaps/${roadmapId}`)} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">AI Notes</h1>
        </div>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your AI notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/roadmaps/${roadmapId}`)} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-brand-600" size={24} />
              AI Notes
            </h1>
          </div>
        </div>
      </div>

      {/* Notes Display */}
      {notes.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <Bot className="text-brand-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No AI Notes Yet</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Start learning and ask Cody questions in any module. Your conversations will appear here.
          </p>
          <Button onClick={() => navigate(`/roadmaps/${roadmapId}`)}>
            Back to Roadmap
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {notes.map((moduleNotes, idx) => (
            <div key={idx} className="space-y-4">
              {/* Module Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{moduleNotes.module_title}</h2>
                <span className="text-sm text-slate-500">
                  ({moduleNotes.notes.length} conversation{moduleNotes.notes.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Notes List as Accordion */}
              <Accordion allowMultiple={false}>
                {(() => {
                  const conversations: Array<{ question: any; answer: any }> = [];
                  
                  // Group notes into Q&A pairs
                  for (let i = 0; i < moduleNotes.notes.length; i++) {
                    const note = moduleNotes.notes[i];
                    if (note.note_type === 'user_question') {
                      const nextNote = moduleNotes.notes[i + 1];
                      if (nextNote && nextNote.note_type === 'ai_response') {
                        conversations.push({ question: note, answer: nextNote });
                        i++; // Skip the answer note
                      } else {
                        conversations.push({ question: note, answer: null });
                      }
                    }
                  }

                  return conversations.map((conv, convIdx) => (
                    <AccordionItem
                      key={conv.question.note_id}
                      title={conv.question.content}
                      isOpen={false}
                      onToggle={() => {}}
                    >
                      <div className="space-y-4">
                        {/* AI Response */}
                        {conv.answer && (
                          <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                                <Sparkles size={16} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-sm mb-1">Cody</p>
                                <p className="text-xs text-slate-500">
                                  @{formatTimestamp(conv.answer.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="pl-11">
                              <MarkdownRenderer 
                                content={conv.answer.content} 
                                className="text-slate-700 text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDeleteNote(conv.question.note_id)}
                            className="px-3 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete Conversation
                          </button>
                        </div>
                      </div>
                    </AccordionItem>
                  ));
                })()}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AINotesView;

