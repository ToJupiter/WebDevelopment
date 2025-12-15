import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar, Input } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Roadmaps = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmaps, setRoadmaps] = React.useState<any[]>([]);
  const [enrolledRoadmaps, setEnrolledRoadmaps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingRoadmap, setEditingRoadmap] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    status: 'published'
  });

  React.useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const [roadmapsRes, enrolledRes] = await Promise.all([
        api.get('/roadmaps'),
        user ? api.get('/roadmaps/enrolled/list').catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } })
      ]);
      
      setRoadmaps(roadmapsRes.data.data);
      setEnrolledRoadmaps(enrolledRes.data.data);
    } catch (e) {
      console.error("Failed to fetch roadmaps", e);
    } finally {
      setLoading(false);
    }
  };

  const getRoadmapProgress = (roadmapId: string) => {
    const enrolled = enrolledRoadmaps.find(r => r.roadmap_id === roadmapId);
    return enrolled ? {
      completion: enrolled.completion_percentage || 0,
      completedModules: enrolled.completed_modules || 0,
      totalModules: enrolled.total_modules || 0
    } : null;
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoadmap) {
        await api.put(`/roadmaps/${editingRoadmap.roadmap_id}`, formData);
      } else {
        await api.post('/roadmaps', formData);
      }
      setShowCreateModal(false);
      setEditingRoadmap(null);
      setFormData({ title: '', description: '', category: '', image_url: '', status: 'published' });
      fetchRoadmaps();
    } catch (error) {
      console.error('Failed to save roadmap', error);
      alert('Failed to save roadmap');
    }
  };

  const handleDelete = async (roadmapId: string) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    try {
      await api.delete(`/roadmaps/${roadmapId}`);
      fetchRoadmaps();
    } catch (error) {
      console.error('Failed to delete roadmap', error);
      alert('Failed to delete roadmap');
    }
  };

  const openEditModal = (roadmap: any) => {
    setEditingRoadmap(roadmap);
    setFormData({
      title: roadmap.title,
      description: roadmap.description || '',
      category: roadmap.category,
      image_url: roadmap.image_url || '',
      status: roadmap.status
    });
    setShowCreateModal(true);
  };

  const getCategoryColor = (cat: string) => {
     const map: any = { 'Frontend': 'blue', 'Backend': 'green', 'DevOps': 'orange', 'Design': 'pink', 'Data Science': 'purple' };
     return map[cat] || 'indigo';
  };
  
  const getIcon = (cat: string) => {
      // Return appropriate icon
      return <Book />;
  };

  const filteredRoadmaps = roadmaps.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning Roadmaps</h1>
          <p className="text-slate-500 mt-1">Structured paths to master new technologies.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all bg-white"
              placeholder="Search paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {(user?.role === 'admin' || user?.role === 'creator') && (
            <Button icon={<Plus size={18} />} onClick={() => { setShowCreateModal(true); setEditingRoadmap(null); }}>
              Create Path
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading roadmaps...</p> : filteredRoadmaps.map((map) => {
          const progress = getRoadmapProgress(map.roadmap_id);
          const isCompleted = progress && progress.completion >= 100;
          
          return (
            <div 
              key={map.roadmap_id}
              className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 rounded-full p-2">
                  <CheckCircle size={20} />
                </div>
              )}

              {(user?.role === 'admin' || user?.role === 'creator') && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(map); }}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(map.roadmap_id); }}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              
              <div 
                onClick={() => navigate(`/roadmaps/${map.roadmap_id}`)}
                className="cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg bg-${getCategoryColor(map.category)}-50 text-${getCategoryColor(map.category)}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {getIcon(map.category)}
                </div>
                
                <div className="mb-4">
                  <Badge color="blue">
                    {map.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">{map.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{map.module_count || 0} Modules • Est. {map.module_count ? Math.ceil(map.module_count * 1.5) : 0} Hours</p>
                </div>

                {progress ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{Math.round(progress.completion)}% Completed</span>
                      <span>{progress.completedModules}/{progress.totalModules}</span>
                    </div>
                    <ProgressBar progress={progress.completion} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Not Started</span>
                      <span>0/{map.module_count || 0}</span>
                    </div>
                    <ProgressBar progress={0} />
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">
                    {isCompleted ? 'Review Path' : progress ? 'Continue Path' : 'Start Path'} &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingRoadmap ? 'Edit Roadmap' : 'Create New Roadmap'}</h2>
              <button onClick={() => { setShowCreateModal(false); setEditingRoadmap(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Frontend, Backend, DevOps"
                required
              />

              <Input
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://..."
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowCreateModal(false); setEditingRoadmap(null); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoadmap ? 'Update' : 'Create'} Roadmap
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
