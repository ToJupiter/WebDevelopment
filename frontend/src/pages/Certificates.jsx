import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/certificates`)
      const data = await res.json()
      setCertificates(data.certificates || [])
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>🏆 Đây là trang Certificates</h1>
      <p>Chứng chỉ hoàn thành các khóa học của bạn - Có giá trị trên toàn thế giới</p>

      <div className="stats">
        <div className="stat-card">
          <div className="number">{certificates.length}</div>
          <div className="label">Chứng chỉ</div>
        </div>
        <div className="stat-card">
          <div className="number">6</div>
          <div className="label">Khóa hoàn thành</div>
        </div>
      </div>

      <div className="api-section">
        <h3>🎖️ Chứng chỉ của tôi</h3>
        <button className="api-button" onClick={fetchCertificates}>
          🔄 Tải lại Certificates
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {certificates && certificates.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số chứng chỉ: {certificates.length}</strong></p>
            {certificates.map((cert, idx) => (
              <div key={idx} style={{ 
                background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                color: 'white',
                padding: 20, 
                marginTop: 10, 
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', right: 20, top: 20, fontSize: 40 }}>🏅</div>
                <h4 style={{ marginBottom: 10 }}>{cert.certificate_name}</h4>
                <p><strong>ID:</strong> {cert.certificate_id}</p>
                <p><strong>Cấp phát:</strong> {new Date(cert.issue_date).toLocaleDateString('vi-VN')}</p>
                {cert.pdf_url && (
                  <button className="api-button" style={{ marginTop: 10, fontSize: 12, background: 'rgba(255,255,255,0.3)' }}>
                    📥 Tải PDF chứng chỉ
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Chưa có chứng chỉ nào. Hoàn thành một roadmap để nhận chứng chỉ!</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 8 }}>
        <h3 style={{ color: '#856404' }}>💼 Lợi ích của Chứng chỉ:</h3>
        <ul className="feature-list">
          <li><strong>Nâng cao hồ sơ:</strong> Tăng giá trị hồ sơ cho nhà tuyển dụng</li>
          <li><strong>Xác thực kỹ năng:</strong> Chứng minh bạn đã thành thạo các kỹ năng</li>
          <li><strong>Chia sẻ trên mạng:</strong> Chia sẻ trực tiếp trên LinkedIn, Twitter</li>
          <li><strong>Lịch sử học tập:</strong> Giữ bản ghi lại tất cả các chứng chỉ</li>
        </ul>
      </div>
    </div>
  )
}
