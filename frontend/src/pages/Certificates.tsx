import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui/Common';
import { Award, Download, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface Certificate {
  certificate_id: string;
  certificate_name: string;
  issue_date: string;
  pdf_url?: string;
  roadmap_id?: string;
  roadmap?: {
    title: string;
    category: string;
  };
}

const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates');
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch certificates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const response = await api.get(`/certificates/${id}/download`, {
        responseType: 'blob',
      });
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-slate-500 mt-1">Verify and download your earned credentials.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No Certificates Yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Complete all modules in a roadmap to earn a certificate.</p>
          <Button onClick={() => navigate('/roadmaps')}>Browse Roadmaps</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.certificate_id} className="group hover:border-brand-200 hover:shadow-lg transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-bl-full opacity-50"></div>
              
              <div className="flex items-start justify-between mb-4 relative">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Award size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  {cert.roadmap && <Badge color="blue">{cert.roadmap.category || 'Tech'}</Badge>}
                  <Badge color="green" className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Completed
                  </Badge>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{cert.certificate_name}</h3>
              {cert.roadmap && (
                <p className="text-sm text-slate-600 mb-2">{cert.roadmap.title}</p>
              )}
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                <Calendar size={12} />
                Issued on {new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDownload(cert.certificate_id, cert.certificate_name)}
                  icon={<Download size={14} />}
                >
                  PDF
                </Button>
                {cert.roadmap_id && (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/roadmaps/${cert.roadmap_id}`)}
                    icon={<ExternalLink size={14} />}
                  >
                    Roadmap
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
