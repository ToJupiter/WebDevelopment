import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Input } from "../components/ui/Common";
import { CalendarDays, Clock, Sparkles, Plus, X, Edit, Trash2, Bell } from "lucide-react";
import api from "../services/api";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_utc: '',
    end_utc: '',
    all_day: false,
    color: '#3B82F6',
    module_id: '',
    reminder_minutes: 30
  });

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/calendar/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/calendar/events/${editingEvent.event_id}`, formData);
      } else {
        await api.post('/calendar/events', formData);
      }
      setShowModal(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event', error);
      alert('Failed to save event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/calendar/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_utc: '',
      end_utc: '',
      all_day: false,
      color: '#3B82F6',
      module_id: '',
      reminder_minutes: 30
    });
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_utc: new Date(event.start_utc).toISOString().slice(0, 16),
      end_utc: new Date(event.end_utc).toISOString().slice(0, 16),
      all_day: event.all_day,
      color: event.color || '#3B82F6',
      module_id: event.module_id || '',
      reminder_minutes: event.reminder_minutes || 30
    });
    setShowModal(true);
  };

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start_utc);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_utc);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).sort((a, b) => new Date(a.start_utc).getTime() - new Date(b.start_utc).getTime());

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_utc);
    const today = new Date();
    return eventDate > today;
  }).sort((a, b) => new Date(a.start_utc).getTime() - new Date(b.start_utc).getTime()).slice(0, 5);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-500 mt-1">
            Plan your learning sessions and stay consistent.
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => { setShowModal(true); setEditingEvent(null); resetForm(); }}>
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                >
                  Prev
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((date, index) => {
                const dayEvents = getEventsForDay(date);
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-2 rounded-lg border transition-all ${
                      !date 
                        ? 'bg-slate-50 border-slate-100' 
                        : isToday(date)
                        ? 'bg-brand-50 border-brand-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-brand-200 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-semibold mb-1 ${isToday(date) ? 'text-brand-700' : 'text-slate-700'}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.event_id}
                              className="text-xs px-1 py-0.5 rounded truncate"
                              style={{ backgroundColor: event.color + '20', color: event.color }}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Today's Events & Upcoming */}
        <div className="space-y-6">
          <Card title="Today's Schedule">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded"></div>)}
              </div>
            ) : todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div
                    key={event.event_id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                        <p className="font-semibold text-slate-800 text-sm">{event.title}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(event)} className="p-1 hover:bg-slate-200 rounded">
                          <Edit size={14} className="text-slate-600" />
                        </button>
                        <button onClick={() => handleDelete(event.event_id)} className="p-1 hover:bg-red-100 rounded">
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={12} />
                      <span>{new Date(event.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.reminder_minutes && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                        <Bell size={12} />
                        <span>{event.reminder_minutes}min before</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No events scheduled for today</p>
            )}
          </Card>

          <Card title="Upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.event_id} className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <p className="font-semibold text-sm text-slate-800">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.start_utc).toLocaleDateString()} at {new Date(event.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming events</p>
            )}
          </Card>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => { setShowModal(false); setEditingEvent(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <Input
                label="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="e.g., Study React Hooks"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none bg-white"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional details about this event"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none bg-white"
                    value={formData.start_utc}
                    onChange={(e) => setFormData({...formData, start_utc: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none bg-white"
                    value={formData.end_utc}
                    onChange={(e) => setFormData({...formData, end_utc: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <input
                    type="color"
                    className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer bg-white"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reminder (minutes before)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none bg-white"
                    value={formData.reminder_minutes}
                    onChange={(e) => setFormData({...formData, reminder_minutes: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="all_day"
                  checked={formData.all_day}
                  onChange={(e) => setFormData({...formData, all_day: e.target.checked})}
                  className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="all_day" className="text-sm text-slate-700">All day event</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingEvent(null); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update' : 'Create'} Event
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Calendar;
