import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  ProgressBar,
  Input,
  Avatar,
} from "../components/ui/Common";
import {
  BookOpen,
  Play,
  Filter,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

const Learning = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [enrolledRoadmaps, setEnrolledRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledRoadmaps = async () => {
      try {
        const response = await api.get('/roadmaps/enrolled/list');
        setEnrolledRoadmaps(response.data.data);
      } catch (error) {
        console.error('Failed to fetch enrolled roadmaps', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledRoadmaps();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(enrolledRoadmaps.map(r => r.category));
    return Array.from(cats);
  }, [enrolledRoadmaps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrolledRoadmaps.filter((roadmap) => {
      const matchesQuery =
        !q ||
        roadmap.title.toLowerCase().includes(q) ||
        roadmap.description?.toLowerCase().includes(q) ||
        roadmap.category.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "All" || roadmap.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [enrolledRoadmaps, query, activeCategory]);

  const resumeCandidate = useMemo(() => {
    const ongoing = enrolledRoadmaps
      .filter((x) => (x.completion_percentage || 0) < 100)
      .sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0));
    return ongoing[0] || enrolledRoadmaps[0];
  }, [enrolledRoadmaps]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <div className="h-48 bg-slate-100 animate-pulse rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (enrolledRoadmaps.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
        <Card className="text-center py-12">
          <BookOpen className="mx-auto mb-4 text-slate-400" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Enrolled Roadmaps</h2>
          <p className="text-slate-500 mb-6">Start your learning journey by enrolling in a roadmap</p>
          <Button onClick={() => navigate('/roadmaps')}>Browse Roadmaps</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
          <p className="text-slate-500 mt-1">
            Track your active modules, pick up where you left off, and keep momentum.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50"
            icon={<BookOpen size={16} />}
            onClick={() => navigate('/roadmaps')}
          >
            Browse All
          </Button>

          {resumeCandidate && (
            <Button
              className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
              icon={<Play size={16} />}
              onClick={() => navigate(`/roadmaps/${resumeCandidate.roadmap_id}`)}
            >
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Resume Card + Filters */}
      {resumeCandidate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="relative h-[390px] md:h-[450px] lg:h-[500px]">
              <img
                src={resumeCandidate.image_url || `https://picsum.photos/900/500?random=${resumeCandidate.roadmap_id}`}
                className="w-full h-full object-cover"
                alt={resumeCandidate.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <Badge color="blue" className="mb-2">{resumeCandidate.category}</Badge>
                <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                  {resumeCandidate.title}
                </h2>
                <p className="text-white text-sm mt-1 drop-shadow-md line-clamp-2">
                  {resumeCandidate.description || 'Continue your learning journey'}
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-white text-sm drop-shadow">
                    <span className="font-semibold">{Math.round(resumeCandidate.completion_percentage || 0)}%</span>
                    <span className="text-white/80">·</span>
                    <span className="text-white/90">{resumeCandidate.completed_modules || 0} / {resumeCandidate.total_modules || 0} modules</span>
                    <span className="text-white/80">·</span>
                    <span className="text-white/90">{resumeCandidate.total_modules ? Math.ceil((resumeCandidate.total_modules - (resumeCandidate.completed_modules || 0)) * 1.5) : 0}h left</span>
                  </div>
                  <ProgressBar
                    progress={resumeCandidate.completion_percentage || 0}
                    className="bg-white/30"
                    barClassName="bg-white shadow-lg"
                  />
                  <div className="flex gap-3">
                    <Button
                      className="text-slate-900 shadow-xl font-semibold flex-1"
                      icon={<Play size={16} />}
                      onClick={() => navigate(`/roadmaps/${resumeCandidate.roadmap_id}`)}
                    >
                      Continue Learning
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                      icon={<BookOpen size={16} />}
                      onClick={() => navigate(`/roadmaps/${resumeCandidate.roadmap_id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        {/* Filters */}
        <Card title="Filters">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Filter size={16} />
              Refine results
            </div>

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roadmaps..."
            />

            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">
                CATEGORY
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      activeCategory === c
                        ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Card */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4">
              <Badge color="indigo">AI Assist</Badge>
              <h3 className="font-bold mt-2">Keep a streak</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Set a 20-minute daily focus block.
              </p>
              <Button className="mt-4 text-indigo-900" onClick={() => navigate('/calendar')}>
                View Calendar
              </Button>
            </div>
          </div>
        </Card>
        </div>
      )}

      {/* Active Roadmaps */}
      <h2 className="text-lg font-bold text-slate-900">
        {filtered.length === enrolledRoadmaps.length ? 'Enrolled Roadmaps' : `Filtered Roadmaps (${filtered.length})`}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? filtered.map((roadmap) => (
          <Card key={roadmap.roadmap_id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={roadmap.image_url || `https://picsum.photos/400/200?random=${roadmap.roadmap_id}`}
              className="h-32 w-full object-cover"
              alt={roadmap.title}
            />

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge color="blue">{roadmap.category}</Badge>
                {roadmap.completion_percentage >= 100 && (
                  <Badge color="green">Completed</Badge>
                )}
              </div>
              
              <h3 className="font-bold text-slate-900 mb-1">
                {roadmap.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {roadmap.description || 'No description available'}
              </p>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{Math.round(roadmap.completion_percentage || 0)}% complete</span>
                  <span>{roadmap.completed_modules || 0}/{roadmap.total_modules || 0} modules</span>
                </div>
                <ProgressBar
                  progress={roadmap.completion_percentage || 0}
                  className="bg-slate-200"
                  barClassName="bg-brand-500"
                />
              </div>

              <div className="mt-4 flex justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-300 hover:border-brand-400 hover:text-brand-600 flex-1"
                  onClick={() => navigate(`/roadmaps/${roadmap.roadmap_id}`)}
                >
                  View
                </Button>

                <Button
                  size="sm"
                  className="bg-brand-500 hover:bg-brand-600 text-white flex-1"
                  onClick={() => navigate(`/roadmaps/${roadmap.roadmap_id}`)}
                >
                  {roadmap.completion_percentage >= 100 ? 'Review' : 'Continue'}
                </Button>
              </div>
            </div>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12 text-slate-500">
            <p>No roadmaps match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
