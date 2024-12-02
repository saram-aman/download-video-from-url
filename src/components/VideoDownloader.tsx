import React, { Component } from 'react';
import axios from 'axios';

interface VideoDownloaderState {
    videoUrl: string;
    isLoading: boolean;
    actualVideoUrl: string | null;
    error: string | null;
}

class VideoDownloader extends Component<{}, VideoDownloaderState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            videoUrl: '',
            isLoading: false,
            actualVideoUrl: null,
            error: null,
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ videoUrl: event.target.value });
    };

    fetchVideo = async () => {
        const { videoUrl } = this.state;

        if (!videoUrl.trim()) {
            this.setState({ error: 'Please enter a valid URL.', isLoading: false });
            return;
        }

        this.setState({ isLoading: true, error: null, actualVideoUrl: null });

        try {
            const response = await axios.post('/api/fetch-video-urls', { pageUrl: videoUrl });
            const videoUrls = response.data.videoUrls;

            if (videoUrls && videoUrls.length > 0) {
                this.setState({ actualVideoUrl: videoUrls[0], error: null });
            } else {
                this.setState({ error: 'No video URLs found.' });
            }
        } catch (err) {
            this.setState({
                error: 'Error fetching video. Please try again later.',
            });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { videoUrl, isLoading, actualVideoUrl, error } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6">
                <h1 className="text-5xl font-extrabold text-blue-300 mb-8">Video Downloader</h1>
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={this.handleInputChange}
                        placeholder="Enter video page URL"
                        className="w-full p-3 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={this.fetchVideo}
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition-transform duration-200 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Fetching...' : 'Fetch Video'}
                    </button>
                </div>
                {error && <p className="text-red-400 mt-4">{error}</p>}
                {actualVideoUrl && (
                    <div className="mt-10 text-center">
                        <video
                            controls
                            src={actualVideoUrl}
                            className="rounded-lg shadow-lg max-w-full border-4 border-blue-400"
                        ></video>
                        <a
                            href={actualVideoUrl}
                            download
                            className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                        >
                            Download Video
                        </a>
                    </div>
                )}
            </div>
        );
    }
}

export default VideoDownloader;
