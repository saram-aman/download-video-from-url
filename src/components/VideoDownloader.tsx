// src/components/VideoDownloader.tsx

import React, { Component } from 'react';

interface VideoDownloaderState {
  videoUrl: string;
  downloadLink: string | null;
  isLoading: boolean;
}

class VideoDownloader extends Component<{}, VideoDownloaderState> {
  private downloadAnchorRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      videoUrl: '',
      downloadLink: null,
      isLoading: false,
    };
    this.downloadAnchorRef = React.createRef();
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ videoUrl: event.target.value });
  };

  fetchVideo = async () => {
    const { videoUrl } = this.state;
    this.setState({ isLoading: true });
    try {
      const response = await fetch(videoUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          if (!reader) return;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }

          controller.close();
        },
      });

      const blob = await new Response(stream).blob();
      const downloadLink = URL.createObjectURL(blob);
      this.setState({ downloadLink, isLoading: false }, () => {
        // Automatically trigger download
        if (this.downloadAnchorRef.current) {
          this.downloadAnchorRef.current.click();
        }
      });
    } catch (error) {
      console.error('Error fetching video:', error);
      alert('Failed to download the video. Please check the URL and try again.');
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { videoUrl, downloadLink, isLoading } = this.state;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
        <h1 className="text-3xl font-bold mb-6">Video Downloader</h1>
        <input
          type="text"
          value={videoUrl}
          onChange={this.handleInputChange}
          placeholder="Enter video URL"
          className="w-full max-w-md p-2 mb-4 text-black rounded-lg shadow-md"
        />
        <button
          onClick={this.fetchVideo}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Fetch Video'}
        </button>
        {downloadLink && (
          <a
            href={downloadLink}
            download="video.mp4"
            ref={this.downloadAnchorRef}
            className="hidden"
          >
            Download Video
          </a>
        )}
      </div>
    );
  }
}

export default VideoDownloader;
