import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, PlayCircle, Download, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoInfo from './VideoInfo';

const API_BASE = 'http://localhost:4000/api';

const VideoDownloader: React.FC = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState<any>(null);

    const handleFetchInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setVideoInfo(null);

        try {
            const response = await axios.post(`${API_BASE}/info`, { url });
            setVideoInfo(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch video information. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (formatId: string, startTime?: number, endTime?: number) => {
        setDownloading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE}/download`, {
                url,
                format_id: formatId,
                start_time: startTime,
                end_time: endTime
            });

            setDownloadStatus({ id: response.data.downloadId, status: 'processing' });
        } catch (err: any) {
            setError('Download failed to start.');
            setDownloading(false);
        }
    };

    // Poll for status
    useEffect(() => {
        let interval: any;
        if (downloadStatus?.id && downloadStatus.status === 'processing') {
            interval = setInterval(async () => {
                try {
                    const response = await axios.get(`${API_BASE}/status/${downloadStatus.id}`);
                    if (response.data.status === 'completed') {
                        setDownloadStatus(response.data);
                        setDownloading(false);
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error('Status polling error', err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [downloadStatus]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
            >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Universal Video Downloader
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    Capture Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Video</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Download high-quality videos from any platform with built-in cutting tools and quality selection. Fast, free, and premium.
                </p>
            </motion.div>

            {/* URL Input Area */}
            <div className="w-full max-w-3xl glass-card p-2 md:p-3 flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Paste video URL here (YouTube, Vimeo, X, etc.)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo(e)}
                        className="w-full glass-input pl-14 pr-6 focus:ring-0"
                    />
                </div>
                <button
                    onClick={handleFetchInfo}
                    disabled={loading || !url}
                    className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                    <span>{loading ? 'Analyzing...' : 'Fetch Video'}</span>
                </button>
            </div>

            {/* error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center space-x-3 w-full max-w-3xl"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <div className="w-full">
                {videoInfo && !downloadStatus?.url && (
                    <VideoInfo info={videoInfo} onDownload={handleDownload} />
                )}

                {/* Download Success Card */}
                {downloadStatus?.url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl mx-auto mt-12 glass-card p-10 text-center border-emerald-500/30 bg-emerald-500/5"
                    >
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Ready to Download!</h2>
                        <p className="text-slate-400 mb-8">Your video has been processed and is ready for download.</p>
                        <div className="space-y-4">
                            <a
                                href={downloadStatus.url}
                                download={downloadStatus.filename}
                                className="w-full btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 flex items-center justify-center space-x-3"
                            >
                                <Download className="w-6 h-6" />
                                <span className="text-lg">Download File</span>
                            </a>
                            <button
                                onClick={() => { setDownloadStatus(null); setVideoInfo(null); setUrl(''); }}
                                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                            >
                                Download another video
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Downloading state */}
                {downloading && (
                    <div className="w-full max-w-md mx-auto mt-12 text-center p-8 glass-card border-indigo-500/20">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">Processing Movie...</h3>
                        <p className="text-slate-500 text-sm mt-2">We're downloading and formatting your video. This may take a minute.</p>
                        <div className="mt-8 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500"
                                animate={{ width: ['0%', '90%'] }}
                                transition={{ duration: 15, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <footer className="mt-auto pt-20 pb-8 text-center text-slate-600 text-xs">
                <p>© 2026 Premium Video Downloader • Powered by yt-dlp & FFmpeg</p>
            </footer>
        </div>
    );
};

export default VideoDownloader;
