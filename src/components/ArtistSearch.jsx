import React, { useState } from "react";
import axios from "axios";
import ArtistDetails from "./ArtistDetails";

function ArtistSearch({ artistName, setArtistName }) {
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState("");

  const searchArtist = async () => {
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
      const res = await axios.post("http://localhost:3000/graphql", { query });
      setArtistData(res.data.data.artist);
      setError("");
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || "Błąd połączenia");
      setArtistData(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Wpisz nazwę artysty"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <button onClick={searchArtist}>Szukaj</button>

      {error && <p className="error">{error}</p>}
      {artistData && <ArtistDetails artist={artistData} />}
    </div>
  );
}

export default ArtistSearch;
