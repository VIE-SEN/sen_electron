// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const electron = require('electron')
  //console.log(process.versions)
  for (const versionType of ['chrome', 'electron', 'node']) {
    //console.log(versionType)
    //document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
  }
  const fs = require("fs")
  //console.log(fs)
  const root = fs.readdirSync('D:/Work/electron_test')
  //console.log(root)
})
