import React, { Component } from 'react';
import axios from 'axios';

interface VideoDownloaderState {
    videoUrl: string;
    isLoading: boolean;
    actualVideoUrls: string[];
    error: string | null;
}

class VideoDownloader extends Component<{}, VideoDownloaderState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            videoUrl: '',
            isLoading: false,
            actualVideoUrls: [],
            error: null,
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ videoUrl: event.target.value });
    };

    fetchVideos = async () => {
        this.setState({ isLoading: true, error: null });
        try {
            const { videoUrl } = this.state;
            if (!videoUrl) {
                throw new Error('Please enter a valid URL.');
            }

            const response = await axios.post('/api/fetch-video-urls', { pageUrl: videoUrl });
            const { videoUrls } = response.data;

            if (!videoUrls || videoUrls.length === 0) {
                throw new Error('No videos found for the provided URL.');
            }

            this.setState({ actualVideoUrls: videoUrls });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            this.setState({ error: errorMessage });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { videoUrl, isLoading, actualVideoUrls, error } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4">
                <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 animate-pulse">Video Downloader</h1>
                <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-2xl p-6">
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={this.handleInputChange}
                        placeholder="Enter video page URL"
                        className="w-full p-3 mb-4 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        onClick={this.fetchVideos}
                        className={`w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Fetching...' : 'Fetch Videos'}
                    </button>
                </div>
                {error && (
                    <div className="text-red-400 font-semibold mt-4 p-2 bg-gray-800 rounded-lg shadow-md">
                        {error}
                    </div>
                )}
                {actualVideoUrls.length > 0 && (
                    <div className="mt-10 flex flex-col items-center gap-6">
                        {actualVideoUrls.map((url, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <video
                                    controls
                                    className="max-w-full rounded-lg shadow-lg border-4 border-blue-500 transform transition duration-300 hover:scale-105"
                                    src={url}
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <a
                                    href={url}
                                    download
                                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 mt-4"
                                >
                                    Download Video {index + 1}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default VideoDownloader;
