import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://mern-backend-235910.onrender.com';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi kết nối API:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        setEditingId(null);
      } else {
        await fetch(`${API_BASE_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi lưu sinh viên:', err);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ studentId: '', name: '', email: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      try {
        await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (err) {
        console.error('Lỗi xóa sinh viên:', err);
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '40px 20px', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        background: '#ffffff', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
          color: '#ffffff', 
          padding: '24px 30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', letterSpacing: '0.5px' }}>
            QUẢN LÝ SINH VIÊN - PHIÊN BẢN 2.0
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            Hệ thống MERN Stack chuẩn hiện đại, mượt mà và trực quan
          </p>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Form Nhập liệu */}
          <form onSubmit={handleSubmit} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '30px',
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            alignItems: 'center'
          }}>
            <input 
              placeholder="Mã số sinh viên (MSSV)" 
              value={form.studentId} 
              onChange={e => setForm({...form, studentId: e.target.value})} 
              required 
              style={{ 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
            <input 
              placeholder="Họ và Tên" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
              style={{ 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
            <input 
              placeholder="Địa chỉ Email" 
              type="email"
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
              style={{ 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '5px' }}>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  style={{ 
                    padding: '12px 20px', 
                    cursor: 'pointer', 
                    backgroundColor: '#64748b', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Hủy
                </button>
              )}
              <button 
                type="submit" 
                style={{ 
                  padding: '12px 24px', 
                  cursor: 'pointer', 
                  backgroundColor: editingId ? '#f59e0b' : '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
              >
                {editingId ? 'Cập nhật thông tin' : '+ Thêm Sinh Viên'}
              </button>
            </div>
          </form>

          {/* Bảng Dữ liệu */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0', color: '#334155' }}>
                  <th style={{ padding: '15px 20px', fontWeight: '600', fontSize: '14px' }}>MSSV</th>
                  <th style={{ padding: '15px 20px', fontWeight: '600', fontSize: '14px' }}>Họ và Tên</th>
                  <th style={{ padding: '15px 20px', fontWeight: '600', fontSize: '14px' }}>Email</th>
                  <th style={{ padding: '15px 20px', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr key={s._id} style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}>
                    <td style={{ padding: '14px 20px', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>{s.studentId}</td>
                    <td style={{ padding: '14px 20px', color: '#1e293b', fontSize: '14px' }}>{s.name}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '14px' }}>{s.email}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleEdit(s)} 
                        style={{ 
                          color: '#2563eb', 
                          cursor: 'pointer', 
                          background: '#eff6ff', 
                          border: '1px solid #dbeafe', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontWeight: '600', 
                          fontSize: '13px',
                          marginRight: '8px'
                        }}
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(s._id)} 
                        style={{ 
                          color: '#dc2626', 
                          cursor: 'pointer', 
                          background: '#fef2f2', 
                          border: '1px solid #fee2e2', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontWeight: '600', 
                          fontSize: '13px'
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>
                      Chưa có sinh viên nào trong danh sách. Hãy thêm mới sinh viên ở khung phía trên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;