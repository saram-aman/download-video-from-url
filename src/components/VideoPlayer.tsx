import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const VideoPlayer: React.FC = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const videoUrlsParam = params.get('urls');
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrlsParam) {
            setError('No video URLs provided.');
            return;
        }

        try {
            const urls = JSON.parse(videoUrlsParam) as string[];
            if (Array.isArray(urls) && urls.length > 0) {
                setVideoUrls(urls);
            } else {
                throw new Error('Invalid or empty video URLs.');
            }
        } catch (err) {
            setError('Invalid video URLs format.');
        }
    }, [videoUrlsParam]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4">
            <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                Watch and Download
            </h2>
            {error ? (
                <div className="text-xl font-bold text-red-500 p-4 bg-gray-800 rounded-lg shadow-lg mb-6">
                    {error}
                </div>
            ) : (
                <div className="flex flex-col items-center w-full gap-6">
                    {videoUrls.map((url, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <video
                                controls
                                className="w-full max-w-2xl rounded-lg shadow-2xl border-4 border-blue-500 transform transition duration-300 hover:scale-105"
                                src={url}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <a
                                href={url}
                                download
                                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                            >
                                Download Video {index + 1}
                            </a>
                        </div>
                    ))}
                </div>
            )}
            <Link
                to="/"
                className="mt-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
                Go Back
            </Link>
        </div>
    );
};

export default VideoPlayer;
