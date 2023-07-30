window.addEventListener('DOMContentLoaded', () => {
  const { ipcRenderer } = require('electron');

  ipcRenderer.on('playWord', (event, word) => {
    const wordArray = word.split(':');
    const formattedWord = wordArray.join('<br>');
    document.getElementById('word').innerHTML = formattedWord;
  });
});
