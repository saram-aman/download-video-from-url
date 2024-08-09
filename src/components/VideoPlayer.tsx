import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const VideoPlayer: React.FC = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const videoUrl = params.get('url');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrl) {
            setError('No video URL provided.');
            return;
        }

        fetch(videoUrl, { method: 'HEAD' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Video could not be loaded.');
                }
            })
            .catch((err) => setError(err.message));
    }, [videoUrl]);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h2 className="text-4xl font-bold mb-8 text-blue-400">Watch and Download</h2>
            {error ? (
                <div className="text-red-500 mb-6">{error}</div>
            ) : (
                <video controls className="max-w-full max-h-screen mb-6 rounded-lg shadow-lg">
                    <source src={videoUrl || ''} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
            <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">Go Back</Link>
        </div>
    );
};

export default VideoPlayer;
