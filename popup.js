document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculateBtn');
  const playlistUrlInput = document.getElementById('playlistUrl');
  const outputDiv = document.getElementById('output');

  calculateBtn.addEventListener('click', function() {
    let playlistUrl = playlistUrlInput.value;

    outputDiv.style.display = 'none';
    outputDiv.innerText = '';

    if (playlistUrl) {
      playlistUrlInput.value = '';
      outputDiv.innerText = "Calculating...";
      outputDiv.style.display = 'block';

      chrome.runtime.sendMessage({ action: 'calculateDuration', url: playlistUrl }, function(response) {
        if (response.error) {
          outputDiv.innerText = "Error: " + response.error;
        } else {
          outputDiv.innerText = response.duration;
        }
      });
    } else {
      outputDiv.innerText = "Please enter a valid URL.";
      outputDiv.style.display = 'block';
    }
  });
});