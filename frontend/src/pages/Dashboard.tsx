import React from 'react';
import { Card, Button, Badge, ProgressBar, Avatar } from '../components/ui/Common';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  ArrowRight,
  MoreHorizontal,
  Calendar,
  Video
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 3 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 4.5 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Alex! You've learned for 32 hours this week.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Calendar size={16} />}>Schedule</Button>
          <Button>Resume Learning</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Progress', value: '85%', icon: <TrendingUp className="text-emerald-500" />, change: '+12%', color: 'emerald' },
          { label: 'Time Spent', value: '32h', icon: <Clock className="text-brand-500" />, change: '+4h', color: 'brand' },
          { label: 'Modules Finished', value: '12', icon: <Target className="text-amber-500" />, change: '2 pending', color: 'amber' },
          { label: 'Certificates', value: '4', icon: <Award className="text-purple-500" />, change: 'New!', color: 'purple' },
        ].map((stat, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">{stat.change}</span> from last week
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <Card title="Learning Activity" className="h-full">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Current Course Progress */}
        <div className="space-y-6">
          <Card title="Continue Learning" extra={<Button variant="ghost" size="sm">View All</Button>}>
             <div className="space-y-6">
                {[
                  { title: "Advanced React Patterns", progress: 75, module: "Higher-Order Components", img: "https://picsum.photos/200/200?random=1" },
                  { title: "System Design Interview", progress: 30, module: "Load Balancing", img: "https://picsum.photos/200/200?random=2" },
                  { title: "UI/UX Fundamentals", progress: 90, module: "Color Theory", img: "https://picsum.photos/200/200?random=3" }
                ].map((course, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex gap-4 mb-3">
                      <img src={course.img} alt={course.title} className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{course.title}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{course.module}</p>
                        <ProgressBar progress={course.progress} height="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="outline" className="w-full mt-4" icon={<ArrowRight size={14} />}>Go to Current Module</Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none">
            <div className="flex items-start justify-between">
              <div>
                <Badge color="indigo">Pro Tip</Badge>
                <h3 className="text-lg font-bold mt-2">Practice Makes Perfect</h3>
                <p className="text-indigo-200 text-sm mt-1 mb-4">Try the AI interview simulator to test your knowledge.</p>
                <Button size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none">Start Practice</Button>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Video className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Recommended Roadmaps */}
       <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
           <Button variant="ghost" size="sm">Explore All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <Card key={i} hoverable className="p-0 overflow-hidden">
                <div className="h-32 bg-slate-200 relative">
                   <img src={`https://picsum.photos/400/200?random=${10+i}`} className="w-full h-full object-cover" alt="Course" />
                   <div className="absolute top-3 right-3">
                     <Badge color="gray" className="shadow-sm">Beginner</Badge>
                   </div>
                </div>
                <div className="p-5">
                   <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                      <Avatar src={`https://picsum.photos/30/30?random=${i}`} alt="Instructor" size="sm" />
                      <span>Sarah Drasner</span>
                      <span className="mx-1">•</span>
                      <span>4h 30m</span>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-1">Fullstack Serverless GraphQL</h3>
                   <p className="text-sm text-slate-500 mb-4 line-clamp-2">Learn to build scalable apps with AWS Lambda, DynamoDB and Apollo.</p>
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                         ★★★★★ <span className="text-slate-400 ml-1 font-normal">(420)</span>
                      </div>
                      <Button variant="outline" size="sm">Preview</Button>
                   </div>
                </div>
             </Card>
           ))}
        </div>
       </div>
    </div>
  );
};

export default Dashboard;