import { Card, Button, Badge } from "../components/ui/Common";
import { CalendarDays, Clock, Sparkles } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-500 mt-1">
            Plan your learning sessions and stay consistent.
          </p>
        </div>
        <Button icon={<Sparkles size={16} />}>AI Schedule</Button>
      </div>

      {/* Week View */}
      <Card title="This Week">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {days.map((d, i) => (
            <div
              key={d}
              className={`rounded-xl border p-4 text-center ${
                i === 2
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-slate-600">{d}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{10 + i}</p>

              {i === 2 && (
                <Badge color="indigo" className="mt-2">
                  Today
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Study Blocks */}
      <Card title="Scheduled Sessions">
        <div className="space-y-3">
          {[
            { title: "React Patterns", time: "09:00 – 10:00" },
            { title: "System Design", time: "14:00 – 15:30" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-slate-400" size={18} />
                <div>
                  <p className="font-semibold text-slate-800">{s.title}</p>
                  <p className="text-sm text-slate-500">{s.time}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Calendar;
