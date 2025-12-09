import React, { useEffect, useState } from "react";
import axios from "axios";

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

        const res = await axios.post(
          "https://music-1-0.onrender.com/graphql",
          {
            query,
            variables: { name: artistName }
          }
        );

        setPlaylist(res.data.data.playlistFromArtist || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaylist();
  }, [artistName]);

  return (
    <div className="card" style={{ marginTop: "12px" }}>
      <h2>Playlist dla: {artistName}</h2>

      <ul>
        {playlist.map((s, i) => (
          <li key={i}>
            {s.title} {s.year ? `(${s.year})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
