

const express = require('express');
const cors = require('cors'); // ← 추가
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors()); // ← 꼭 추가해야 클라이언트에서 접근 가능

app.use(express.json());
app.use(express.static('public'));

// POST 평가 저장
app.post('/api/evaluation', (req, res) => {
  const newEval = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let evaluations = [];
    if (!err && data) {
      evaluations = JSON.parse(data);
    }

    evaluations.push(newEval);

    fs.writeFile(DATA_FILE, JSON.stringify(evaluations, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: '서버 저장 오류' });
      }
      res.status(200).json({ message: '저장 완료' });
    });
  });
});

// GET 저장된 평가 반환 (선택 사항)
app.get('/api/evaluations', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '불러오기 실패' });
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
