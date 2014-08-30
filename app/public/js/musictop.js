var gui = require('nw.gui');

function MusicTop() {
	this.win = gui.Window.get();
	this.sites = {
		'grooveshark': {
			url: 'http://grooveshark.com',
			inject: 'app/inject/musictop.grooveshark.js'
		}
	};
};

MusicTop.prototype.load = function load() {
	this.bindEvents();

	/**
	 * When we're done, show the window
	 */
	this.win.show();
};

MusicTop.prototype.bindEvents = function bindEvents() {
	var self = this;
	$('#grooveshark').on('click', function(e) { self.loadSite('grooveshark'); });
}

MusicTop.prototype.loadSite = function loadSite(site) {
	var self = this;
	if (self.sites[site]) {
		var newWin = self.siteCreateWindow(site);

		self.win.hide();
	}
	else {
		console.error('Invalid site to load: ' + site);
	}
}

MusicTop.prototype.siteCreateWindow = function siteCreateWindow(site) {
	var self = this;

	site = self.sites[site];
	var newWin = gui.Window.open(site.url, {
		position: 'center',
		width: 800,
		height: 600,
		focus: true,
		'inject-js-end': site.inject
	});
	newWin.maximize();
	newWin.on('close', function() {
		self.win.show();
		newWin.close('true');
	});

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
			newWin.window.Grooveshark.togglePlayPause();
			doing = true;
		}
		setTimeout(function() { doing = false; }, 200);
	});

	shortcut.on('failed', function(msg) {
		//console.log(msg);
	});

	return newWin;
}