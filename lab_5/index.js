const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let movies = [
  { id: 1, title: 'Good Will Hunting', director: 'Gus Van Sant', rating: 9.5, note: 'Мощная драма про потенциал и выбор' },
  { id: 2, title: 'Black Swan', director: 'Darren Aronofsky', rating: 9.0, note: 'Идеальный психологический триллер' }
];

app.get('/api/movies', (req, res) => {
  res.status(200).json(movies);
});

app.post('/api/movies', (req, res) => {
  const { title, director, rating, note } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Название фильма обязательно для заполнения' });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
    return res.status(400).json({ error: 'Оценка должна быть числом от 1 до 10' });
  }

  const newMovie = {
    id: Date.now(),
    title: title.trim(),
    director: director ? director.trim() : 'Не указан',
    rating: numericRating,
    note: note ? note.trim() : ''
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.delete('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = movies.length;
  movies = movies.filter((m) => m.id !== id);

  if (movies.length === initialLength) {
    return res.status(404).json({ error: 'Фильм с таким ID не найден' });
  }

  res.status(200).json({ message: 'Фильм успешно удален' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend-сервер запущен: http://localhost:${PORT}`);
});