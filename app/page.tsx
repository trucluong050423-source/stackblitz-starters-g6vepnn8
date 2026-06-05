'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [tab, setTab] = useState('learn');
  const [data, setData] = useState([]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [index, setIndex] = useState(0);

  /* LOAD DATA */
  useEffect(() => {
    const saved = localStorage.getItem('korean');
    if (saved) setData(JSON.parse(saved));
  }, []);

  /* SAVE DATA */
  useEffect(() => {
    localStorage.setItem('korean', JSON.stringify(data));
  }, [data]);

  /* ADD WORD */
  const addWord = () => {
    if (!word || !meaning) return;

    setData([...data, { word, meaning }]);

    setWord('');
    setMeaning('');
  };

  /* RANDOM */
  const current = data[index];

  const next = () => {
    setIndex((index + 1) % data.length);
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: 'auto',
        padding: 20,
        fontFamily: 'Arial',
      }}
    >
      {/* HEADER */}
      <h2
        style={{
          textAlign: 'center',
          color: '#58cc02',
        }}
      >
        Ai-noi-tieng-han-khong-kho
      </h2>

      {/* MENU */}
      <div style={{ textAlign: 'center', margin: 10 }}>
        <button onClick={() => setTab('learn')}>Learn</button>
        <button onClick={() => setTab('flash')}>Flashcard</button>
        <button onClick={() => setTab('quiz')}>Quiz</button>
        <button onClick={() => setTab('add')}>Add</button>
      </div>

      {/* LEARN */}
      {tab === 'learn' && current && (
        <div style={{ textAlign: 'center' }}>
          <h3>{current.word}</h3>
          <p>{current.meaning}</p>
          <button onClick={next}>Next</button>
        </div>
      )}

      {/* FLASHCARD */}
      {tab === 'flash' && current && <Flashcard data={current} />}

      {/* QUIZ */}
      {tab === 'quiz' && current && (
        <Quiz data={data} index={index} next={next} />
      )}

      {/* ADD */}
      {tab === 'add' && (
        <div>
          <input
            placeholder="Từ"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />

          <input
            placeholder="Nghĩa"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
          />

          <button onClick={addWord}>➕ Add</button>
        </div>
      )}
    </div>
  );
}

/* FLASHCARD COMPONENT */
function Flashcard({ data }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      onClick={() => setFlip(!flip)}
      style={{
        padding: 40,
        background: '#f1f1f1',
        textAlign: 'center',
        borderRadius: 10,
      }}
    >
      {flip ? data.meaning : data.word}
    </div>
  );
}

/* QUIZ COMPONENT */
function Quiz({ data, index, next }) {
  const current = data[index];

  const options = [
    current.meaning,
    data[Math.floor(Math.random() * data.length)].meaning,
    data[Math.floor(Math.random() * data.length)].meaning,
  ];

  const shuffled = options.sort(() => 0.5 - Math.random());

  return (
    <div>
      <h3>{current.word}</h3>

      {shuffled.map((opt, i) => (
        <button
          key={i}
          onClick={() => {
            alert(opt === current.meaning ? '✅ Đúng' : '❌ Sai');
            next();
          }}
          style={{ display: 'block', margin: 5 }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
