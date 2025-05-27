import React, { useState } from "react";
import StickyNote from "./StickyNote";
import "./Board.css";

export default function Board() {
  const [notes, setNotes] = useState([
    // 예시: {id: 1, text: "메모", x: 100, y: 200, rotate: 3}
  ]);

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      text: "새 노트",
      x: Math.random() * 400,
      y: Math.random() * 300,
      rotate: (Math.random() - 0.5) * 10,
    };
    setNotes([...notes, newNote]);
  };

  const handleDelete = id => setNotes(notes.filter(n => n.id !== id));

  const handleDrag = (id, x, y) => {
    setNotes(notes.map(n => n.id === id ? {...n, x, y} : n));
  };

  return (
    <div className="board">
      {notes.map(note => (
        <StickyNote
          key={note.id}
          note={note}
          onDelete={() => handleDelete(note.id)}
          onDrag={handleDrag}
        />
      ))}
      <button className="add-note-btn" onClick={handleAddNote}>+</button>
    </div>
  );
}
