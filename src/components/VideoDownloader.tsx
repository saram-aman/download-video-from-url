import React, { Component } from 'react';
interface VideoDownloaderState {
    videoUrl: string;
    downloadLink: string | null;
}

class VideoDownloader extends Component<{}, VideoDownloaderState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            videoUrl: '',
            downloadLink: null,
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ videoUrl: event.target.value });
    };

    fetchVideo = async () => {
        const { videoUrl } = this.state;
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const downloadLink = URL.createObjectURL(blob);
            this.setState({ downloadLink });
        } catch (error) {
            console.error('Error fetching video:', error);
        }
    };

    render() {
        const { videoUrl, downloadLink } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
                <h1 className="text-3xl font-bold mb-6">Video Downloader</h1>
                <input type="text" value={videoUrl} onChange={this.handleInputChange} placeholder="Enter video URL" className="w-full max-w-md p-2 mb-4 text-black rounded-lg shadow-md" />
                <button onClick={this.fetchVideo} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300">Fetch Video</button>
                {downloadLink && (
                    <a href={downloadLink} download="video.mp4" className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300">Download Video</a>
                )}
            </div>
        );
    }
}

export default VideoDownloader;
