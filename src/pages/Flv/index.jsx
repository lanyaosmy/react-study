import React, { PureComponent } from 'react';
import Reflv from 'reflv';

export default class HttpFlv extends PureComponent {
  render() {
    return (
      <Reflv
        url={`http://127.0.0.1:7001/live/movie.flv`}
        type="flv"
        isLive
        cors
        hasVideo
        hasAudio
      />
    );
  }
}

// function App() {
//   useEffect(() => {
//     if (flvjs.isSupported()) {
//       var videoElement = document.getElementById('videoElement');
//       var flvPlayer = flvjs.createPlayer({
//         cors: true,
//         type: 'flv',
//         url: 'http://localhost:7001/live/movie.flv',
//       });
//       flvPlayer.attachMediaElement(videoElement);
//       flvPlayer.load();
//       flvPlayer.play();
//     }
//   }, []);
//   return (
//     <div>
//       <video id="videoElement" controls></video>
//     </div>
//   );
// }
