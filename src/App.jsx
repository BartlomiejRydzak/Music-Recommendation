import React, { useState } from "react";
import ArtistSearch from "./components/ArtistSearch";
import GenreSongs from "./components/GenreSongs";
import Playlist from "./components/Playlist";
import GraphView from "./components/GraphView";

function App() {
  const [artistName, setArtistName] = useState("");
  const [genreName, setGenreName] = useState("");

  return (
    <div className="container">
      <h1>MusicGraph</h1>
      
      <ArtistSearch artistName={artistName} setArtistName={setArtistName} />
      
      {artistName && (
        <>
          <Playlist artistName={artistName} />
          <GraphView artistName={artistName} />
        </>
      )}
      
      <div style={{ marginTop: "24px" }}>
        <input
          type="text"
          placeholder="Wpisz gatunek np. Hip Hop"
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
        />
        {genreName && <GenreSongs genreName={genreName} />}
      </div>
    </div>
  );
}

export default App;