import React from "react";

function ArtistDetails({ artist }) {
  return (
    <div className="card">
      <h2>{artist.name}</h2>
      <p>Popularność: {artist.popularity}</p>

      {artist.recommendations.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <h3>Podobni artyści:</h3>
          <ul>
            {artist.recommendations.map((r, i) => (
              <li key={i}>{r.name} (pop: {r.popularity})</li>
            ))}
          </ul>
        </div>
      )}

      {artist.songs.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <h3>Utwory:</h3>
          <ul>
            {artist.songs.map((s, i) => (
              <li key={i}>{s.title} ({s.year})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ArtistDetails;
