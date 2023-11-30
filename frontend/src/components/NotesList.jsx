import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { updateNote } from "../../../backend/src/controllers/notes.controller";

export function NotesList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      const res = await axios.get("http://localhost:5001/api/notes/");
      console.log(res);
      setNotes(res.data);
    };
    getNotes();
  }, []);

  async function deleteNote(noteId) {
    const res = await axios.delete("http://localhost:5001/api/notes/" + noteId);
    if (res.status === 204)
      setNotes([...notes.filter((note) => note._id !== noteId)]);
  }

  return (
    <div className="row">
      {notes.map((note) => (
        <div className="col-md-4 p-2" key={note._id}>
          <div className="card rounded-0">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>{note.title}</h5>
              <Link to={"/edit/" + note._id} className="btn btn-sm">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => deleteNote(note._id)}
                >
                  Editar
                </button>
              </Link>
            </div>
            <div className="card-body">
              <p>{note.content}</p>
              <p>Autor: {note.author}</p>
              <p>Date: {note.date}</p>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-danger"
                onClick={() => deleteNote(note._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
