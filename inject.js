var MUSICTOP_INJECTED = false;

if (!MUSICTOP_INJECTED) {
	MUSICTOP_INJECTED = true;

	console.log('injected');

	window.playpause = function() {
		$('#play-pause').trigger('click');
	}
}