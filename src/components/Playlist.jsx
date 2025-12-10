import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";

function Playlist({ artistName }) {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const query = `
          query GetPlaylist($name: String!) {
            playlistFromArtist(name: $name) {
              title
              year
            }
          }
        `;
        const res = await fetch("https://music-1-0.onrender.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { name: artistName } })
        });
        const data = await res.json();
        setPlaylist(data.data.playlistFromArtist || []);
      } catch (err) { console.error(err); }
    };
    fetchPlaylist();
  }, [artistName]);

  return (
    <div className="card">
      <h2 className="section-title icon-label">
        <Play style={{ color: "#c084fc" }} /> Playlist: {artistName}
      </h2>

      {playlist.length > 0 ? (
        <div>
          {playlist.map((s, i) => (
            <div key={i} className="list-item">
              <span style={{ color: "#c084fc", width: "2rem", fontFamily: "monospace" }}>{i + 1}.</span>
              <span style={{ color: "#fff", flex: 1 }}>{s.title}</span>
              {s.year && <span style={{ color: "#c084fc", fontSize: "0.85rem" }}>({s.year})</span>}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#c084fc" }}>No songs in playlist</p>
      )}
    </div>
  );
}

export default Playlist;
