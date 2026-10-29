import { useState, useEffect } from 'react';
import './index.css';

// URL API trỏ trực tiếp tới cổng 5000 công khai trên Codespaces
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bug-free-rotary-phone-xr97jwggrq9vh9q6-5000.app.github.dev';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: '',
    cuisine: '',
    ingredients: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  const fetchFoods = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const url = search 
        ? `${API_BASE_URL}/api/foods?search=${encodeURIComponent(search)}` 
        : `${API_BASE_URL}/api/foods`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Không thể tải dữ liệu món ăn');
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: typeof formData.ingredients === 'string' 
        ? formData.ingredients.split(',').map(item => item.trim()).filter(Boolean)
        : formData.ingredients
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE_URL}/api/foods/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/foods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Thao tác thất bại');

      resetForm();
      fetchFoods();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId || '',
      name: food.name || '',
      category: food.category || '',
      cuisine: food.cuisine || '',
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price || '',
      quantity: food.quantity || '',
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/foods/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Xóa món ăn thất bại');
      fetchFoods();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      foodId: '', name: '', category: '', cuisine: '',
      ingredients: '', price: '', quantity: '', description: '', imageUrl: ''
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>HỆ THỐNG QUẢN LÝ MÓN ĂN</h1>
      
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm theo tên món, loại hoặc ẩm thực..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
      </form>

      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="foodId" placeholder="Mã món ăn (foodId)" value={formData.foodId} onChange={handleChange} required disabled={!!editingId} />
          <input name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleChange} required />
          <input name="category" placeholder="Loại món ăn (Khai vị, Món chính...)" value={formData.category} onChange={handleChange} required />
          <input name="cuisine" placeholder="Ẩm thực (Việt Nam, Ý...)" value={formData.cuisine} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Giá bán" value={formData.price} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Số lượng hiện có" value={formData.quantity} onChange={handleChange} required />
          <input name="ingredients" placeholder="Nguyên liệu (phân cách bằng dấu phẩy)" value={formData.ingredients} onChange={handleChange} />
          <input name="imageUrl" placeholder="Link hình ảnh (imageUrl)" value={formData.imageUrl} onChange={handleChange} />
          <textarea name="description" placeholder="Mô tả món ăn" value={formData.description} onChange={handleChange} style={{ gridColumn: 'span 2', height: '60px' }} />
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '10px', background: editingId ? '#2ecc71' : '#e67e22', color: '#fff', border: 'none', cursor: 'pointer', flex: 1 }}>
              {editingId ? 'Lưu Cập Nhật' : 'Thêm Món Ăn'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#95a5a6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#34495e', color: '#fff' }}>
              <th>Mã Món</th>
              <th>Tên Món</th>
              <th>Loại</th>
              <th>Ẩm thực</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.length > 0 ? (
              foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.foodId}</td>
                  <td><strong>{food.name}</strong></td>
                  <td>{food.category}</td>
                  <td>{food.cuisine}</td>
                  <td>{food.price?.toLocaleString()} VNĐ</td>
                  <td>{food.quantity}</td>
                  <td>
                    <button onClick={() => handleEdit(food)} style={{ marginRight: '5px', background: '#f1c40f', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(food._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có món ăn nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;