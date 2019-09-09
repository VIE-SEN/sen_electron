const { Menu, MenuItem, BrowserWindow } = require('electron')
const path = require('path')
var menu = new Menu();
menu.append(
	new MenuItem({
		label:"操作",
		submenu:[
			{
				label:"配置服务地址",
				accelerator: 'CmdOrCtrl+I',
				click: function(item, focusedWindow){
						focusedWindow.loadFile(path.join(__dirname, '../pages/preferencePage/index.html'));
				}
			},
			{
				label:"重新加载",
				accelerator: 'CmdOrCtrl+R',
				click: function(item, focusedWindow){
						focusedWindow.reload();
				}
			},
			{
				label:"调试窗口",
				accelerator: '',
				click: function(item, focusedWindow){
						focusedWindow.webContents.openDevTools()
				}
			},
			{
				label:"下载管理",
				accelerator: '',
				click: function(item, focusedWindow){
						new BrowserWindow({
					    width: 1300,
					    height: 800,
					    show: false,
					    minWidth: 1300,
					    minHeight: 800,
					    backgroundColor:"#EEEEEE",
					    webPreferences: {
					    	nodeIntegration: true
					    }
					  })
						mainWindow.loadFile(path.join(__dirname, '../pages/downloadPage/index.html'));
				}
			},
			{
				label:"回到主页",
				accelerator: '',
				click: function(item, focusedWindow){
						focusedWindow.loadFile(path.join(__dirname, '../index.html'));
				}
			}
		]
	})
);
//menu.append(new MenuItem({ type: 'separator' }));
//menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

const mainMenu = {
	menu:menu
}

module.exports = mainMenu;