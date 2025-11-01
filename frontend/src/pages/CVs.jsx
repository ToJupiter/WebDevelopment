import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function CVs() {
  const [cvs, setCVs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/cvs`)
      const data = await res.json()
      setCVs(data.cvs || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>📄 Đây là trang CVs</h1>
      <p>Xây dựng, chỉnh sửa và quản lý nhiều CV chuyên nghiệp của bạn</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">{cvs.length}</div>
          <div className="label">CVs có sẵn</div>
        </div>
        <div className="stat-card">
          <div className="number">3</div>
          <div className="label">Templates</div>
        </div>
      </div>

      <div className="api-section">
        <h3>📋 Danh sách CVs của tôi</h3>
        <button className="api-button" onClick={fetchCVs}>
          🔄 Tải lại CVs
        </button>
        <button className="api-button">
          ➕ Tạo CV mới
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {cvs && cvs.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số CVs: {cvs.length}</strong></p>
            {cvs.map((cv, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: '4px solid #3498db'
              }}>
                <h4>{cv.cv_name}</h4>
                <p><strong>ID:</strong> {cv.cv_id}</p>
                <p><strong>Template:</strong> {cv.template_style}</p>
                {cv.personal_info && (
                  <p><strong>Tên:</strong> {cv.personal_info.name}</p>
                )}
                <p><strong>Tạo lúc:</strong> {new Date(cv.created_at).toLocaleString('vi-VN')}</p>
                <button className="api-button" style={{ marginTop: 10, fontSize: 12 }}>
                  👁️ Xem CV | ✏️ Chỉnh sửa | 📥 Tải PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Chưa có CV nào. Hãy tạo một CV mới!</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#e8f5e9', borderRadius: 8 }}>
        <h3 style={{ color: '#27ae60' }}>✨ CV Builder Features:</h3>
        <ul className="feature-list">
          <li><strong>Multiple Templates:</strong> Lựa chọn từ 3+ mẫu chuyên nghiệp</li>
          <li><strong>AI-Powered Suggestions:</strong> AI gợi ý cách cải thiện CV</li>
          <li><strong>Instant PDF Export:</strong> Xuất CV thành PDF chỉ trong một clic</li>
          <li><strong>ATS-Friendly:</strong> CV của bạn tương thích với hệ thống ATS</li>
          <li><strong>Version Control:</strong> Giữ nhiều phiên bản CV cho các công việc khác nhau</li>
        </ul>
      </div>
    </div>
  )
}
