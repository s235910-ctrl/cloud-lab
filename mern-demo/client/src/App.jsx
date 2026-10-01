import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // 1. Sửa URL lấy danh sách
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi kết nối API:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Sửa URL thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi thêm sinh viên:', err);
    }
  };

  // 3. Sửa URL xóa sinh viên
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Đã cập nhật tiêu đề cho Phiên bản 2.0 */}
      <h2>QUẢN LÝ SINH VIÊN - PHIÊN BẢN 2.0</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Họ Tên" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Email" 
          type="email"
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Thêm Sinh Viên</button>
      </form>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleDelete(s._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào trong danh sách.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;