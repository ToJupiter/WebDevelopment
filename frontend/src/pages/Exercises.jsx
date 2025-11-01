import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/exercises`)
      const data = await res.json()
      setExercises(data.exercises || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#27ae60'
      case 'medium': return '#f39c12'
      case 'hard': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '🟢 Dễ'
      case 'medium': return '🟡 Trung bình'
      case 'hard': return '🔴 Khó'
      default: return 'Không xác định'
    }
  }

  return (
    <div className="page">
      <h1>💻 Đây là trang Exercises</h1>
      <p>Hàng trăm bài tập code thực hành để nâng cao kỹ năng lập trình của bạn</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">{exercises.length}</div>
          <div className="label">Bài tập</div>
        </div>
        <div className="stat-card">
          <div className="number">45</div>
          <div className="label">Đã giải</div>
        </div>
        <div className="stat-card">
          <div className="number">92%</div>
          <div className="label">Tỷ lệ thành công</div>
        </div>
      </div>

      <div className="api-section">
        <h3>🎯 Danh sách bài tập</h3>
        <button className="api-button" onClick={fetchExercises}>
          🔄 Tải lại Exercises
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {exercises && exercises.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số bài tập: {exercises.length}</strong></p>
            <p style={{ color: '#666', marginBottom: 15, fontSize: 14 }}>
              Dễ: {exercises.filter(e => e.difficulty === 'easy').length} | 
              Trung bình: {exercises.filter(e => e.difficulty === 'medium').length} | 
              Khó: {exercises.filter(e => e.difficulty === 'hard').length}
            </p>
            {exercises.slice(0, 12).map((exercise, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: `4px solid ${getDifficultyColor(exercise.difficulty)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4>{exercise.title}</h4>
                    <p><strong>ID:</strong> {exercise.exercise_id}</p>
                    {exercise.description && (
                      <p><strong>Mô tả:</strong> {exercise.description.substring(0, 100)}...</p>
                    )}
                  </div>
                  <span style={{ background: getDifficultyColor(exercise.difficulty), color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12, whiteSpace: 'nowrap' }}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>
                <button className="api-button" style={{ marginTop: 10, fontSize: 12 }}>
                  ▶️ Làm bài tập | 💡 Xem gợi ý | ✔️ Kiểm tra lời giải
                </button>
              </div>
            ))}
            {exercises.length > 12 && (
              <p style={{ marginTop: 15, textAlign: 'center', color: '#667eea', fontWeight: 'bold' }}>
                ... và {exercises.length - 12} bài tập khác
              </p>
            )}
          </div>
        ) : (
          !loading && <p>Không có bài tập nào</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#e3f2fd', borderRadius: 8 }}>
        <h3 style={{ color: '#1565c0' }}>🚀 Coding Features:</h3>
        <ul className="feature-list">
          <li><strong>Online Code Editor:</strong> Viết code trực tiếp trong trình duyệt</li>
          <li><strong>Multiple Languages:</strong> Hỗ trợ Python, JavaScript, Java, C++, Go</li>
          <li><strong>Real-time Feedback:</strong> Nhận phản hồi ngay lập tức</li>
          <li><strong>Hints & Solutions:</strong> Gợi ý và lời giải mẫu có sẵn</li>
          <li><strong>Discussion Forum:</strong> Thảo luận với các học viên khác</li>
          <li><strong>Leaderboard:</strong> Cạnh tranh với các lập trình viên khác</li>
        </ul>
      </div>
    </div>
  )
}
