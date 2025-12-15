import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, ProgressBar } from "../components/ui/Common";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Video,
  FileText,
  Sparkles,
  MessageSquare,
  UploadCloud,
  ChevronUp,
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const LearningModule = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [showChat, setShowChat] = useState(false);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    watch: false,
    read: true,
    code: false,
    exercise: false,
  });

  const progress = useMemo(() => {
    const vals = Object.values(checklist);
    const done = vals.filter(Boolean).length;
    return Math.round((done / vals.length) * 100);
  }, [checklist]);

  const title = useMemo(() => {
    const pretty = (moduleId || "module").replace(/[-_]/g, " ");
    return pretty.replace(/\b\w/g, (m) => m.toUpperCase());
  }, [moduleId]);

  const sections: Section[] = useMemo(
    () => [
      {
        id: "overview",
        title: "Overview",
        icon: <BookOpen size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              In this module, you’ll learn the core concepts, then reinforce them with a small hands-on exercise.
              Use the checklist to track completion and jump between sections using the table of contents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated time</p>
                <p className="text-lg font-bold text-slate-900 mt-1">45–60 min</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-lg font-bold text-slate-900 mt-1">Intermediate</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning goal</p>
                <p className="text-lg font-bold text-slate-900 mt-1">Build intuition + practice</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge color="indigo">AI Hint</Badge>
                  <h3 className="font-bold text-lg mt-2">Ask “why” before “how”</h3>
                  <p className="text-indigo-200 text-sm mt-1">
                    If you understand the trade-offs, implementation details become much easier to memorize.
                  </p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <Sparkles size={20} />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "video",
        title: "Video Lesson",
        icon: <Video size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative">
              <div className="aspect-video w-full flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <Video className="text-white" />
                  </div>
                  <p className="text-white font-semibold">Embedded video placeholder</p>
                  <p className="text-white/60 text-sm mt-1">
                    Hook up your player later; layout and styling already match the template.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-1.5 bg-brand-500 rounded-full w-[35%]"></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-white/70">
                  <span>12:10</span>
                  <span>34:20</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, watch: !p.watch }))}
              icon={checklist.watch ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark video as {checklist.watch ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "reading",
        title: "Reading Notes",
        icon: <FileText size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-slate-900">Key ideas</h3>
              <ul className="text-slate-700">
                <li>Focus on constraints first (time, space, correctness).</li>
                <li>Choose the simplest approach that satisfies requirements.</li>
                <li>Make trade-offs explicit and test assumptions early.</li>
              </ul>
              <h3 className="text-slate-900">Mini takeaway</h3>
              <p className="text-slate-700">
                Good solutions are rarely “perfect”—they are <b>appropriate</b> given the context.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, read: !p.read }))}
              icon={checklist.read ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark reading as {checklist.read ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "code",
        title: "Code Walkthrough",
        icon: <Code2 size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              This is a styled code block matching Lumina’s brand palette and typography.
              Swap in a real editor later if needed.
            </p>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Example</span>
                <Badge color="gray">TypeScript</Badge>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono leading-relaxed">
{`type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function safeParseNumber(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n)) return { ok: false, error: "Not a number" };
  return { ok: true, value: n };
}`}
              </pre>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, code: !p.code }))}
              icon={checklist.code ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark code walkthrough as {checklist.code ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "exercise",
        title: "Exercise",
        icon: <BookOpen size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <Card title="Task: Implement a small helper" className="bg-slate-50">
              <p className="text-slate-700 leading-relaxed">
                Create a helper that validates input and returns a typed result. Include one unit test case.
              </p>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requirements</p>
                  <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
                    <li>Return a discriminated union result</li>
                    <li>Handle invalid input</li>
                    <li>Include one example test</li>
                  </ul>
                </div>

                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 flex items-center justify-center text-center">
                  <div className="max-w-xs">
                    <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Submission placeholder</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Plug in drag & drop upload or a form later—this keeps the UI consistent.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setChecklist((p) => ({ ...p, exercise: !p.exercise }))}
              icon={checklist.exercise ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark exercise as {checklist.exercise ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
    ],
    [checklist]
  );

  // Smooth scroll to section + active section highlight
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5] }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const checklistItems = useMemo(
    () => [
      { key: "read", label: "Read notes" },
      { key: "watch", label: "Watch lesson" },
      { key: "code", label: "Follow code walkthrough" },
      { key: "exercise", label: "Complete exercise" },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" ref={containerRef}>
      {/* Main content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              onClick={() => navigate("/learning")}
            >
              <ArrowLeft size={16} />
              Back to My Learning
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mt-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge color="gray">Module</Badge>
              <Badge color="blue">Interactive</Badge>
              <Badge color="indigo">Brand: Lumina</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<MessageSquare size={16} />}
              onClick={() => setShowChat((s) => !s)}
            >
              {showChat ? "Hide" : "AI Chat"}
            </Button>
            <Button onClick={() => onJump("exercise")}>Go to Exercise</Button>
          </div>
        </div>

        {/* Progress strip */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center ring-1 ring-brand-200">
                <BookOpen className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Module progress</p>
                <p className="text-xs text-slate-500">Complete checklist items to finish this module.</p>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">{progress}%</div>
          </div>
          <div className="p-6">
            <ProgressBar progress={progress} height="h-2.5" />
          </div>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <h2 className="text-base font-semibold text-slate-900">{s.title}</h2>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full opacity-60" />
              </div>
              <div className="p-6">{s.content}</div>
            </div>
          ))}
        </div>

        {/* Back to top */}
        <div className="flex justify-center pt-2">
          <Button variant="ghost" icon={<ChevronUp size={16} />} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
        {/* TOC */}
        <Card title="Contents">
          <div className="space-y-1">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onJump(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-600 ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="flex-none">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Checklist */}
        <Card title="Checklist">
          <div className="space-y-2">
            {checklistItems.map((it) => {
              const checked = !!checklist[it.key];
              return (
                <button
                  key={it.key}
                  onClick={() => setChecklist((p) => ({ ...p, [it.key]: !p[it.key] }))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    {checked ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <Circle size={18} className="text-slate-300" />
                    )}
                    {it.label}
                  </span>
                  <span className={`text-xs font-bold ${checked ? "text-emerald-600" : "text-slate-400"}`}>
                    {checked ? "Done" : "Todo"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tip</p>
            <p className="text-sm text-slate-700 mt-1">
              Use the TOC to jump between sections and keep your flow.
            </p>
          </div>
        </Card>

        {/* AI chat panel placeholder */}
        {showChat ? (
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge color="indigo">AI Assistant</Badge>
                <h3 className="font-bold text-lg mt-2">Ask about this module</h3>
                <p className="text-indigo-200 text-sm mt-1">
                  This is a UI placeholder. Wire it to your assistant endpoint later.
                </p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/10 border border-white/10 p-3 text-sm text-white/80">
              Try: “Summarize the key trade-offs from the reading notes.”
            </div>

            <Button
              size="sm"
              className="mt-4 bg-white text-indigo-900 hover:bg-indigo-50 border-none"
              onClick={() => setShowChat(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center text-slate-500">
            <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <MessageSquare className="text-slate-300" />
            </div>
            <p className="font-semibold">Need help?</p>
            <p className="text-sm mt-1">Toggle AI Chat for contextual guidance.</p>
          </div>
        )}

        {/* Sticky action bar on mobile */}
        <div className="lg:hidden sticky bottom-3">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Progress</p>
              <p className="text-sm font-bold text-slate-900 tabular-nums">{clamp(progress, 0, 100)}%</p>
            </div>
            <Button size="sm" onClick={() => onJump("exercise")}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
