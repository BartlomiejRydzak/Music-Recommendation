import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const GRAPHQL_URL = "http://localhost:3000/graphql";

function ArtistForm() {
  const [name, setName] = useState("");
  const [popularity, setPopularity] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    if (!name || !popularity || !country || !genre) {
      setMessage("All fields are required!");
      return;
    }
    const mutation = `
      mutation CreateArtist($name: String!, $popularity: Int!, $country: String!, $genre: String!) {
        createArtistWithGenre(name: $name, popularity: $popularity, country: $country, genre: $genre) {
          name
        }
      }
    `;
    try {
      const res = await axios.post(GRAPHQL_URL, { query: mutation, variables: { name, popularity: parseInt(popularity), country, genre } });
      const artist = res.data.data.createArtistWithGenre;
      setMessage(`Artist ${artist.name} created successfully!`);
      setName(""); setPopularity(""); setCountry(""); setGenre("");
    } catch (err) {
      setMessage("Error creating artist.");
    }
  };

  const handleUpdate = async () => {
    if (!name) { setMessage("Name is required to update an artist!"); return; }
    const mutation = `
      mutation UpdateArtist($name: String!, $popularity: Int, $country: String, $genre: String) {
        updateArtist(name: $name, popularity: $popularity, country: $country, genre: $genre) {
          name
        }
      }
    `;
    try {
      const res = await axios.post(GRAPHQL_URL, {
        query: mutation,
        variables: { name, popularity: popularity ? parseInt(popularity) : null, country: country || null, genre: genre || null }
      });
      setMessage(`Artist ${res.data.data.updateArtist.name} updated successfully!`);
    } catch (err) { setMessage("Error updating artist."); }
  };

  const handleDelete = async () => {
    if (!name) { setMessage("Name is required to delete an artist!"); return; }
    const mutation = `mutation DeleteArtist($name: String!) { deleteArtist(name: $name) }`;
    try {
      const res = await axios.post(GRAPHQL_URL, { query: mutation, variables: { name } });
      setMessage(res.data.data.deleteArtist);
      setName(""); setPopularity(""); setCountry(""); setGenre("");
    } catch (err) { setMessage("Error deleting artist."); }
  };

  return (
    <div className="card">
      <h2 className="section-title">Artist Management</h2>

      <div className="grid" style={{ gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <input className="input-field" placeholder="Artist Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input-field" placeholder="Popularity" type="number" value={popularity} onChange={e => setPopularity(e.target.value)} />
        <input className="input-field" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
        <input className="input-field" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button className="button button-create" onClick={handleCreate}><Plus /> Create</button>
        <button className="button button-update" onClick={handleUpdate}><Edit /> Update</button>
        <button className="button button-delete" onClick={handleDelete}><Trash2 /> Delete</button>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ArtistForm;
