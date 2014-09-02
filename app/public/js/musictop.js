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

	$('#toggle-config').on('click', function(e) { self.toggleConfig(); });
	$('#config-hotkeys input').on('keydown', function(e) { self.hotkeyDown(e); });
	$('#grooveshark').on('click', function(e) { self.loadSite('grooveshark'); });
}

MusicTop.prototype.toggleConfig = function toggleConfig() {
	var self = this;

	var sites = $('#sites');
	var configHotkeys = $('#config-hotkeys');

	if (sites.hasClass('shift-current')) {
		self.shiftScreens(sites, configHotkeys);
	}
	else if (configHotkeys.hasClass('shift-current')) {
		self.shiftScreens(null, sites, configHotkeys);
	}
}

MusicTop.prototype.shiftScreens = function shiftScreens(left, current, right) {
	var self = this;

	if (left) {
		left.removeClass('shift-current shift-right').addClass('shift-left');
	}

	if (current) {
		current.removeClass('shift-left shift-right').addClass('shift-current');
	}

	if (right) {
		right.removeClass('shift-current shift-left').addClass('shift-right');
	}
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

MusicTop.prototype.hotkeyDown = function hotkeyDown(e) {
	e.preventDefault();
	var key = new Key(e);
	e.target.value = key.toString();
};