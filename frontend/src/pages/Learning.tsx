import React, { useMemo, useState } from "react";
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

type LearningItem = {
  id: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Frontend" | "Backend" | "Design" | "Interview";
  progress: number;
  eta: string;
  lessonsDone: number;
  lessonsTotal: number;
  lastTouched: string;
  cover: string;
  instructorName: string;
  instructorAvatar: string;
};

const Learning = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<LearningItem["category"] | "All">("All");
  const [activeLevel, setActiveLevel] =
    useState<LearningItem["level"] | "All">("All");

  const items: LearningItem[] = useMemo(
    () => [
      {
        id: "react-patterns",
        title: "Advanced React Patterns",
        subtitle: "HOCs, Render Props, Compound Components",
        level: "Advanced",
        category: "Frontend",
        progress: 72,
        eta: "2h 10m",
        lessonsDone: 18,
        lessonsTotal: 25,
        lastTouched: "Yesterday",
        cover: "https://picsum.photos/900/500?random=31",
        instructorName: "Sarah Drasner",
        instructorAvatar: "https://picsum.photos/80/80?random=131",
      },
      {
        id: "system-design",
        title: "System Design Interview",
        subtitle: "Load balancing, caching, partitioning",
        level: "Intermediate",
        category: "Interview",
        progress: 34,
        eta: "4h 20m",
        lessonsDone: 6,
        lessonsTotal: 18,
        lastTouched: "2 days ago",
        cover: "https://picsum.photos/900/500?random=32",
        instructorName: "Alex Xu",
        instructorAvatar: "https://picsum.photos/80/80?random=132",
      },
      {
        id: "ux-fundamentals",
        title: "UI/UX Fundamentals",
        subtitle: "Typography, spacing, visual hierarchy",
        level: "Beginner",
        category: "Design",
        progress: 90,
        eta: "45m",
        lessonsDone: 9,
        lessonsTotal: 10,
        lastTouched: "Today",
        cover: "https://picsum.photos/900/500?random=33",
        instructorName: "Mia Chen",
        instructorAvatar: "https://picsum.photos/80/80?random=133",
      },
      {
        id: "node-api",
        title: "Node API Essentials",
        subtitle: "REST patterns, auth, pagination",
        level: "Intermediate",
        category: "Backend",
        progress: 12,
        eta: "6h 10m",
        lessonsDone: 2,
        lessonsTotal: 16,
        lastTouched: "Last week",
        cover: "https://picsum.photos/900/500?random=34",
        instructorName: "Kent C. Dodds",
        instructorAvatar: "https://picsum.photos/80/80?random=134",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesQuery =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.subtitle.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.level.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "All" || it.category === activeCategory;
      const matchesLevel =
        activeLevel === "All" || it.level === activeLevel;

      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [items, query, activeCategory, activeLevel]);

  const resumeCandidate = useMemo(() => {
    const ongoing = items
      .filter((x) => x.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    return ongoing[0] || items[0];
  }, [items]);

  const categories: Array<LearningItem["category"]> = [
    "Frontend",
    "Backend",
    "Design",
    "Interview",
  ];
  const levels: Array<LearningItem["level"]> = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
          <p className="text-slate-500 mt-1">
            Track your active modules, pick up where you left off, and keep
            momentum.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50"
            icon={<BookOpen size={16} />}
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
              setActiveLevel("All");
            }}
          >
            Browse All
          </Button>

          <Button
            className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            icon={<Play size={16} />}
            onClick={() => navigate(`/learning/${resumeCandidate.id}`)}
          >
            Resume
          </Button>
        </div>
      </div>

      {/* Resume Card + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          {/*<div className="relative h-56">*/}
          <div className="relative h-[390px] md:h-[450px] lg:h-[500px]">
            <img
              src={resumeCandidate.cover}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                {resumeCandidate.title}
              </h2>
              <p className="text-white text-sm mt-1 drop-shadow-md">
                {resumeCandidate.subtitle}
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-white text-sm drop-shadow">
                  <span className="font-semibold">{resumeCandidate.progress}%</span>
                  <span className="text-white/80">·</span>
                  <span className="text-white/90">{resumeCandidate.lessonsDone} / {resumeCandidate.lessonsTotal} lessons</span>
                  <span className="text-white/80">·</span>
                  <span className="text-white/90">{resumeCandidate.eta} left</span>
                </div>
                <ProgressBar
                  progress={resumeCandidate.progress}
                  className="bg-white/30"
                  barClassName="bg-white shadow-lg"
                />
                <div className="flex gap-3">
                  <Button
                    className="text-slate-900 shadow-xl font-semibold flex-1"
                    icon={<Play size={16} />}
                    onClick={() =>
                      navigate(`/learning/${resumeCandidate.id}`)
                    }
                  >
                    Continue Learning
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    icon={<BookOpen size={16} />}
                    onClick={() =>
                      navigate(`/learning/${resumeCandidate.id}`)
                    }
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
              placeholder="Search modules..."
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
                    onClick={() =>
                      setActiveCategory(c as any)
                    }
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

            {/* Level */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">
                LEVEL
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...levels].map((l) => (
                  <button
                    key={l}
                    onClick={() =>
                      setActiveLevel(l as any)
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      activeLevel === l
                        ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {l}
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
              <Button className="mt-4 text-indigo-900">
                Suggest schedule
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Modules */}
      <h2 className="text-lg font-bold text-slate-900">
        Active Modules
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((it) => (
          <Card key={it.id} className="p-0 overflow-hidden">
            <img
              src={it.cover}
              className="h-32 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="font-bold text-slate-900">
                {it.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {it.subtitle}
              </p>

              <ProgressBar
                progress={it.progress}
                className="bg-slate-200"
                barClassName="bg-brand-500"
              />

              <div className="mt-4 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-300 hover:border-brand-400 hover:text-brand-600"
                  onClick={() =>
                    navigate(`/learning/${it.id}`)
                  }
                >
                  Open
                </Button>

                <Button
                  size="sm"
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={() =>
                    navigate(`/learning/${it.id}`)
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learning;
