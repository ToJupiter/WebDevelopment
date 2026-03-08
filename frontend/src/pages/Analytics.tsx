import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Common';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [enrolledRoadmaps, setEnrolledRoadmaps] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [skillData, setSkillData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [roadmapsRes, overviewRes] = await Promise.all([
          api.get('/roadmaps/enrolled/list'),
          api.get('/progress/overview')
        ]);
        
        const roadmaps = roadmapsRes.data.data;
        setEnrolledRoadmaps(roadmaps);

        // Generate activity data (placeholder - in real app would come from activity logs)
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekData = days.map((day, i) => ({
          name: day,
          study: Math.random() * 5 + 1,
          practice: Math.random() * 4
        }));
        setActivityData(weekData);

        // Generate skill radar based on roadmap progress
        const skills = roadmaps.slice(0, 6).map((roadmap: any) => ({
          subject: roadmap.title.length > 15 ? roadmap.title.substring(0, 15) + '...' : roadmap.title,
          A: roadmap.completion_percentage || 0,
          fullMark: 100
        }));
        setSkillData(skills.length > 0 ? skills : [
          { subject: 'No Data', A: 0, fullMark: 100 }
        ]);
      } catch (e) {
        console.error('Failed to fetch analytics', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <div className="h-80 bg-slate-100 animate-pulse rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
        <p className="text-slate-500 mt-1">Track your learning progress and skill development</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Activity (Estimated Hours)">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="study" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="practice" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Roadmap Progress Overview">
          <div className="h-80 w-full flex justify-center">
            {skillData.length > 0 && skillData[0].subject !== 'No Data' ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Progress"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Enroll in roadmaps to see progress</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Learning Consistency Trend" className="lg:col-span-2">
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={activityData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip />
                 <Line type="monotone" dataKey="study" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} activeDot={{r: 6}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
