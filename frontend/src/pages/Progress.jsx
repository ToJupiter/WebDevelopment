import React, { useState } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Progress() {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const userId = '9593c2a8-b6e0-11f0-a52f-a994e7cc46f9'

  const fetchProgress = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/progress/overview`, {
        headers: { 'x-user-id': userId }
      })
      const data = await res.json()
      setProgress(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>📊 Đây là trang Progress</h1>
      <p>Theo dõi tiến độ học tập và thống kê hiệu suất của bạn</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">65%</div>
          <div className="label">Hoàn thành</div>
        </div>
        <div className="stat-card">
          <div className="number">12</div>
          <div className="label">Modules hoàn thành</div>
        </div>
        <div className="stat-card">
          <div className="number">85%</div>
          <div className="label">Điểm bài tập</div>
        </div>
        <div className="stat-card">
          <div className="number">18h</div>
          <div className="label">Tổng thời gian học</div>
        </div>
      </div>

      <div className="api-section">
        <h3>📈 Chi tiết tiến độ</h3>
        <button className="api-button" onClick={fetchProgress} disabled={loading}>
          {loading ? '⏳ Đang tải...' : '📊 Tải Progress'}
        </button>

        {error && <p className="error">❌ Lỗi: {error}</p>}

        {progress && (
          <div style={{ marginTop: 20 }}>
            <pre className="response-box">{JSON.stringify(progress, null, 2)}</pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#f3e5f5', borderRadius: 8 }}>
        <h3 style={{ color: '#6a1b9a' }}>🎯 Mục tiêu học tập:</h3>
        <ul className="feature-list">
          <li><strong>Tuần này:</strong> Hoàn thành 3 modules JavaScript Advanced</li>
          <li><strong>Tháng này:</strong> Đạt 90% điểm trong tất cả bài tập</li>
          <li><strong>Tổng mục tiêu:</strong> Hoàn thành Full Stack Roadmap vào cuối Q1</li>
        </ul>
      </div>

      <div style={{ marginTop: 20, padding: 20, background: '#e8f5e9', borderRadius: 8 }}>
        <h3 style={{ color: '#27ae60' }}>💪 Streaks & Achievements:</h3>
        <p><strong>🔥 Streak hiện tại:</strong> 15 ngày học liên tục</p>
        <p><strong>🏆 Badges:</strong> Fast Learner, Consistent Coder, Problem Solver</p>
      </div>
    </div>
  )
}
