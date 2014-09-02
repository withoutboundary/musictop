//65 to 90 is A-Z
var KEY_MAP = {
	179: 'MediaPlayPause',
	178: 'MediaStop',
	166: 'MediaPrevTrack',
	167: 'MediaNextTrack',
	188: 'Comma',
	190: 'Period',
	36: 'Home',
	35: 'End',
	33: 'PageUp',
	34: 'PageDown',
	45: 'Insert',
	46: 'Delete',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down'
};

function Key(e) {
	this.e = e;
}

Key.prototype.toString = function toString() {
	if (!this.asString) {
		var str = [];

		if (this.e.ctrlKey) {
			str.push('Ctrl');
		}
		if (this.e.shiftKey) {
			str.push('Shift');
		}
		if (this.e.altKey) {
			str.push('Alt');
		}
		if (this.e.metaKey) {
			str.push('Meta');
		}
		if (this.e.which) {
			var mapped = null;
			if (KEY_MAP[this.e.which]) {
				mapped = KEY_MAP[this.e.which];
			}
			else if (this.e.which >= 65 && this.e.which <= 90) {
				mapped = String.fromCharCode(this.e.which).toUpperCase();
			}
			if (mapped) {
				str.push(mapped);
			}
		}
		this.asString = str.join('+');
	}

	return this.asString;
}