import React, { Component } from 'react';
import axios from 'axios';
import { load } from 'cheerio';
import { useNavigate } from 'react-router-dom';

interface VideoDownloaderState {
    videoUrl: string;
    isLoading: boolean;
    actualVideoUrl: string;
}

function withRouter(Component: React.ComponentType<any>) {
    return (props: any) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class VideoDownloader extends Component<{ navigate: any }, VideoDownloaderState> {
    constructor(props: any) {
        super(props);
        this.state = {
            videoUrl: '',
            isLoading: false,
            actualVideoUrl: ''
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ videoUrl: event.target.value });
    };

    fetchVideoUrl = async (pageUrl: string): Promise<string> => {
        try {
            const response = await axios.get(pageUrl);
            const html = response.data;
            const $ = load(html);
            const videoElement = $('video source');
            const videoUrl = videoElement.attr('src');
            if (!videoUrl) throw new Error('Video URL not found on the page.');
            return videoUrl.startsWith('http') ? videoUrl : `${new URL(pageUrl).origin}${videoUrl}`;
        } catch (error) {
            console.error('Error fetching video URL:', error);
            throw error;
        }
    };

    fetchVideo = async () => {
        this.setState({ isLoading: true });
        try {
            const actualVideoUrl = await this.fetchVideoUrl(this.state.videoUrl);
            this.setState({ actualVideoUrl });
            this.props.navigate(`/video-player?url=${encodeURIComponent(actualVideoUrl)}`);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { videoUrl, isLoading, actualVideoUrl } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
                <h1 className="text-4xl font-bold mb-8 text-blue-300">Video Downloader</h1>
                <input type="text" value={videoUrl} onChange={this.handleInputChange} placeholder="Enter page URL" className="w-full max-w-md p-3 mb-6 text-black rounded-lg shadow-md" />
                <button onClick={this.fetchVideo} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                    {isLoading ? (
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-400 h-8 w-8"></div>
                    ) : (
                        'Fetch Video'
                    )}
                </button>
                {actualVideoUrl && (
                    <a href={actualVideoUrl} download className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 mt-4">
                        Download Video
                    </a>
                )}
            </div>
        );
    }
}

export default withRouter(VideoDownloader);
