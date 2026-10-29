const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();

// Cấu hình CORS mở rộng cho môi trường Codespaces & Render
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Kết nối MongoDB Atlas
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas đã kết nối'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Route gốc
app.get('/', (req, res) => {
    res.send('Backend Quan Ly Mon An dang chay!');
});

// Endpoint kiểm tra trạng thái Backend
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// 1. Lấy danh sách món ăn & Tìm kiếm
app.get('/api/foods', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { cuisine: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const foods = await Food.find(query);
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Xem thông tin một món ăn theo ID
app.get('/api/foods/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Thêm món ăn mới (Kiểm tra trùng foodId)
app.post('/api/foods', async (req, res) => {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;
    
    if (!foodId || !name || !price || !quantity) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    try {
        const existingFood = await Food.findOne({ foodId });
        if (existingFood) {
            return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại' });
        }

        const newFood = new Food({
            foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl
        });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        res.json({ message: 'Xóa món ăn thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend đang chạy tại cổng ${PORT}`);
});