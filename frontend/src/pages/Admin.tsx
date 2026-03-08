import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "../components/ui/Common";
import { Users, BookOpen, Activity, Award, Target, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRoadmaps: 0,
    totalModules: 0,
    totalExercises: 0,
    totalCertificates: 0,
    publishedRoadmaps: 0,
    draftRoadmaps: 0
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [roadmapsRes, certsRes] = await Promise.all([
        api.get('/roadmaps'),
        api.get('/certificates')
      ]);
      
      const roadmaps = roadmapsRes.data.data;
      const totalModules = roadmaps.reduce((sum: number, r: any) => sum + (r.module_count || 0), 0);
      const published = roadmaps.filter((r: any) => r.status === 'published').length;
      const draft = roadmaps.filter((r: any) => r.status === 'draft').length;

      setStats({
        totalRoadmaps: roadmaps.length,
        totalModules: totalModules,
        totalExercises: 0, // Would need separate endpoint
        totalCertificates: certsRes.data.data.length,
        publishedRoadmaps: published,
        draftRoadmaps: draft
      });
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  const roadmapStatusData = [
    { name: 'Published', value: stats.publishedRoadmaps, color: '#10b981' },
    { name: 'Draft', value: stats.draftRoadmaps, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">
            System overview and content management.
          </p>
        </div>
        <Button onClick={() => window.location.hash = '#/roadmaps'}>
          Manage Content
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i}>
              <div className="h-20 bg-slate-100 animate-pulse rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "Total Roadmaps", value: stats.totalRoadmaps, icon: <BookOpen />, color: "blue" },
            { label: "Total Modules", value: stats.totalModules, icon: <Target />, color: "green" },
            { label: "Certificates Issued", value: stats.totalCertificates, icon: <Award />, color: "amber" },
            { label: "Published", value: stats.publishedRoadmaps, icon: <TrendingUp />, color: "purple" },
          ].map((s, i) => (
            <Card key={i} hoverable>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {s.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center`}>
                  {s.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Roadmap Status Distribution">
          <div className="h-64 flex items-center justify-center">
            {roadmapStatusData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roadmapStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roadmapStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500">No roadmap data available</p>
            )}
          </div>
        </Card>

        <Card title="Content Overview">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Roadmaps', value: stats.totalRoadmaps },
                { name: 'Modules', value: stats.totalModules },
                { name: 'Certificates', value: stats.totalCertificates }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start" onClick={() => window.location.hash = '#/roadmaps'}>
            <BookOpen size={18} className="mr-2" />
            Manage Roadmaps
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.hash = '#/certificates'}>
            <Award size={18} className="mr-2" />
            View Certificates
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.hash = '#/analytics'}>
            <Activity size={18} className="mr-2" />
            Analytics
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Admin;
