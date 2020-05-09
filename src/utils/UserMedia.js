export default function GetUserMedia() {
  return navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: {
        facingMode: { exact: "user" }
      }
    });
}
