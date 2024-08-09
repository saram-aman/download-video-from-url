import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoDownloader from './components/VideoDownloader';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VideoDownloader />} />
                <Route path="/video-player" element={<VideoPlayer />} />
            </Routes>
        </Router>
    );
};

export default App;
