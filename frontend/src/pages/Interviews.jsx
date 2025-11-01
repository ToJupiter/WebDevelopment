import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Interviews() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/interviews`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const startInterview = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/interviews/start`, { method: 'POST' })
      const data = await res.json()
      alert(`Interview bắt đầu!\nCâu hỏi đầu tiên: ${data.firstQuestion}`)
      fetchSessions()
    } catch (err) {
      alert(`Lỗi: ${err.message}`)
    }
  }

  return (
    <div className="page">
      <h1>🎤 Đây là trang Interviews</h1>
      <p>Luyện phỏng vấn với AI assistant - Chuẩn bị cho cuộc phỏng vấn thực tế</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">{sessions.length}</div>
          <div className="label">Phỏng vấn đã làm</div>
        </div>
        <div className="stat-card">
          <div className="number">85.2</div>
          <div className="label">Điểm trung bình</div>
        </div>
        <div className="stat-card">
          <div className="number">2</div>
          <div className="label">Loại phỏng vấn</div>
        </div>
      </div>

      <div className="api-section">
        <h3>🎯 Phỏng vấn của tôi</h3>
        <button className="api-button" onClick={startInterview}>
          🚀 Bắt đầu phỏng vấn mới
        </button>
        <button className="api-button" onClick={fetchSessions}>
          🔄 Tải lại Sessions
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {sessions && sessions.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số phỏng vấn: {sessions.length}</strong></p>
            {sessions.map((session, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: '4px solid #e74c3c'
              }}>
                <h4>{session.session_name}</h4>
                <p><strong>ID:</strong> {session.session_id}</p>
                <p><strong>Loại:</strong> {session.interview_type}</p>
                <p><strong>Điểm:</strong> {session.score}/100</p>
                <p><strong>Ngày:</strong> {new Date(session.created_at).toLocaleString('vi-VN')}</p>
                <p><strong>Số câu hỏi:</strong> {Array.isArray(session.questions) ? session.questions.length : 0}</p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Chưa có phỏng vấn nào. Hãy bắt đầu một phỏng vấn mới!</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#fce4ec', borderRadius: 8 }}>
        <h3 style={{ color: '#c2185b' }}>🎓 Loại phỏng vấn:</h3>
        <ul className="feature-list">
          <li><strong>Simulated Interviews:</strong> Phỏng vấn mô phỏng thực tế</li>
          <li><strong>Prep Feedback:</strong> Nhận phản hồi chi tiết từ AI</li>
          <li><strong>Common Questions:</strong> Luyện các câu hỏi phỏng vấn phổ biến</li>
        </ul>
      </div>
    </div>
  )
}
