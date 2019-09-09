const { ipcMain, BrowserWindow, shell } = require('electron')
const mainMenu = require("./mainMenu")
const electron = require('electron')
const path = require('path')
let allScreens
let openedWindow
let printWindow
let openCloudWindow
function ipcListener(mainWindow){
	ipcMain.on('openCloudWindow', (event, windowInfo) => {
		let urlArg = windowInfo.urlArg;
		console.log(urlArg,"openCloudWindow")
		shell.openExternal(urlArg)
		return;
		openCloudWindow = new BrowserWindow({
	    width:800,
	    height:600,
	    minWidth: 800,
    	minHeight: 600,
	    show:false,
	    autoHideMenuBar:false,
	    webPreferences: {
	    	nodeIntegration: false
	    }
	  })
		openCloudWindow.setMenu(mainMenu.menu)
		openCloudWindow.on('closed', function () {
	  	console.log("openCloudWindow closed")
	    openedWindow = null
	  })
		openCloudWindow.loadURL(urlArg)
		
    openCloudWindow.setPosition(0,0)
    openCloudWindow.maximize()
	  openCloudWindow.show()
 	
	})
	ipcMain.on('loadPreferencePage', (event, args) => {
		console.log("loadPreferencePage")
		mainWindow.loadFile(path.join(__dirname, '../pages/preferencePage/index.html'));
		mainWindow.show()
	})
	ipcMain.on('PreferenceUpdate', (event, urlArg) => {
		console.log(urlArg,"PreferenceUpdate")
		mainWindow.loadURL(urlArg)
		mainWindow.maximize()
	})
	ipcMain.on('loadPage', (event, urlArg) => {
		console.log(urlArg,"loadPage")
		mainWindow.loadURL(urlArg)
		mainWindow.show()
		mainWindow.maximize()
	})
	ipcMain.on("openInitPage",(event, urlArg) => {
		console.log("openInitPage")
		mainWindow.loadFile(path.join(__dirname, '../pages/preferencePage/index.html'));
	})
	ipcMain.on('print-content-update', (event, htmlInfo) => {
    //console.log('print-content-update',htmlInfo);
    if(printWindow){
    	printWindow.webContents.send('print-content', htmlInfo);    	
    }
  })
	ipcMain.on('print-prepared', (event, htmlInfo) => {
    console.log('print-prepared');
  })
	ipcMain.on('print-actual', (event, args) => {
		printWindow.webContents.print({ silent: false, printBackground: false, deviceName: '' },
      (data) => {
        console.log("print-actual-callback", data);
      })
	})
	ipcMain.on("startPrintWindow",(event, windowInfo) => {
		console.log("startPrintWindow")
		if(printWindow){
			printWindow.close();
			printWindow = null;
		}
		printWindow = new BrowserWindow({
	    width:600,
	    height:600,
	    minWidth: 600,
    	minHeight: 600,
	    show:false,
	    autoHideMenuBar:false,
	    webPreferences: {
	    	nodeIntegration: true
	    }
	  })
		printWindow.loadFile(path.join(__dirname, '../pages/printPage/index.html'));
		printWindow.on('closed', function () {
	  	console.log("startPrintWindow closed")
	    printWindow = null
	  })
	})
	ipcMain.on('openNewWindow', (event, windowInfo) => {
		console.log(windowInfo.urlArg,"openNewWindow")
		let urlArg = windowInfo.urlArg;
		let openNewWindow = new BrowserWindow({
	    width:800,
	    height:600,
	    minWidth: 800,
    	minHeight: 600,
	    show:false,
	    autoHideMenuBar:false,
	    webPreferences: {
	    	nodeIntegration: windowInfo.nodeIntegration
	    }
	  })
		openNewWindow.setMenu(mainMenu.menu)
		openNewWindow.on('closed', function () {
	  	console.log("openNewWindow closed")
	    openedWindow = null
	  })
		openNewWindow.loadURL(urlArg)
		
    openNewWindow.setPosition(0,0)
    openNewWindow.maximize()
	  openNewWindow.show()
 	
	})
	ipcMain.on('openedDcvWindow', (event, urlArg) => {
		console.log(urlArg,"openedDcvWindow")
		if(openedWindow){
			openedWindow.loadURL(urlArg)
			return;
		}
		allScreens = electron.screen.getAllDisplays();
		let mainWindowPosition = mainWindow.getBounds();
		let screenNums = allScreens.length;
		openedWindow = new BrowserWindow({
	    width:800,
	    height:600,
	    minWidth: 800,
    	minHeight: 600,
	    show:false,
	    autoHideMenuBar:false,
	    webPreferences: {
	    	nodeIntegration: true
	    }
	  })
		openedWindow.setMenu(mainMenu.menu)
		openedWindow.on('closed', function () {
	  	console.log("window closed")
	    openedWindow = null
	  })
		openedWindow.loadURL(urlArg)
		if(screenNums > 1){
			console.log("multi-screen")
	  	for (let i = 0; i < screenNums;i++) {
		    console.log(allScreens[i].bounds, "screen-Arr")
		    console.log(mainWindowPosition,"mainwindow-position")
		    console.log(mainWindowPosition.x,allScreens[i].bounds.x,mainWindowPosition.x,allScreens[i].bounds.x + allScreens[i].bounds.width)
		    if(mainWindowPosition.x > allScreens[i].bounds.x - 20
		      && mainWindowPosition.x < allScreens[i].bounds.x + allScreens[i].bounds.width
		     ){
		     	//20像素的宽容值
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
		        
		        break
		      }
		  }
	  }else{
	  	console.log("single-screen")
	    //单个屏幕
	    openedWindow.setSize(allScreens[0].workArea.width,allScreens[0].workArea.height)
	    openedWindow.setPosition(0,0)
		  openedWindow.show()
		  openedWindow.maximize()
	 	}
	})
	ipcMain.on("download-start",(event, downloadUrl) => {
		console.log("download-start")
		console.log(downloadUrl)
		mainWindow.webContents.downloadURL(downloadUrl);
	})
}

const ipcModule = {
	ipcListener: ipcListener
}

module.exports = ipcModule