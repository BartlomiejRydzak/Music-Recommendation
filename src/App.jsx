import React, { useState } from "react";
import "./index.css";
import ArtistSearch from "./components/ArtistSearch";
import ArtistForm from "./components/ArtistForm";
import SongForm from "./components/SongForm";
import GenreExplorer from "./components/GenreExplorer";
import TabButton from "./components/TabButton";

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [artistName, setArtistName] = useState("");
  const [genreName, setGenreName] = useState("");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MusicGraph</h1>
        <p>Explore the universe of music connections</p>
      </header>

      <div className="tab-bar">
        <TabButton active={activeTab === "search"} onClick={() => setActiveTab("search")} label="Search Artists" />
        <TabButton active={activeTab === "manage"} onClick={() => setActiveTab("manage")} label="Manage Artists" />
        <TabButton active={activeTab === "songs"} onClick={() => setActiveTab("songs")} label="Manage Songs" />
        <TabButton active={activeTab === "genre"} onClick={() => setActiveTab("genre")} label="Browse Genre" />
      </div>

      <div className="content-area">
        {activeTab === "search" && <ArtistSearch artistName={artistName} setArtistName={setArtistName} />}
        {activeTab === "manage" && <ArtistForm />}
        {activeTab === "songs" && <SongForm />}
        {activeTab === "genre" && <GenreExplorer genreName={genreName} setGenreName={setGenreName} />}
      </div>
    </div>
  );
}

export default App;
