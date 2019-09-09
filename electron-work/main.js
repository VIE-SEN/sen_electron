const electron = require('electron')

const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const ipcModule = require("./js/ipcListener")
const mainMenu = require("./js/mainMenu")
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    show: false,
    minWidth: 1300,
    minHeight: 800,
    backgroundColor:"#EEEEEE",
    webPreferences: {
    	nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
	mainWindow.loadFile(path.join(__dirname, 'index.html'));
	ipcModule.ipcListener(mainWindow)
	//设置菜单项
	mainWindow.setMenu(mainMenu.menu)
  

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit()
  })
  
  //下载管理
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
	  // 设置保存路径,使Electron不提示保存对话框。
	  item.setSaveDialogOptions({
	  	title: "保存文件",
	  	filters: [{name:"所有文件",extensions:["*"]},{name:"表格",extensions:["xls"]},{name:"压缩文件",extensions:["zip"]}]
	  })
		if(-1 <(item.getFilename()).indexOf("xls")){
			item.setSaveDialogOptions({
		  	title: "保存文件",
		  	filters: [{name:"所有文件",extensions:["*"]},{name:"表格",extensions:["xls"]}]
		  })
		}else if(-1 <(item.getFilename()).indexOf("zip")){
			item.setSaveDialogOptions({
		  	title: "保存文件",
		  	filters: [{name:"所有文件",extensions:["*"]},{name:"压缩文件",extensions:["zip"]}]
		  })
		}
	  item.on('updated', (event, state) => {
	    if (state === 'interrupted') {
	      console.log('Download is interrupted but can be resumed')
	    } else if (state === 'progressing') {
	      if (item.isPaused()) {
	        console.log('Download is paused')
	      } else {
	        console.log(`Received bytes: ${item.getReceivedBytes()}`)
	      }
	    }
	  })
	  item.once('done', (event, state) => {
	    if (state === 'completed') {
	      console.log('Download successfully')
	    } else {
	      console.log(`Download failed: ${state}`)
	    }
	  })
	})
  globalShortcut.register("Ctrl+Shift+I",function(){
  	// Open the DevTools.
  	mainWindow.webContents.openDevTools()
  })
  globalShortcut.register("CmdOrCtrl+I",function(){
  	// Open the DevTools.
  	console.log("openInitPage")
  	mainWindow.loadFile(path.join(__dirname, '/pages/preferencePage/index.html'));
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
