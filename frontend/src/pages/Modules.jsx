import React, { useState, useEffect } from 'react'

const BACKEND = 'http://localhost:4000'

export default function Modules() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Note: Get modules từ roadmaps (không có endpoint modules riêng)
    fetchModulesFromRoadmaps()
  }, [])

  const fetchModulesFromRoadmaps = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/roadmaps`)
      const data = await res.json()
      const allModules = []
      data.roadmaps?.forEach(roadmap => {
        roadmap.Modules?.forEach(module => {
          allModules.push({ ...module, roadmapTitle: roadmap.title })
        })
      })
      setModules(allModules)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>📚 Đây là trang Modules</h1>
      <p>Các module học tập chi tiết được tổ chức theo roadmap</p>

      <div className="api-section">
        <h3>🎓 Danh sách Modules</h3>
        <button className="api-button" onClick={fetchModulesFromRoadmaps}>
          🔄 Tải lại Modules
        </button>

        {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
        {error && <p className="error">❌ Lỗi: {error}</p>}

        {modules && modules.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <p><strong>Tổng số Modules: {modules.length}</strong></p>
            {modules.map((module, idx) => (
              <div key={idx} style={{ 
                background: '#f9f9f9', 
                padding: 15, 
                marginTop: 10, 
                borderRadius: 4,
                borderLeft: '4px solid #27ae60'
              }}>
                <h4>{module.title} (#{module.order_index})</h4>
                <p><strong>ID:</strong> {module.module_id}</p>
                <p><strong>Roadmap:</strong> {module.roadmapTitle}</p>
                {module.description && <p><strong>Mô tả:</strong> {module.description}</p>}
                <p><strong>Thời gian dự kiến:</strong> {module.estimated_hours} giờ</p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Không có module nào</p>
        )}
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#e3f2fd', borderRadius: 8 }}>
        <h3 style={{ color: '#1565c0' }}>💡 Module là gì?</h3>
        <p>Mỗi module là một phần của roadmap, chứa các bài học, bài tập và nội dung học tập tập trung vào một chủ đề cụ thể. Hoàn thành các module theo thứ tự sẽ giúp bạn nắm vững các kỹ năng được dạy.</p>
      </div>
    </div>
  )
}
