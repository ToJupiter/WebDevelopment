import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/calendar/events`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>📅 Đây là trang Calendar</h1>
      <p>Lịch học tập được AI gợi ý để tối ưu hóa hiệu suất của bạn</p>

      <div className="api-section">
        <h3>📆 Sự kiện học tập</h3>
        <button className="api-button" onClick={fetchEvents}>
          🔄 Tải lại Events
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {events && events.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số sự kiện: {events.length}</strong></p>
            {events.slice(0, 10).map((event, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: `4px solid ${event.color || '#3B82F6'}`
              }}>
                <h4>{event.title}</h4>
                <p><strong>Status:</strong> {event.status}</p>
                <p><strong>Start:</strong> {new Date(event.start_utc).toLocaleString('vi-VN')}</p>
                <p><strong>End:</strong> {new Date(event.end_utc).toLocaleString('vi-VN')}</p>
                {event.description && <p><strong>Mô tả:</strong> {event.description}</p>}
                <p><strong>Múi giờ:</strong> {event.timezone}</p>
              </div>
            ))}
            {events.length > 10 && <p>... và {events.length - 10} sự kiện khác</p>}
          </div>
        ) : (
          !loading && <p>Không có sự kiện nào</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 8 }}>
        <h3 style={{ color: '#856404' }}>💡 AI Calendar Features:</h3>
        <ul className="feature-list">
          <li><strong>Smart Scheduling:</strong> AI tự động gợi ý thời gian học tối ưu dựa trên năng suất</li>
          <li><strong>Reminders:</strong> Nhắc nhở trước các sự kiện học tập</li>
          <li><strong>Flexible Rescheduling:</strong> Dễ dàng reschedule các bài học</li>
          <li><strong>Multi-timezone:</strong> Hỗ trợ nhiều múi giờ</li>
        </ul>
      </div>
    </div>
  )
}
