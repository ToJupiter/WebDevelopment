import { Card, Button, ProgressBar, Badge } from "../components/ui/Common";
import { FileText, Sparkles, Download } from "lucide-react";

const CV = () => {
  const completeness = 65;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resume</h1>
          <p className="text-slate-500 mt-1">
            Build and improve your professional profile.
          </p>
        </div>
        <Button icon={<Download size={16} />}>Export PDF</Button>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" />
            <p className="font-semibold text-slate-900">Profile Completeness</p>
          </div>
          <span className="font-bold text-slate-900">{completeness}%</span>
        </div>
        <ProgressBar progress={completeness} />
      </Card>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Summary">
          <p className="text-slate-600">
            Short professional summary goes here. Add your goals, strengths,
            and current focus.
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Edit
          </Button>
        </Card>

        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "SQL", "System Design"].map((s) => (
              <Badge key={s} color="blue">
                {s}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Manage Skills
          </Button>
        </Card>

        <Card title="Experience">
          <p className="text-slate-600">
            No experience added yet. Start by adding your first role.
          </p>
          <Button size="sm" className="mt-4">
            Add Experience
          </Button>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <Badge color="indigo">AI Assist</Badge>
          <h3 className="font-bold text-lg mt-2">Improve with AI</h3>
          <p className="text-indigo-200 text-sm mt-1">
            Let Lumina rewrite your CV for clarity and impact.
          </p>
          <Button className="mt-4 bg-white text-indigo-900 border-none">
            <Sparkles size={16} className="mr-2" />
            Enhance CV
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CV;
