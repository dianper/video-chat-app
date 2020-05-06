export default function GetUserMedia(callback) {
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(stream => callback(stream))
    .catch(err => console.log('getUserMedia.err', err));
}
