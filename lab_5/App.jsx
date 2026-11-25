import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/movies';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [rating, setRating] = useState('8');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Не удалось загрузить данные с сервера');
      const data = await res.json();
      setMovies(data);
      setError('');
    } catch (err) {
      setError('Ошибка соединения с сервером: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, director, rating, note })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка при добавлении');
        return;
      }

      setMovies((prev) => [...prev, data]);
      setTitle('');
      setDirector('');
      setRating('8');
      setNote('');
    } catch (err) {
      setError('Сервер недоступен');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления');
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #212529', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🎬 Fullstack Кінощоденник (React + Node.js)</h1>
        <span style={{ background: '#212529', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px' }}>
          У базі: {movies.length} / 100
        </span>
      </header>

      {/**/}
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #ef9a9a' }}>
          ⚠️ {error}
        </div>
      )}

      {/**/}
      <form onSubmit={handleAddMovie} style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #dee2e6' }}>
        <h3 style={{ margin: 0 }}>Додати новий перегляд</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Назва фільму *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ flex: 2, minWidth: '180px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Режисер"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            style={{ flex: 1, minWidth: '140px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Оцінка (1-10)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="10"
            step="0.5"
            required
            style={{ width: '90px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <input
          type="text"
          placeholder="Коротка рецензія або враження..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ alignSelf: 'flex-start', padding: '10px 20px', background: '#198754', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Зберегти на сервері
        </button>
      </form>

      {/* Список фильмов из API */}
      {loading ? (
        <p>Завантаження даних із сервера Node.js...</p>
      ) : movies.length === 0 ? (
        <p style={{ color: '#666' }}>Записів поки немає. Додайте перший фільм вище.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {movies.map((m) => (
            <div key={m.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '18px' }}>
                  {m.title} <span style={{ color: '#f57c00', fontSize: '15px' }}>★ {m.rating}/10</span>
                </h4>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>Режисер: {m.director}</p>
                {m.note && <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>«{m.note}»</p>}
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}