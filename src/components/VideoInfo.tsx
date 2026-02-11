import React, { useState } from 'react';
import { Download, Scissors, Play, CheckCircle, Settings2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface VideoInfoProps {
    info: {
        id: string;
        title: string;
        thumbnail: string;
        duration: number;
        uploader: string;
        formats: Array<{
            format_id: string;
            resolution: string;
            filesize: number;
            quality: string;
            ext: string;
        }>;
    };
    onDownload: (formatId: string, startTime?: number, endTime?: number) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ info, onDownload }) => {
    const [selectedFormat, setSelectedFormat] = useState(info.formats[0]?.format_id || '');
    const [trimEnabled, setTrimEnabled] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(info.duration || 0);

    const formatSize = (bytes: number) => {
        if (!bytes) return 'N/A';
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(1) + ' MB';
    };

    const formatDuration = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = Math.floor(sec % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mt-8 glass-card overflow-hidden"
        >
            <div className="flex flex-col md:flex-row">
                {/* Thumbnail and Basic Info */}
                <div className="md:w-1/3 p-6 bg-slate-800/30">
                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={info.thumbnail}
                            alt={info.title}
                            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="text-white w-12 h-12 fill-white" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        <h3 className="text-xl font-bold line-clamp-2 leading-tight">{info.title}</h3>
                        <div className="flex items-center text-slate-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-indigo-400" />
                            <span>{info.uploader}</span>
                        </div>
                        <div className="flex items-center text-slate-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{formatDuration(info.duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Options and Controls */}
                <div className="md:w-2/3 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2 text-indigo-400">
                            <Settings2 className="w-5 h-5" />
                            <span className="font-semibold uppercase tracking-wider text-xs">Customization</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Quality Selection */}
                        <section>
                            <label className="block text-sm font-medium text-slate-400 mb-4">Select Quality</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {info.formats.slice(0, 6).map((format) => (
                                    <button
                                        key={format.format_id}
                                        onClick={() => setSelectedFormat(format.format_id)}
                                        className={`px-4 py-3 rounded-xl border text-sm transition-all duration-300 flex flex-col items-center ${selectedFormat === format.format_id
                                                ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="font-bold">{format.resolution}</span>
                                        <span className="text-[10px] opacity-60 uppercase">{formatSize(format.filesize)} • {format.ext}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Trimming Options */}
                        <section className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Scissors className="w-5 h-5 text-indigo-400" />
                                    <span className="font-medium">Video Cutting</span>
                                </div>
                                <button
                                    onClick={() => setTrimEnabled(!trimEnabled)}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${trimEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${trimEnabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {trimEnabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div>
                                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Start (sec)</label>
                                                <input
                                                    type="number"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(Number(e.target.value))}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">End (sec)</label>
                                                <input
                                                    type="number"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(Number(e.target.value))}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Download Button */}
                        <button
                            onClick={() => onDownload(selectedFormat, trimEnabled ? startTime : undefined, trimEnabled ? endTime : undefined)}
                            className="w-full btn-primary flex items-center justify-center space-x-3 group"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            <span>Initialize Download</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoInfo;
