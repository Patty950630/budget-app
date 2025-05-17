const path = require('path');
const express = require('express');
const db = require('./db'); // 引入 db.js
const app = express();
const port = 3000;

app.use(express.json());

// ✅ 讓前端畫面可以正確顯示
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 取得所有記帳資料
app.get('/records', (req, res) => {
  const sql = 'SELECT * FROM records';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ 查詢失敗：', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ✅ 新增一筆記帳資料
app.post('/records', (req, res) => {
  const { item, amount, date, type, category } = req.body;

  if (!item || !amount || !date || !type || !category) {
    return res.status(400).json({ error: '欄位缺失' });
  }

  const sql = 'INSERT INTO records (item, amount, date, type, category) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [item, amount, date, type, category], function (err) {
    if (err) {
      console.error('❌ 新增失敗：', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      item,
      amount,
      date,
      type,
      category
    });
  });
});


// ✅ 刪除一筆記帳資料
app.delete('/records/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM records WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('❌ 刪除失敗：', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: '找不到這筆資料' });
    }
    res.json({ message: `已刪除 id 為 ${id} 的資料` });
  });
});

// ✅ 啟動伺服器
app.listen(port, () => {
  console.log(`✅ 伺服器啟動：http://localhost:${port}`);
});
