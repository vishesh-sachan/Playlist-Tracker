chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'calculateDuration') {
      fetchPlaylistData(request.url).then(duration => {
        sendResponse({ duration: formatDuration(duration) });
      }).catch(error => {
        sendResponse({ error: error.message });
      });
      return true;
    }
  });
  
  async function fetchPlaylistData(url) {
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      throw new Error("Invalid YouTube playlist URL.");
    }
  
    const apiKey = '';// your YouTube Data API v3
    let nextPageToken = '';
    let totalDuration = 0;
  
    try {
      do {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
  
        if (data.error) {
          throw new Error(data.error.message);
        }
  
        for (const item of data.items) {
          const videoId = item.contentDetails.videoId;
          totalDuration += await fetchVideoDuration(videoId, apiKey);
        }
  
        nextPageToken = data.nextPageToken || null;
  
      } while (nextPageToken);
  
    } catch (error) {
      throw new Error("Failed to fetch playlist data: " + error.message);
    }
  
    return totalDuration;
  }
  
  async function fetchVideoDuration(videoId, apiKey) {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch video duration for video ID ${videoId}`);
      }
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      const duration = data.items[0].contentDetails.duration;
      return parseDuration(duration);
  
    } catch (error) {
      throw new Error(`Failed to fetch video duration: ${error.message}`);
    }
  }
  
  function extractPlaylistId(url) {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('list');
    } catch (error) {
      return null;
    }
  }
  
  function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return (hours * 3600) + (minutes * 60) + seconds;
  }
  
  function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  