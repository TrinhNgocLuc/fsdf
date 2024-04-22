const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Kết nối với cơ sở dữ liệu
const connection = mysql.createConnection({
    host: 'localhost', // Thay đổi hostname nếu MySQL của bạn chạy trên máy khác
    user: 'root', // Tên đăng nhập MySQL
    password: null, // Mật khẩu MySQL
    database: 'iot' // Tên database MySQL
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

// Các endpoint cho bảng cảm biến
app.get('/sensors', (req, res) => {
  const { sort, search, filter } = req.query;
  let query = 'SELECT * FROM cambien';

  if (sort) {
    const [column, order] = sort.split(',');
    query += ` ORDER BY ${column} ${order.toUpperCase()}`;
  }

  if (filter) {
    const filterObj = JSON.parse(filter);
    let whereConditions = [];

    if (filterObj.Nhiet_do !== undefined) {
      whereConditions.push(`Nhiet_do = ${filterObj.Nhiet_do}`);
    }

    if (filterObj.Do_am !== undefined) {
      whereConditions.push(`Do_am LIKE '%${filterObj.Do_am}%'`);
    }

    if (filterObj.Anh_sang !== undefined) {
      whereConditions.push(`Anh_sang LIKE '%${filterObj.Anh_sang}%'`);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
  } else if (search) {
    query += ` WHERE Nhiet_do LIKE '%${search}%' OR Do_am LIKE '%${search}%' OR Anh_sang LIKE '%${search}%'`;
  }

  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

app.post('/sensors', (req, res) => {
  const { Nhiệt_độ, Độ_ẩm, Ánh_sáng } = req.body;
  const query = 'INSERT INTO cambien (Nhiet_do, Do_am, Anh_sang) VALUES (?, ?, ?)';
  connection.query(query, [Nhiệt_độ, Độ_ẩm, Ánh_sáng], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Các endpoint cho bảng thiết bị
app.get('/devices', (req, res) => {
  const query = 'SELECT * FROM quatvaden';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

app.put('/devices/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE quatvaden SET status = ? WHERE id = ?';
  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json({ message: 'Device status updated' });
  });
});
app.get('/devices', (req, res) => {
    const { sort, search, filter } = req.query;
    let query = 'SELECT * FROM quatvaden';
  
    if (sort) {
      const [column, order] = sort.split(',');
      query += ` ORDER BY ${column} ${order.toUpperCase()}`;
    }
  
    if (filter) {
      const filterObj = JSON.parse(filter);
      let whereConditions = [];
  
      if (filterObj.status !== undefined) {
        whereConditions.push(`status = '${filterObj.status}'`);
      }
  
      if (filterObj.deviceID !== undefined) {
        whereConditions.push(`deviceID LIKE '%${filterObj.deviceID}%'`);
      }
  
      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }
    } else if (search) {
      query += ` WHERE deviceID LIKE '%${search}%'`;
    }
  
    connection.query(query, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(rows);
    });
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});