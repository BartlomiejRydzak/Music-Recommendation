import React from "react";

function ArtistDetails({ artist }) {
  return (
    <div className="card artist-details">
      <h2>{artist.name}</h2>
      <p>Popularity: {artist.popularity}</p>

      {artist.recommendations.length > 0 && (
        <div>
          <h3>Similar Artists</h3>
          {artist.recommendations.map((r, i) => (
            <div key={i} className="artist-card">
              <p>{r.name}</p>
              <p>Popularity: {r.popularity}</p>
            </div>
          ))}
        </div>
      )}

      {artist.songs.length > 0 && (
        <div>
          <h3>Songs</h3>
          {artist.songs.map((s, i) => (
            <div key={i} className="song-item">
              <span>{s.title}</span>
              <span>{s.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistDetails;
