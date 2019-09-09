// Modules to control application life and create native browser window
const electron = require('electron')
const { app, BrowserWindow, ipcMain} = electron
const path = require('path')


//app.commandLine.appendSwitch('lang', 'zh-CN')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let allScreens
let openedWindow
ipcMain.on("openNewWindow",(event,args)=>{
  let mainWindowPosition = mainWindow.getBounds()
  let screenNums = allScreens.length
  console.log(args,13,"*****",mainWindowPosition);
  if(openedWindow){
    openedWindow.destroy()
  }
  openedWindow = new BrowserWindow({
    width:0,
    height:0,
    x:0,
    y:0,
    show:false,
    autoHideMenuBar:false
  })
  openedWindow.on('closed', function () {
  	console.log("window closed")
    openedWindow = null
  })
  if(screenNums > 1){
  	for (let i = 0; i < screenNums;i++) {
	    console.log(allScreens[i].bounds, 16)
	    if(mainWindowPosition.x > allScreens[i].bounds.x 
	      && mainWindowPosition.x < allScreens[i].bounds.x + allScreens[i].bounds.width
	     ){
          //多个屏幕
          if(i){
            if(i == screenNums - 1){
              //最后一个屏幕,显示在上一个屏幕
              openedWindow.setSize(allScreens[i - 1].bounds.width,allScreens[i - 1].bounds.height)
              openedWindow.setPosition(allScreens[i - 1].bounds.x,0)
            }else{
              //显示在当前屏幕的下一个屏幕
              openedWindow.setSize(allScreens[i + 1].bounds.width,allScreens[i + 1].bounds.height)
              openedWindow.setPosition(allScreens[i + 1].bounds.x,0)
            }
          }else{
            openedWindow.setSize(allScreens[1].bounds.width,allScreens[1].bounds.height)
            openedWindow.setPosition(allScreens[1].bounds.x,0)
          }
	        openedWindow.show()
	        openedWindow.maximize()
	        //openedWindow.loadFile('dicomViewer.html',{search:"?studyUID="+args})
	        openedWindow.loadURL('index.html/?' + args)
	        break
	      }
	  }
  }else{
    //单个屏幕
    openedWindow.setSize(allScreens[0].workArea.width,allScreens[0].workArea.height)
    openedWindow.setPosition(0,0)
	  openedWindow.show()
	  openedWindow.maximize()
	  //openedWindow.loadFile('dicomViewer.html',{search:"?studyUID="+args})
	  openedWindow.loadURL('http://127.0.0.1:7788' + args)
 }
  
  event.reply("openWindowDealed","dealed")
})
function createWindow () {
  // Create the browser window.
  //console.log(electron.screen.getAllDisplays())
  //const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  allScreens = electron.screen.getAllDisplays();
  //console.log(allScreens)
  mainWindow = new BrowserWindow({
    width:800,
    height:600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    autoHideMenuBar:true
  })
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadFile('tempHtml/index.html')
  // mainWindow.loadURL(' http://127.0.0.1:7788')
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
