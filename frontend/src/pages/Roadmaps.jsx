import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/roadmaps`)
      const data = await res.json()
      setRoadmaps(data.roadmaps || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>🗺️ Đây là trang Roadmaps</h1>
      <p>Khám phá các lộ trình học tập toàn diện được thiết kế bởi các chuyên gia</p>

      <div className="api-section">
        <h3>📚 Danh sách Roadmaps</h3>
        <button className="api-button" onClick={fetchRoadmaps}>
          🔄 Tải lại Roadmaps
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {roadmaps && roadmaps.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số Roadmaps: {roadmaps.length}</strong></p>
            {roadmaps.map((roadmap, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: '4px solid #667eea'
              }}>
                <h4>{roadmap.title}</h4>
                <p><strong>ID:</strong> {roadmap.roadmap_id}</p>
                <p><strong>Danh mục:</strong> {roadmap.category}</p>
                <p><strong>Trạng thái:</strong> {roadmap.status}</p>
                {roadmap.description && <p><strong>Mô tả:</strong> {roadmap.description}</p>}
                <p><strong>Modules:</strong> {roadmap.Modules?.length || 0} mô-đun</p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Không có roadmap nào</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 8 }}>
        <h3 style={{ color: '#856404' }}>💡 Lợi ích của Roadmaps:</h3>
        <ul className="feature-list">
          <li><strong>Cấu trúc rõ ràng:</strong> Biết chính xác cần học cái gì và theo thứ tự nào</li>
          <li><strong>Động lực liên tục:</strong> Theo dõi tiến độ qua các mô-đun tuần tự</li>
          <li><strong>Hỗ trợ AI:</strong> Các gợi ý cá nhân hóa dựa trên tốc độ học của bạn</li>
          <li><strong>Chứng chỉ hoàn thành:</strong> Nhận chứng chỉ khi hoàn thành roadmap</li>
        </ul>
      </div>
    </div>
  )
}
