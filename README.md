# Video Downloader - Download from Any URL

A modern, full-featured video downloader supporting 1000+ platforms including YouTube, Vimeo, X (Twitter), Instagram, TikTok, and more.

![Premium UI](https://img.shields.io/badge/UI-Premium-blueviolet) ![yt--dlp](https://img.shields.io/badge/Powered%20by-yt--dlp-red)

## Features

✨ **Universal Support** - Download from YouTube, Vimeo, X, Instagram, TikTok, and 1000+ other platforms  
✂️ **Video Trimming** - Cut videos to specific time ranges  
🎬 **Quality Selection** - Choose from multiple quality options  
⚡ **Fast Processing** - Powered by yt-dlp  
🎨 **Beautiful UI** - Modern, glassmorphic design with smooth animations

## Prerequisites

Before running this application, you need to install **yt-dlp**:

### Windows
```bash
# Option 1: Using winget (recommended)
winget install yt-dlp

# Option 2: Using pip
pip install yt-dlp
```

### macOS
```bash
brew install yt-dlp
```

### Linux
```bash
# Using pip
pip install yt-dlp

# Or download binary
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Verify installation:
```bash
yt-dlp --version
```

## Installation

1. **Clone the repository**
```bash
cd download-video-from-url
```

2. **Install dependencies**
```bash
npm install
```

## Running the Application

You need to run **both** the backend and frontend servers:

### Terminal 1 - Backend Server (Port 4000)
```bash
node server.js
```

You should see:
```
🚀 Video downloader backend running on http://localhost:4000
📁 Downloads directory: C:\...\downloads
```

### Terminal 2 - Frontend Server (Port 3000)
```bash
npm start
```

The app will automatically open at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Paste a video URL** into the input field (e.g., YouTube, Vimeo, X)
2. **Click "Fetch Video"** to retrieve video information
3. **Select quality** from available formats
4. **(Optional) Enable video trimming** and set start/end times
5. **Click "Initialize Download"** to process and download

## Supported Platforms

- YouTube
- Vimeo  
- X (Twitter)
- Instagram
- TikTok
- Facebook
- Reddit
- Twitch
- And [1000+ more platforms](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

## Project Structure

```
download-video-from-url/
├── server.js              # Express backend with yt-dlp integration
├── src/
│   ├── components/
│   │   ├── VideoDownloader.tsx  # Main downloader component
│   │   ├── VideoInfo.tsx        # Video info & controls
│   │   └── VideoPlayer.tsx      # Video player component
│   └── App.tsx            # React router setup
├── downloads/             # Downloaded videos (auto-created)
└── package.json
```

## API Endpoints

- `POST /api/info` - Fetch video metadata
- `POST /api/download` - Start video download
- `GET /api/status/:id` - Check download status
- `GET /api/health` - Health check

## Troubleshooting

**"Failed to start yt-dlp" error**:
- Make sure yt-dlp is installed and accessible in your PATH
- Run `yt-dlp --version` to verify

**CORS errors**:
- Ensure both servers are running on the correct ports (3000 for frontend, 4000 for backend)

**Download fails**:
- Some platforms may require authentication or have geographic restrictions
- Check if the video is publicly accessible

## Technologies

**Frontend**: React, TypeScript, TailwindCSS, Framer Motion, Lucide Icons  
**Backend**: Node.js, Express, yt-dlp  
**Download Engine**: yt-dlp (Python-based universal video downloader)

## License

This project is open source and available under the MIT License.

---

**Note**: This tool is for personal use only. Respect copyright laws and terms of service of the platforms you download from.
