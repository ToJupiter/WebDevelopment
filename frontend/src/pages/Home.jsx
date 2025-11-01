import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BACKEND = 'http://localhost:4000'

export default function Home() {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/health`)
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (err) {
      setOutput(`❌ Lỗi: ${err.message}`)
    }
    setLoading(false)
  }

  const getUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/users/me`, {
        headers: { 'x-user-id': '9593c2a8-b6e0-11f0-a52f-a994e7cc46f9' }
      })
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (err) {
      setOutput(`❌ Lỗi: ${err.message}`)
    }
    setLoading(false)
  }

  const routes = [
    { path: '/roadmaps', icon: '🗺️', title: 'Roadmaps', desc: 'Lộ trình học tập' },
    { path: '/modules', icon: '📚', title: 'Modules', desc: 'Các mô-đun học' },
    { path: '/progress', icon: '📊', title: 'Progress', desc: 'Theo dõi tiến độ' },
    { path: '/calendar', icon: '📅', title: 'Calendar', desc: 'Lịch học' },
    { path: '/interviews', icon: '🎤', title: 'Interviews', desc: 'Luyện phỏng vấn' },
    { path: '/cvs', icon: '📄', title: 'CVs', desc: 'Xây dựng CV' },
    { path: '/certificates', icon: '🏆', title: 'Certificates', desc: 'Chứng chỉ' },
    { path: '/exercises', icon: '💻', title: 'Exercises', desc: 'Bài tập code' },
  ]

  return (
    <div className="page">
      <h1>🏠 Đây là trang Home</h1>
      <p>Chào mừng đến với <strong>SkillSync</strong> - Nền tảng học tập toàn diện với AI!</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">10</div>
          <div className="label">Người dùng</div>
        </div>
        <div className="stat-card">
          <div className="number">5</div>
          <div className="label">Roadmaps</div>
        </div>
        <div className="stat-card">
          <div className="number">20+</div>
          <div className="label">Modules</div>
        </div>
        <div className="stat-card">
          <div className="number">∞</div>
          <div className="label">Exercises</div>
        </div>
      </div>

      <h2 style={{ marginTop: 30, marginBottom: 20, color: '#667eea' }}>🚀 Khám phá các tính năng:</h2>
      
      <div className="routes-grid">
        {routes.map((route) => (
          <Link key={route.path} to={route.path} className="route-card">
            <div className="route-icon">{route.icon}</div>
            <div className="route-title">{route.title}</div>
            <div className="route-desc">{route.desc}</div>
            <div className="route-arrow">→</div>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: 40, marginBottom: 15, color: '#667eea' }}>✨ Tính năng nổi bật:</h2>
      <ul className="feature-list">
        <li><strong>Learning Roadmaps:</strong> Lộ trình học tập từng bước được thiết kế bởi các chuyên gia</li>
        <li><strong>Interactive Modules:</strong> Các mô-đun học tương tác với nội dung chi tiết</li>
        <li><strong>Progress Tracking:</strong> Theo dõi tiến độ học tập theo thời gian thực</li>
        <li><strong>AI Calendar:</strong> Lịch học được AI gợi ý để tối ưu hóa hiệu suất</li>
        <li><strong>Interview Prep:</strong> Chuẩn bị phỏng vấn với AI assistant</li>
        <li><strong>CV Builder:</strong> Xây dựng CV chuyên nghiệp với nhiều templates</li>
        <li><strong>Certificates:</strong> Nhận chứng chỉ hoàn thành khóa học</li>
        <li><strong>Code Exercises:</strong> Hàng trăm bài tập code với hỗ trợ AI</li>
      </ul>

      <div className="api-section" style={{ marginTop: 40 }}>
        <h3>🔗 Test Backend API:</h3>
        <button className="api-button" onClick={checkHealth} disabled={loading}>
          {loading ? '⏳ Đang kiểm tra...' : '✓ Check Health'}
        </button>
        <button className="api-button" onClick={getUser} disabled={loading}>
          {loading ? '⏳ Đang tải...' : '👤 Get User Info'}
        </button>
        {output && (
          <div className="response-box">{output}</div>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#e8f5e9', borderRadius: 8 }}>
        <h3 style={{ color: '#27ae60', marginBottom: 10 }}>ℹ️ Thông tin hệ thống:</h3>
        <p><strong>Backend:</strong> Express.js + Prisma + MySQL</p>
        <p><strong>Frontend:</strong> React 18 + React Router</p>
        <p><strong>Database:</strong> MySQL - skillsync_db</p>
        <p><strong>API Base:</strong> {BACKEND}</p>
      </div>
    </div>
  )
}
