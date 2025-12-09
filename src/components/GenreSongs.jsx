import React, { useEffect, useState } from "react";
import axios from "axios";

function GenreSongs({ genreName }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const query = `
          query {
            genreSongs(name:"${genreName}") {
              title
              year
            }
          }
        `;
        const res = await axios.post("https://music-1-0.onrender.com/graphql", { query });
        setSongs(res.data.data.genreSongs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSongs();
  }, [genreName]);

  return (
    <div className="card">
      <h2>Utwory w gatunku: {genreName}</h2>
      <ul>
        {songs.map((s, i) => (
          <li key={i}>{s.title} ({s.year})</li>
        ))}
      </ul>
    </div>
  );
}

export default GenreSongs;
