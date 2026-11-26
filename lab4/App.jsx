import { useState, useEffect } from 'react';

function MovieCard({ movie, isWatched, onToggleWatch }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      width: '210px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: isWatched ? '#e8f5e9' : '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
    }}>
      <div>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}
          alt={movie.Title}
          style={{ width: '100%', height: '290px', objectFit: 'cover', borderRadius: '4px' }}
        />
        <h4 style={{ margin: '10px 0 4px', fontSize: '16px' }}>{movie.Title}</h4>
        <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px' }}>Рік: {movie.Year}</p>
      </div>

      {/* Взаємодія користувача з інтерфейсом */}
      <button
        onClick={() => onToggleWatch(movie.imdbID)}
        style={{
          padding: '8px',
          backgroundColor: isWatched ? '#2e7d32' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isWatched ? '✔ Переглянуто' : '+ У щоденник'}
      </button>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('Fight Club');
  const [movies, setMovies] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = '80f5a9d3';

  const fetchMovies = async (searchTitle) => {
    if (!searchTitle.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${searchTitle}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Помилка запиту до API:', error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchMovies(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(query);
  };

  const toggleWatched = (id) => {
    setWatchedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>🎬 Кінощоденник (React)</h1>
        <div style={{ background: '#212529', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
          Переглянуто: {watchedIds.length} / 100
        </div>
      </header>

      {/* Форма пошуку */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть назву фільму..."
          style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 24px', fontSize: '16px', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Пошук
        </button>
      </form>

      {/* Відображення результатів */}
      {loading ? (
        <p>Завантаження фільмів...</p>
      ) : movies.length === 0 ? (
        <p>Нічого не знайдено. Спробуйте іншу назву.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isWatched={watchedIds.includes(movie.imdbID)}
              onToggleWatch={toggleWatched}
            />
          ))}
        </div>
      )}
    </div>
  );
}
