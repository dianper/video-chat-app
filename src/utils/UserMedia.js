function SetupUserMedia(callback) {
	if (!navigator.mediaDevices) {
		navigator.mediaDevices = {};
	}

	if (!navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia = (constraints) => {
			var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if (!getUserMedia) {
				return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
			}

			return new Promise((resolve, reject) => {
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		}
	}

	callback && callback();
}

function GetUserMedia(callback) {
	SetupUserMedia(() => {
		navigator.mediaDevices.getUserMedia({ audio: false, video: true })
			.then(stream => callback(stream))
			.catch(err => console.log('getUserMedia.err', err));
	});
}

export { GetUserMedia, SetupUserMedia }