import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoDownloaderState {
    videoUrl: string;
    isLoading: boolean;
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
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ videoUrl: event.target.value });
    };

    fetchVideo = () => {
        this.setState({ isLoading: true }, () => {
            setTimeout(() => {
                this.props.navigate(`/video-player?url=${encodeURIComponent(this.state.videoUrl)}`);
            }, 5000);
        });
    };

    render() {
        const { videoUrl, isLoading } = this.state;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
                <h1 className="text-4xl font-bold mb-8 text-blue-300">Video Downloader</h1>
                <input type="text" value={videoUrl} onChange={this.handleInputChange} placeholder="Enter video URL" className="w-full max-w-md p-3 mb-6 text-black rounded-lg shadow-md" />
                <button onClick={this.fetchVideo} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                    {isLoading ? (
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-400 h-8 w-8"></div>
                    ) : (
                        'Fetch Video'
                    )}
                </button>
            </div>
        );
    }
}

export default withRouter(VideoDownloader);
