import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code } from 'lucide-react';

const Roadmaps = () => {
  const navigate = useNavigate();

  const roadmaps = [
    { id: 'frontend', title: 'Frontend Developer', category: 'Frontend', progress: 45, total: 24, completed: 11, color: 'blue', icon: <Code /> },
    { id: 'backend', title: 'Backend Developer', category: 'Backend', progress: 10, total: 30, completed: 3, color: 'green', icon: <Book /> },
    { id: 'datascience', title: 'Data Scientist', category: 'Data Science', progress: 0, total: 18, completed: 0, color: 'purple', icon: <Filter /> },
    { id: 'uiux', title: 'UI/UX Designer', category: 'Design', progress: 80, total: 15, completed: 12, color: 'pink', icon: <CheckCircle /> },
    { id: 'devops', title: 'DevOps Engineer', category: 'DevOps', progress: 5, total: 25, completed: 1, color: 'orange', icon: <Code /> },
    { id: 'mobile', title: 'Mobile Developer', category: 'Mobile', progress: 0, total: 20, completed: 0, color: 'indigo', icon: <Code /> },
  ];

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
        {roadmaps.map((map) => (
          <div 
            key={map.id}
            onClick={() => navigate(`/roadmaps/${map.id}`)}
            className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-lg bg-${map.color}-50 text-${map.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {map.icon}
            </div>
            
            <div className="mb-4">
              <Badge color={map.progress === 0 ? 'gray' : map.progress === 100 ? 'green' : 'blue'}>
                {map.category}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">{map.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{map.total} Modules • Est. 3 Months</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>{map.progress}% Completed</span>
                <span>{map.completed}/{map.total}</span>
              </div>
              <ProgressBar progress={map.progress} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <img key={i} className="w-6 h-6 rounded-full border-2 border-white" src={`https://picsum.photos/30/30?random=${i+10}`} alt="User" />
                 ))}
                 <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">+2k</div>
              </div>
              <span className="text-sm font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">Start Path &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
