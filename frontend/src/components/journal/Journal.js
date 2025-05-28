// import React, { useState, useEffect, useCallback } from 'react';
// import './Journal.css';

// const emojiList = ['😊', '😐', '😢', '😡', '😴'];

// const Journal = ({ token }) => {
//   const [text, setText] = useState('');
//   const [mood, setMood] = useState('');
//   const [entries, setEntries] = useState([]);

//   const fetchEntries = useCallback(async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/journal', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setEntries(data);
//     } catch (error) {
//       console.error('Failed to fetch entries:', error);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchEntries();
//   }, [fetchEntries]);

//   const submitEntry = async (e) => {
//     e.preventDefault();

//     const res = await fetch('http://localhost:5000/api/journal', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ text, mood }),
//     });

//     const data = await res.json();

//     if (!data.error) {
//       setText('');
//       setMood('');
//       fetchEntries(); // refresh entries
//     } else {
//       alert(data.error || 'Failed to save entry.');
//     }
//   };

//   return (
//     <div className="journal-container">
//       <h2>Today's Journal</h2>
//       <form onSubmit={submitEntry}>
//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Write about your day..."
//           required
//         ></textarea>

//         <div className="emoji-picker">
//           {emojiList.map((emo) => (
//             <span
//               key={emo}
//               className={mood === emo ? 'selected' : ''}
//               onClick={() => setMood(emo)}
//             >
//               {emo}
//             </span>
//           ))}
//         </div>

//         <button type="submit">Save Entry</button>
//       </form>

//       <div className="journal-entries">
//         <h3>Your Entries</h3>
//         {entries.length === 0 ? (
//           <p>No entries yet.</p>
//         ) : (
//           entries
//             .sort((a, b) => new Date(b.date) - new Date(a.date))
//             .map((entry) => (
//               <div key={entry._id} className="entry-card">
//                 <div className="date">{new Date(entry.date).toLocaleString()}</div>
//                 <div className="mood">Mood: {entry.mood}</div>
//                 <p>{entry.text}</p>
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Journal;


import React, { useState, useEffect } from 'react';
import './Journal.css';

const emojiList = ['😊', '😐', '😢', '😡', '😴'];

const Journal = ({ token }) => {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Sort entries by newest first
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const submitEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, mood }),
      });
      const data = await res.json();
      if (!data.error) {
        setText('');
        setMood('');
        fetchEntries();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (error) {
      alert('Failed to save entry');
      console.error('Submit error:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="journal-container">
      <h2>Today's Journal</h2>
      <form onSubmit={submitEntry}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How was your day?"
          required
        ></textarea>
        <div className="emoji-picker">
          {emojiList.map((emo) => (
            <span
              key={emo}
              className={mood === emo ? 'selected' : ''}
              onClick={() => setMood(emo)}
              role="button"
              aria-label={`Select mood ${emo}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setMood(emo);
              }}
            >
              {emo}
            </span>
          ))}
        </div>
        <button type="submit" disabled={!mood}>
          Save Entry
        </button>
      </form>

      <div className="journal-entries">
        <h3>Your Entries</h3>
        {entries.length === 0 ? (
          <p>No journal entries yet. Write one above!</p>
        ) : (
          entries.map((e) => (
            <div key={e._id} className="entry-card">
              <div className="date">{new Date(e.date).toLocaleString()}</div>
              <div className="mood">Mood: {e.mood}</div>
              <p>{e.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
