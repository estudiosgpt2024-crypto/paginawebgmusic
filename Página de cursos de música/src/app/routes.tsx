import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/AlbumCoursesPages";
import { AlbumPage } from "./pages/AlbumCoursesPages";
import { useState } from "react";
import { TRACKS, ALBUMS } from "./data/music-data";

// Layout wrapper que mantiene el estado del reproductor
function RootLayout() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [playing, setPlaying] = useState(false);
  const [playlist] = useState(TRACKS);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const onPlay = (track) => { setCurrentTrack(track); setPlaying(true); };
  const onPlayAlbum = (album) => {
    const t = album.tracklist[0];
    setCurrentTrack({ id:album.id*100, title:t.title, artist:album.artist, album:album.title, image:album.image, duration:t.duration });
    setPlaying(true);
  };
  const onSkip = (dir) => {
    const idx = playlist.findIndex(t=>t.id===currentTrack.id);
    const next = playlist[(idx+dir+playlist.length)%playlist.length];
    setCurrentTrack(next); setPlaying(true);
  };

  // Renderizar página según currentPage
  if (currentPage === "home") {
    return <HomePage 
      setPage={setCurrentPage} 
      setAlbum={setSelectedAlbum} 
      onPlay={onPlay} 
      onPlayAlbum={onPlayAlbum} 
      currentTrack={currentTrack} 
      playing={playing}
      onSkip={onSkip}
      playlist={playlist}
      onToggle={() => setPlaying(!playing)}
      onSelect={(t) => { setCurrentTrack(t); setPlaying(true); }}
    />;
  } else if (currentPage === "album" && selectedAlbum) {
    return <AlbumPage 
      album={selectedAlbum} 
      setPage={setCurrentPage} 
      onPlay={onPlay} 
      currentTrack={currentTrack} 
      playing={playing}
    />;
  } else if (currentPage === "courses") {
    return <CoursesPage setPage={setCurrentPage} />;
  }
  
  return <HomePage 
    setPage={setCurrentPage} 
    setAlbum={setSelectedAlbum} 
    onPlay={onPlay} 
    onPlayAlbum={onPlayAlbum} 
    currentTrack={currentTrack} 
    playing={playing}
    onSkip={onSkip}
    playlist={playlist}
    onToggle={() => setPlaying(!playing)}
    onSelect={(t) => { setCurrentTrack(t); setPlaying(true); }}
  />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
  },
  {
    path: "*",
    Component: RootLayout,
  }
]);
