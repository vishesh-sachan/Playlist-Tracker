document.getElementById('calculateBtn').addEventListener('click', function() {
    let playlistUrl = document.getElementById('playlistUrl').value;
    
    if (playlistUrl) {
      // Show the "Calculating..." message immediately
      document.getElementById('playlistUrl').value = '';
      document.getElementById('output').innerText = "Calculating...";
  
      // Send the request to background.js
      chrome.runtime.sendMessage({ action: 'calculateDuration', url: playlistUrl }, function(response) {
        if (response.error) {
          // Display error message if there's an error
          document.getElementById('output').innerText = "Error: " + response.error;
        } else {
          // Display the calculated duration
          document.getElementById('output').innerText = response.duration;
        }
      });
    } else {
      document.getElementById('output').innerText = "Please enter a valid URL.";
    }
  });
  