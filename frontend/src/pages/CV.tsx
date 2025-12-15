import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Badge, Input } from "../components/ui/Common";
import { FileText, Sparkles, Download, Plus, Save, X } from "lucide-react";
import api from '../services/api';

const CV = () => {
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  // Fetch CV
  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const res = await api.get('/cvs');
      if (res.data.success && res.data.data.length > 0) {
        setCv(res.data.data[0]);
        setEditForm(res.data.data[0]);
      } else {
        setCv(null);
      }
    } catch (error) {
      console.error("Failed to fetch CV", error);
    } finally {
      setLoading(false);
    }
  };

  const createCV = async () => {
    try {
      setLoading(true);
      const initialData = {
        cv_name: 'My Professional CV',
        template_style: 'modern',
        personal_info: { name: '', email: '', phone: '', location: '', summary: '' },
        education: [],
        experience: [],
        skills: [],
        projects: []
      };
      const res = await api.post('/cvs', initialData);
      if (res.data.success) {
        setCv(res.data.data);
        setEditForm(res.data.data);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to create CV", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!cv) return;
    try {
      const res = await api.put(`/cvs/${cv.cv_id}`, editForm);
      if (res.data.success) {
        setCv(res.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDownload = async () => {
    if (!cv) return;
    try {
      const response = await api.post(`/cvs/${cv.cv_id}/generate-pdf`, {}, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cv.cv_name || 'CV'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleOptimise = async () => {
     if (!cv) return;
     try {
       const res = await api.post(`/cvs/${cv.cv_id}/optimize`, {
         job_description: 'Software Engineer'
       });
       if (res.data.success) {
         setCv(res.data.data);
         setEditForm(res.data.data);
         alert('CV optimized successfully!');
       }
     } catch (error) {
       console.error("Optimization failed", error);
       alert('Failed to optimize CV');
     }
  };

  if (loading) return <div className="p-8 text-center">Loading CV...</div>;

  if (!cv) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No CV Found</h2>
            <p className="text-slate-500 mb-6">Create your first CV to start tracking your skills and experience.</p>
            <Button onClick={createCV} icon={<Plus size={18} />}>Create CV</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cv.cv_name}</h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Editing Mode' : 'View and manage your professional profile.'}
          </p>
        </div>
        <div className="flex gap-2">
            {!isEditing && (
                <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button icon={<Download size={16} />} onClick={handleDownload}>Export PDF</Button>
                </>
            )}
            {isEditing && (
                <>
                <Button variant="ghost" onClick={() => { setIsEditing(false); setEditForm(cv); }}>Cancel</Button>
                <Button icon={<Save size={16} />} onClick={handleUpdate}>Save Changes</Button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main CV Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card title="Personal Information">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" value={editForm.personal_info?.name || ''} onChange={(e) => setEditForm({...editForm, personal_info: {...editForm.personal_info, name: e.target.value}})} />
                  <Input label="Email" type="email" value={editForm.personal_info?.email || ''} onChange={(e) => setEditForm({...editForm, personal_info: {...editForm.personal_info, email: e.target.value}})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" value={editForm.personal_info?.phone || ''} onChange={(e) => setEditForm({...editForm, personal_info: {...editForm.personal_info, phone: e.target.value}})} />
                  <Input label="Location" value={editForm.personal_info?.location || ''} onChange={(e) => setEditForm({...editForm, personal_info: {...editForm.personal_info, location: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
                  <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 outline-none bg-white" rows={4} value={editForm.personal_info?.summary || ''} onChange={(e) => setEditForm({...editForm, personal_info: {...editForm.personal_info, summary: e.target.value}})} placeholder="Brief professional summary..."/>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-lg">{cv.personal_info?.name || 'Not provided'}</p>
                <p className="text-slate-600">{cv.personal_info?.email} • {cv.personal_info?.phone}</p>
                <p className="text-slate-600">{cv.personal_info?.location}</p>
                <p className="text-slate-700 mt-4">{cv.personal_info?.summary || 'No summary added'}</p>
              </div>
            )}
          </Card>

          {/* Skills */}
          <Card title="Skills">
            {isEditing ? (
              <div>
                <p className="text-xs text-slate-500 mb-2">Enter comma-separated skills</p>
                <Input value={Array.isArray(editForm.skills) ? editForm.skills.join(', ') : ''} onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})} placeholder="JavaScript, React, Node.js, etc."/>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Array.isArray(cv.skills) && cv.skills.length > 0 ? cv.skills.map((s: string, i: number) => (
                  <Badge key={i} color="blue">{s}</Badge>
                )) : <p className="text-slate-500">No skills added</p>}
              </div>
            )}
          </Card>

          {/* Experience */}
          <Card title="Work Experience">
            {isEditing ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 mb-2">Add your work experience (JSON format for now)</p>
                <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 outline-none font-mono text-sm bg-white" rows={6} value={typeof editForm.experience === 'string' ? editForm.experience : JSON.stringify(editForm.experience, null, 2)} onChange={(e) => setEditForm({...editForm, experience: e.target.value})} placeholder='[{"company": "Tech Corp", "position": "Developer", "duration": "2020-2023", "description": "Built features"}]'/>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(cv.experience) && cv.experience.length > 0 ? cv.experience.map((exp: any, i: number) => (
                  <div key={i} className="border-l-4 border-brand-500 pl-4">
                    <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                    <p className="text-sm text-slate-600">{exp.company} • {exp.duration}</p>
                    <p className="text-sm text-slate-700 mt-1">{exp.description}</p>
                  </div>
                )) : <p className="text-slate-500">No experience added</p>}
              </div>
            )}
          </Card>

          {/* Education */}
          <Card title="Education">
            {isEditing ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 mb-2">Add your education (JSON format for now)</p>
                <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 outline-none font-mono text-sm bg-white" rows={4} value={typeof editForm.education === 'string' ? editForm.education : JSON.stringify(editForm.education, null, 2)} onChange={(e) => setEditForm({...editForm, education: e.target.value})} placeholder='[{"institution": "University", "degree": "BS Computer Science", "year": "2020"}]'/>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.isArray(cv.education) && cv.education.length > 0 ? cv.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                    <p className="text-sm text-slate-600">{edu.institution} • {edu.year}</p>
                  </div>
                )) : <p className="text-slate-500">No education added</p>}
              </div>
            )}
          </Card>

          {/* Projects */}
          <Card title="Projects">
            {isEditing ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 mb-2">Add your projects (JSON format for now)</p>
                <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 outline-none font-mono text-sm bg-white" rows={4} value={typeof editForm.projects === 'string' ? editForm.projects : JSON.stringify(editForm.projects, null, 2)} onChange={(e) => setEditForm({...editForm, projects: e.target.value})} placeholder='[{"name": "Portfolio Site", "description": "Built with React", "link": "https://..."}]'/>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.isArray(cv.projects) && cv.projects.length > 0 ? cv.projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <h4 className="font-semibold text-slate-900">{proj.name}</h4>
                    <p className="text-sm text-slate-700">{proj.description}</p>
                    {proj.link && <a href={proj.link} className="text-sm text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">View Project</a>}
                  </div>
                )) : <p className="text-slate-500">No projects added</p>}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Template Style">
            {isEditing ? (
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 outline-none bg-white" value={editForm.template_style} onChange={(e) => setEditForm({...editForm, template_style: e.target.value})}>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            ) : (
              <Badge color="blue">{cv.template_style}</Badge>
            )}
          </Card>

          <Card title="Quick Tips">
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Use action verbs</li>
              <li>• Quantify achievements</li>
              <li>• Keep it concise</li>
              <li>• Tailor to job description</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CV;
