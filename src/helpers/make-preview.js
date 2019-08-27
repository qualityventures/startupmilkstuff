import gm from 'gm';

const PREVIEW_SIZE = 300;

export default function (image_path, preview_path, callback) {
  gm(image_path).size((err, size) => {
    if (err) {
      callback(err);
      return;
    }

    const { width, height } = size;
    const aspect = width / height;

    let new_width = 0;
    let new_height = 0;

    if (width < PREVIEW_SIZE || height < PREVIEW_SIZE) {
      callback('Image is too small');
      return;
    }

    if (aspect === 1) {
      new_height = PREVIEW_SIZE;
      new_width = PREVIEW_SIZE;
    } else if (aspect > 1) {
      new_height = PREVIEW_SIZE;
      new_width = Math.round(PREVIEW_SIZE * aspect);
    } else {
      new_width = PREVIEW_SIZE;
      new_height = Math.round(PREVIEW_SIZE / aspect);
    }

    gm(image_path)
      .resize(new_width, new_height)
      .write(preview_path, (resize_err) => {
        if (resize_err) {
          callback(resize_err);
          return;
        }

        callback(null);
      });
  });
}
