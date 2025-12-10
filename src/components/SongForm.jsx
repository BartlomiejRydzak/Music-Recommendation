import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const GRAPHQL_URL = "http://localhost:3000/graphql";

function SongForm() {
  const [createTitle, setCreateTitle] = useState("");
  const [createDuration, setCreateDuration] = useState("");
  const [createYear, setCreateYear] = useState("");
  const [createArtist, setCreateArtist] = useState("");
  const [createGenre, setCreateGenre] = useState("");

  const [updateTitle, setUpdateTitle] = useState("");
  const [updateNewTitle, setUpdateNewTitle] = useState("");
  const [updateDuration, setUpdateDuration] = useState("");
  const [updateYear, setUpdateYear] = useState("");
  const [updateGenre, setUpdateGenre] = useState("");

  const [deleteTitle, setDeleteTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateSong = async () => {
    if (!createTitle || !createArtist || !createGenre) {
      setMessage("Title, Artist, and Genre are required!");
      return;
    }
    const mutation = `
      mutation {
        createSong(
          title: "${createTitle}",
          duration: ${createDuration || "null"},
          year: ${createYear || "null"},
          artistName: "${createArtist}",
          genre: "${createGenre}"
        ) {
          title
        }
      }
    `;
    try {
      const res = await axios.post(GRAPHQL_URL, { query: mutation });
      const song = res.data.data.createSong;
      setMessage(song ? `Song "${song.title}" created successfully!` : "Failed to create song.");
      setCreateTitle(""); setCreateDuration(""); setCreateYear(""); setCreateArtist(""); setCreateGenre("");
    } catch (err) {
      console.error(err);
      setMessage("Error creating song. Make sure artist exists.");
    }
  };

  const handleUpdateSong = async () => {
    if (!updateTitle) {
      setMessage("Original title is required to update a song!");
      return;
    }
    const newTitlePart = updateNewTitle ? `newTitle: "${updateNewTitle}",` : `newTitle: "${updateTitle}",`;
    const mutation = `
      mutation {
        updateSong(
          title: "${updateTitle}",
          ${newTitlePart}
          duration: ${updateDuration || "null"},
          year: ${updateYear || "null"},
          genre: "${updateGenre || ""}"
        ) {
          title
        }
      }
    `;
    try {
      const res = await axios.post(GRAPHQL_URL, { query: mutation });
      const song = res.data.data.updateSong;
      setMessage(song ? `Song "${song.title}" updated successfully!` : "Song not found or update failed.");
      setUpdateTitle(""); setUpdateNewTitle(""); setUpdateDuration(""); setUpdateYear(""); setUpdateGenre("");
    } catch (err) {
      console.error(err);
      setMessage("Error updating song.");
    }
  };

  const handleDeleteSong = async () => {
    if (!deleteTitle) {
      setMessage("Title is required to delete a song!");
      return;
    }
    const mutation = `mutation { deleteSong(title: "${deleteTitle}") }`;
    try {
      const res = await axios.post(GRAPHQL_URL, { query: mutation });
      setMessage(res.data.data.deleteSong || "Delete failed.");
      setDeleteTitle("");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting song.");
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Song Management</h2>

      <h3 className="sub-title">Create Song</h3>
      <div className="form-grid">
        <input placeholder="Title" value={createTitle} onChange={e => setCreateTitle(e.target.value)} className="input-field" />
        <input type="number" placeholder="Duration (sec)" value={createDuration} onChange={e => setCreateDuration(e.target.value)} className="input-field" />
        <input type="number" placeholder="Year" value={createYear} onChange={e => setCreateYear(e.target.value)} className="input-field" />
        <input placeholder="Artist" value={createArtist} onChange={e => setCreateArtist(e.target.value)} className="input-field" />
        <input placeholder="Genre" value={createGenre} onChange={e => setCreateGenre(e.target.value)} className="input-field" />
      </div>
      <button className="button button-create" onClick={handleCreateSong}><Plus /> Create</button>

      <h3 className="sub-title">Update Song</h3>
      <div className="form-grid">
        <input placeholder="Original Title" value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} className="input-field" />
        <input placeholder="New Title (optional)" value={updateNewTitle} onChange={e => setUpdateNewTitle(e.target.value)} className="input-field" />
        <input type="number" placeholder="Duration (optional)" value={updateDuration} onChange={e => setUpdateDuration(e.target.value)} className="input-field" />
        <input type="number" placeholder="Year (optional)" value={updateYear} onChange={e => setUpdateYear(e.target.value)} className="input-field" />
        <input placeholder="Genre (optional)" value={updateGenre} onChange={e => setUpdateGenre(e.target.value)} className="input-field" />
      </div>
      <button className="button button-update" onClick={handleUpdateSong}><Edit /> Update</button>

      <h3 className="sub-title">Delete Song</h3>
      <div className="form-grid">
        <input placeholder="Title to Delete" value={deleteTitle} onChange={e => setDeleteTitle(e.target.value)} className="input-field" />
      </div>
      <button className="button button-delete" onClick={handleDeleteSong}><Trash2 /> Delete</button>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default SongForm;
