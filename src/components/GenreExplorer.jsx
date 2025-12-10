import React, { useEffect, useState } from "react";
import { Disc3, Music } from "lucide-react";

function GenreExplorer({ genreName, setGenreName }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (!genreName) return;
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
        const res = await fetch("https://music-1-0.onrender.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        setSongs(data.data.genreSongs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSongs();
  }, [genreName]);

  return (
    <div>
      <div className="card" style={{ display: "flex", gap: "1rem" }}>
        <div className="input-icon-wrapper">
          <Disc3 />
          <input
            type="text"
            placeholder="Enter genre (Hip Hop, Rock, Jazz)"
            value={genreName}
            onChange={e => setGenreName(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {genreName && songs.length > 0 && (
        <div className="card">
          <h2 className="section-title">Songs in {genreName}</h2>
          <div>
            {songs.map((s, i) => (
              <div key={i} className="list-item">
                <Music style={{ color: "#c084fc", width: "1rem", height: "1rem" }} />
                <span style={{ color: "#fff", flex: 1 }}>{s.title}</span>
                <span style={{ color: "#c084fc", fontSize: "0.85rem" }}>({s.year})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenreExplorer;
