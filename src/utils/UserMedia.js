export default function GetUserMedia(callback) {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => callback(stream))
    .catch(err => console.log('getUserMedia.err', err));
}
