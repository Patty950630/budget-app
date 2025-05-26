const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ 使用相對路徑指向專案內的 budget.sqlite
const dbPath = path.join(__dirname, 'budget.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ 資料庫連線失敗：', err.message);
  } else {
    console.log('✅ 成功連接 SQLite 資料庫');
  }
});

module.exports = db;
