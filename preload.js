window.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron');
  
    ipcRenderer.on('playWord', (event, word) => {
      document.getElementById('word').textContent = word;
    });
});
