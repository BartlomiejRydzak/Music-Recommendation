import React, { useState } from "react";
import { Search } from "lucide-react";
import ArtistDetails from "./ArtistDetails";
import Playlist from "./Playlist";
import GraphView from "./GraphView";

function ArtistSearch({ artistName, setArtistName }) {
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchArtist = async () => {
    if (!artistName.trim()) return;
    setLoading(true);
    try {
      const query = `
        query {
          artist(name:"${artistName}") {
            name
            popularity
            songs { title year }
            recommendations { name popularity }
          }
        }
      `;
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setArtistData(data.data.artist);
      setError("");
    } catch (err) {
      setError("Connection error");
      setArtistData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="input-icon-wrapper">
            <Search />
            <input
              type="text"
              placeholder="Search for an artist..."
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchArtist()}
              className="input-field"
            />
          </div>
          <button className="button button-search" onClick={searchArtist} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <div className="message" style={{ backgroundColor: "rgba(255,0,0,0.2)", borderColor: "rgba(255,0,0,0.5)" }}>{error}</div>}
      </div>

      {artistData && (
        <>
          <ArtistDetails artist={artistData} />
          <Playlist artistName={artistName} />
          <GraphView artistName={artistName} />
        </>
      )}
    </div>
  );
}

export default ArtistSearch;
