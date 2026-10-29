const express = require('express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL
    ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
    : true
}));

// Kết nối MongoDB Atlas
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Thiếu biến môi trường MONGO_URI');
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas đã kết nối'))
    .catch(err => console.error('Lỗi MongoDB:', err.message));
}

// Kiểm tra trạng thái backend
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// GET /api/foods - Danh sách và tìm kiếm món ăn
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const keyword = search.trim();
      const regex = new RegExp(
        keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      filter.$or = [
        { foodId: regex },
        { name: regex },
        { category: regex },
        { cuisine: regex }
      ];
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách món ăn' });
  }
});

// GET /api/foods/:id - Chi tiết món ăn
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = mongoose.isValidObjectId(req.params.id)
      ? await Food.findById(req.params.id)
      : await Food.findOne({ foodId: req.params.id });

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/foods - Thêm món ăn
app.post('/api/foods', async (req, res) => {
  try {
    const {
      foodId, name, category, cuisine,
      ingredients, price, quantity, description, imageUrl
    } = req.body;

    if (
      !foodId || !name || !category || !cuisine ||
      price === undefined || quantity === undefined
    ) {
      return res.status(400).json({
        message: 'Vui lòng nhập mã, tên, loại, vùng miền, giá và số lượng'
      });
    }

    const existing = await Food.findOne({ foodId: foodId.trim() });

    if (existing) {
      return res.status(409).json({ message: 'Mã món ăn đã tồn tại' });
    }

    const food = await Food.create({
      foodId, name, category, cuisine,
      ingredients, price, quantity, description, imageUrl
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/foods/:id - Cập nhật món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const current = mongoose.isValidObjectId(req.params.id)
      ? await Food.findById(req.params.id)
      : await Food.findOne({ foodId: req.params.id });

    if (!current) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;

    if (updates.foodId) {
      updates.foodId = updates.foodId.trim();

      const duplicate = await Food.findOne({
        foodId: updates.foodId,
        _id: { $ne: current._id }
      });

      if (duplicate) {
        return res.status(409).json({ message: 'Mã món ăn đã tồn tại' });
      }
    }

    const updated = await Food.findByIdAndUpdate(
      current._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/foods/:id - Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const food = mongoose.isValidObjectId(req.params.id)
      ? await Food.findByIdAndDelete(req.params.id)
      : await Food.findOneAndDelete({ foodId: req.params.id });

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.json({ message: 'Xóa món ăn thành công', food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend đang chạy tại cổng ${PORT}`);
});const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL
    ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
    : true
}));

// Kết nối MongoDB Atlas
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Thiếu biến môi trường MONGO_URI');
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas đã kết nối'))
    .catch(err => console.error('Lỗi MongoDB:', err.message));
}

// Kiểm tra trạng thái backend
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// GET /api/foods - Danh sách và tìm kiếm món ăn
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const keyword = search.trim();
      const regex = new RegExp(
        keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      filter.$or = [
        { foodId: regex },
        { name: regex },
        { category: regex },
        { cuisine: regex }
      ];
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách món ăn' });
  }
});

// GET /api/foods/:id - Chi tiết món ăn
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = mongoose.isValidObjectId(req.params.id)
      ? await Food.findById(req.params.id)
      : await Food.findOne({ foodId: req.params.id });

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/foods - Thêm món ăn
app.post('/api/foods', async (req, res) => {
  try {
    const {
      foodId, name, category, cuisine,
      ingredients, price, quantity, description, imageUrl
    } = req.body;

    if (
      !foodId || !name || !category || !cuisine ||
      price === undefined || quantity === undefined
    ) {
      return res.status(400).json({
        message: 'Vui lòng nhập mã, tên, loại, vùng miền, giá và số lượng'
      });
    }

    const existing = await Food.findOne({ foodId: foodId.trim() });

    if (existing) {
      return res.status(409).json({ message: 'Mã món ăn đã tồn tại' });
    }

    const food = await Food.create({
      foodId, name, category, cuisine,
      ingredients, price, quantity, description, imageUrl
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/foods/:id - Cập nhật món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const current = mongoose.isValidObjectId(req.params.id)
      ? await Food.findById(req.params.id)
      : await Food.findOne({ foodId: req.params.id });

    if (!current) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.__v;

    if (updates.foodId) {
      updates.foodId = updates.foodId.trim();

      const duplicate = await Food.findOne({
        foodId: updates.foodId,
        _id: { $ne: current._id }
      });

      if (duplicate) {
        return res.status(409).json({ message: 'Mã món ăn đã tồn tại' });
      }
    }

    const updated = await Food.findByIdAndUpdate(
      current._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/foods/:id - Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const food = mongoose.isValidObjectId(req.params.id)
      ? await Food.findByIdAndDelete(req.params.id)
      : await Food.findOneAndDelete({ foodId: req.params.id });

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.json({ message: 'Xóa món ăn thành công', food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend đang chạy tại cổng ${PORT}`);
});require('dotenv').config();

const app = express();
app.use(express.json());

// Cấu hình CORS bảo mật và đồng bộ với biến CLIENT_URL trên Render
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Kết nối MongoDB Atlas
const mongoURI = process.env.MONGO_URI 
  || process.env.MONGODB_URI 
  || "mongodb+srv://clouduser:nhan123@cluster0.b5jpsry.mongodb.net/cloud_lab?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Tạo Schema và Model Student
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// API Hello
app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend đang hoạt động!" });
});

// Health Check Endpoint cho Cloud PaaS Monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/students/:id - Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
