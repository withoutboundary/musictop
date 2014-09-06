var gui = require('nw.gui');

function MusicTop() {
	this.win = gui.Window.get();
	this.sites = {
		'grooveshark': {
			url: 'http://grooveshark.com',
			inject: 'app/inject/musictop.grooveshark.js'
		}
	};
	this.boundHotkeys = [];
};

MusicTop.prototype.load = function load() {
	this.setupTemplates();
	this.loadGUI();
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
	$('#save-config-hotkeys').on('click', function(e) { self.saveHotkeys(e); });
	$('#grooveshark').on('click', function(e) { self.loadSite('grooveshark'); });
};

MusicTop.prototype.setupTemplates = function setupTemplates() {
	var self = this;

	this.templates = {};
	this.templates.hotkeys = Handlebars.compile($('#t-hotkeys').html());
};

MusicTop.prototype.loadGUI = function loadGUI() {
	var self = this;

	var hotkeys = JSON.parse(localStorage.hotkeys);
	$('#config-hotkeys form tbody').append(this.templates.hotkeys(hotkeys));
};

MusicTop.prototype.loadHotkeys = function loadHotkeys(site, win) {
	if (!this.hotkeysLoaded) {
		this.hotkeysLoaded = true;

		var hotkeys = JSON.parse(localStorage.hotkeys);
		hotkeys = hotkeys[site];

		var hotkeysList = [
			'togglePlayPause',
			'previousTrack',
			'nextTrack'
		];

		hotkeysList.forEach(function(hk) {
			if (hotkeys[hk]) {
				createHotkey(hotkeys[hk], win.window.MusicTop[hk]);
			}
		});
	}
};

function createHotkey(key, func, failed, delay) {
	failed = failed || function(){}; //noop
	delay = delay || 200;

	var option = {key : key};

	var shortcut = new gui.Shortcut(option);

	gui.App.registerGlobalHotKey(shortcut);

	var doing = false;
	shortcut.on('active', function() {
		if (!doing) {
			func();
			doing = true;
		}
		setTimeout(function() { doing = false; }, delay);
	});

	shortcut.on('failed', failed); //failed to register
}

MusicTop.prototype.unloadHotkeys = function unloadHotkeys() {
	this.boundHotkeys.forEach(function(hotkey) {
		gui.App.unregisterGlobalHotKey(hotkey);
	});

	this.boundHotkeys = [];
	this.hotkeysLoaded = false;
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
};

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
};

MusicTop.prototype.loadSite = function loadSite(site) {
	var self = this;
	if (self.sites[site]) {
		var newWin = self.siteCreateWindow(site);

		self.win.hide();
	}
	else {
		console.error('Invalid site to load: ' + site);
	}
};

MusicTop.prototype.siteCreateWindow = function siteCreateWindow(siteName) {
	var self = this;

	site = self.sites[siteName];
	var newWin = gui.Window.open(site.url, {
		position: 'center',
		width: 800,
		height: 600,
		focus: true,
		'inject-js-end': site.inject
	});
	newWin.maximize();
	newWin.on('close', function() {
		self.unloadHotkeys();
		self.win.show();
		newWin.close('true');
	});

	newWin.on('loaded', function() {
		self.loadHotkeys(siteName, newWin);
	});

	return newWin;
};

MusicTop.prototype.hotkeyDown = function hotkeyDown(e) {
	e.preventDefault();
	var key = new Key(e);
	e.target.value = key.toString();
};

MusicTop.prototype.saveHotkeys = function saveHotkeys(e) {
	e.preventDefault();

	var data = $('#config-hotkeys form').serializeJSON();
	localStorage.hotkeys = JSON.stringify(data.hotkeys);
};