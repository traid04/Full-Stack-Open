import { useState, useEffect } from 'react';
import type { Diary } from './types';
import { getAll, addDiary } from './services/diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  useEffect(() => {
    getAll().then(data => {
      setDiaries(data);
    });
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await addDiary({ date, visibility, weather, comment });
      setDiaries(diaries.concat(response));
      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
    }
    catch(error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data)
          setTimeout(() => {
            setError('')
          }, 4000)
        }
      }
      else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error === '' ? <></> : <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          visibility
          great <input type="radio" name="visibility" onChange={() => setVisibility('great')} />
          good <input type="radio" name="visibility" onChange={() => setVisibility("good")}/>
          ok <input type="radio" name="visibility" onChange={() => setVisibility("ok")}/>
          poor <input type="radio" name="visibility" onChange={() => setVisibility("poor")}/>
        </div>
        <div>
          weather
          sunny <input type="radio" name="weather" onChange={() => setWeather('sunny')} />
          rainy <input type="radio" name="weather" onChange={() => setWeather('rainy')} />
          cloudy <input type="radio" name="weather" onChange={() => setWeather('cloudy')} />
          stormy <input type="radio" name="weather" onChange={() => setWeather('stormy')} />
          windy <input type="radio" name="weather" onChange={() => setWeather('windy')} />
        </div>
        <div>
          comment <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      {diaries.map(diary => {
        return (
          <div key={diary.id}>
            <h3>{diary.date}</h3>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </div>
        )
      })}
    </div>
  )
};

export default App;
