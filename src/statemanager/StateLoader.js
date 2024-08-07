import pixelBitmap from 'react-native-pixel-bmp';
import Downloader from '../fileloaders/Downloader';
import Uploader from '../fileloaders/Uploader';
import {StateConverter} from './StateConverter';
import GifLoader from '../libs/GifLoader';

class StateLoader {
  serializeForDownload(state) {
    return StateConverter.convertToExport(state);
  }

  prepareForDownload(state, fileName) {
    const serialized = this.serializeForDownload(state);

    return Downloader.prepareJSONBlobAsync(serialized, fileName);
  }

  prepareAfterUploadAsync(data) {
    const subState = StateConverter.convertToImport(data.json);

    return Promise.resolve({file: data.file, json: subState});
  }

  // calls calback with { file, json }
  upload(file, callback) {
    Uploader.asJSONAsync(file)
      .then(this.prepareAfterUploadAsync.bind(this))
      .then(callback);
  }

  uploadGif(gif, callback, stepCallback) {
    const loader = new GifLoader({gif});

    loader
      .load(stepCallback)
      .then((frames) => {
        const frame = frames[0],
          fps = Math.min(Math.round(100 / frame.delay), 24),
          width = frame.data.width,
          height = frame.data.height;

        const subState = StateConverter.createStateFromFramesData(
          frames,
          fps,
          width,
          height,
        );

        return Promise.resolve({file: gif, json: subState});
      })
      .then(callback);
  }

  uploadBmp(file, callback, stepCallback) {
    if (file.url) {
      file.name = file.url.substring(file.url.lastIndexOf('/') + 1);
    }
    pixelBitmap
      .parse(file.url || file)
      .then((imageDatas) => {
        const frames = imageDatas.map((imageData) => {
          const length = imageData.data.length;
          for (let i = 0; i < length; i += 4) {
            if (
              imageData.data[i] ||
              imageData.data[i + 1] ||
              imageData.data[i + 2]
            ) {
              imageData.data[i + 3] = 255;
            }
          }

          return {
            data: imageData,
            delay: 100,
          };
        });

        return Promise.resolve(frames);
      })
      .then((frames) => {
        const frame = frames[0],
          fps = Math.min(Math.round(100 / frame.delay), 24),
          width = frame.data.width,
          height = frame.data.height;

        const subState = StateConverter.createStateFromFramesData(
          frames,
          fps,
          width,
          height,
        );

        return Promise.resolve({file, json: subState});
      })
      .then(callback);
  }
}

export default new StateLoader();
