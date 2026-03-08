import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar, Input } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code, Plus, Edit, Trash2, X, Sparkles, TrendingUp, Layers, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CATEGORIES = [
  { name: 'Frontend', color: 'blue', icon: '🎨' },
  { name: 'Backend', color: 'green', icon: '⚙️' },
  { name: 'DevOps', color: 'orange', icon: '🚀' },
  { name: 'Design', color: 'pink', icon: '✨' },
  { name: 'Data Science', color: 'purple', icon: '📊' },
  { name: 'Mobile', color: 'indigo', icon: '📱' },
  { name: 'AI/ML', color: 'violet', icon: '🤖' },
  { name: 'Cybersecurity', color: 'red', icon: '🔒' },
  { name: 'Cloud Computing', color: 'cyan', icon: '☁️' },
  { name: 'Blockchain', color: 'amber', icon: '⛓️' }
];

const Roadmaps = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmaps, setRoadmaps] = React.useState<any[]>([]);
  const [enrolledRoadmaps, setEnrolledRoadmaps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
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

  const getCategoryInfo = (cat: string) => {
    const found = CATEGORIES.find(c => c.name === cat);
    return found || { name: cat, color: 'indigo', icon: '📚' };
  };

  const filteredRoadmaps = roadmaps.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learning Roadmaps</h1>
            <p className="text-slate-600 mt-2">Master new skills with structured learning paths</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'creator') && (
            <Button 
              icon={<Plus size={18} />} 
              onClick={() => { setShowCreateModal(true); setEditingRoadmap(null); }}
              className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
            >
              Create Roadmap
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all bg-white shadow-sm"
            placeholder="Search roadmaps by title, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            All Paths
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>


      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {loading ? 'Loading...' : `Showing ${filteredRoadmaps.length} of ${roadmaps.length} roadmaps`}
        </p>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-100 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3" />
                <div className="h-6 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))
        ) : filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((map) => {
            const progress = getRoadmapProgress(map.roadmap_id);
            const isCompleted = progress && progress.completion >= 100;
            const categoryInfo = getCategoryInfo(map.category);
            
            return (
              <div 
                key={map.roadmap_id}
                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/roadmaps/${map.roadmap_id}`)}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={map.image_url || `https://picsum.photos/400/300?random=${map.roadmap_id}`}
                    alt={map.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Admin Actions */}
                  {(user?.role === 'admin' || user?.role === 'creator') && !isCompleted && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(map); }}
                        className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-white shadow-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(map.roadmap_id); }}
                        className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-white shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle size={20} />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold rounded-full text-sm">
                      {categoryInfo.icon} {map.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {map.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {map.description || 'Start your learning journey with this comprehensive roadmap'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Book size={14} />
                      {map.module_count || 0} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {map.total_hours || 0}h
                    </span>
                  </div>

                  {/* Progress */}
                  {progress ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>{Math.round(progress.completion)}% Complete</span>
                        <span>{progress.completedModules}/{progress.totalModules}</span>
                      </div>
                      <ProgressBar progress={progress.completion} className="h-2" />
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="h-2 bg-slate-100 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-2">
                  <div className="text-sm font-semibold text-brand-600 group-hover:text-brand-700 flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span>{isCompleted ? 'Review' : progress ? 'Continue' : 'Start Learning'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No roadmaps found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Clear Filters
            </Button>
          </div>
        )}
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
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://..."
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="bg-white w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
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
