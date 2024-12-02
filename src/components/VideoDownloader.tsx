import React, { Component } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const origin_url = 'video-download-api.vercel.app/';

interface VideoDownloaderState {
    pageUrl: string;
    isLoading: boolean;
    videoUrls: string[];
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
            pageUrl: '',
            isLoading: false,
            videoUrls: []
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageUrl: event.target.value });
    };

    fetchVideoUrls = async (pageUrl: string) => {
        try {
            const response = await axios.post(origin_url + 'fetch-video-urls', { pageUrl });
            return response.data.videoUrls;
        } catch (error) {
            console.error('Error fetching video URLs:', error);
            throw error;
        }
    };

    fetchVideos = async () => {
        this.setState({ isLoading: true });
        try {
            const videoUrls = await this.fetchVideoUrls(this.state.pageUrl);
            this.setState({ videoUrls });
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { pageUrl, isLoading, videoUrls } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
                <h1 className="text-4xl font-bold mb-8 text-blue-300">Video Downloader</h1>
                <input
                    type="text"
                    value={pageUrl}
                    onChange={this.handleInputChange}
                    placeholder="Enter page URL"
                    className="w-full max-w-md p-3 mb-6 text-black rounded-lg shadow-md"
                />
                <button
                    onClick={this.fetchVideos}
                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-400 h-8 w-8"></div>
                    ) : (
                        'Fetch Videos'
                    )}
                </button>
                {videoUrls.length > 0 && (
                    <div className="mt-6">
                        {videoUrls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                download
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 mt-2 block"
                            >
                                Download Video {index + 1}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(VideoDownloader);
