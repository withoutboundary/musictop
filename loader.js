exports.load = function(gui) {
	var MusicTop = require('./app/musictop'),
	    mt = new MusicTop(gui);

	mt.load();
}

/*var gui = require("nw.gui");

*/
//var win = gui.Window.get();
//win.showDevTools();
/*
var gs = gui.Window.open('http://grooveshark.com', {
	position: 'center',
	width: 800,
	height: 600,
	"inject-js-end": "inject.js"
});

gs.maximize();

//console.log(gui);

var option = {
	key : "Ctrl+Shift+A",
	active : function() {
		//console.log("Global desktop keyboard shortcut: " + this.key + " active.");
	},
	failed : function(msg) {
		//console.log(msg);
	}
};

var shortcut = new gui.Shortcut(option);

gui.App.registerGlobalHotKey(shortcut);

var doing = false;
shortcut.on('active', function() {
	if (!doing) {
		gs.window.playpause();
		doing = true;
	}
	setTimeout(function() { doing = false; }, 200);
});

shortcut.on('failed', function(msg) {
	//console.log(msg);
});
*/