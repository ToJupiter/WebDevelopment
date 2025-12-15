import { Card, Badge } from "../components/ui/Common";
import { Users, BookOpen, Activity } from "lucide-react";

const Admin = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">
          System overview and activity monitoring.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Users", value: "1,248", icon: <Users /> },
          { label: "Active Learners", value: "312", icon: <Activity /> },
          { label: "Modules", value: "86", icon: <BookOpen /> },
          { label: "Completion Rate", value: "74%", icon: <Activity /> },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {s.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {[
            "User A completed React Patterns",
            "User B updated CV",
            "New module added: UX Basics",
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm p-3 rounded-lg border border-slate-200 bg-slate-50"
            >
              <span className="text-slate-700">{a}</span>
              <Badge color="gray">log</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Admin;
