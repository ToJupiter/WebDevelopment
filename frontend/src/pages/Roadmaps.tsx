import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code } from 'lucide-react';

const Roadmaps = () => {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await import('../services/api').then(m => m.default.get('/roadmaps'));
        setRoadmaps(response.data.data);
      } catch (e) {
        console.error("Failed to fetch roadmaps", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const getCategoryColor = (cat: string) => {
     const map: any = { 'Frontend': 'blue', 'Backend': 'green', 'DevOps': 'orange', 'Design': 'pink', 'Data Science': 'purple' };
     return map[cat] || 'indigo';
  };
  
  const getIcon = (cat: string) => {
      // Return appropriate icon
      return <Book />;
  };

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
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
              placeholder="Search paths..."
            />
          </div>
          <Button variant="outline" icon={<Filter size={18} />}>Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading roadmaps...</p> : roadmaps.map((map) => (
          <div 
            key={map.roadmap_id}
            onClick={() => navigate(`/roadmaps/${map.roadmap_id}`)}
            className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
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

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>0% Completed</span>
                <span>0/{map.module_count || 0}</span>
              </div>
              <ProgressBar progress={0} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">Start Path &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
