import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // Lấy danh sách sinh viên từ Backend API (Câu 47)
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi kết nối API:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Gửi thông tin thêm sinh viên mới (Câu 48 & 49)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/students', {
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

  // Xóa sinh viên
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>QUẢN LÝ SINH VIÊN</h2>
      
      {/* Form nhập liệu (Câu 48) */}
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

      {/* Hiển thị danh sách (Câu 47) */}
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