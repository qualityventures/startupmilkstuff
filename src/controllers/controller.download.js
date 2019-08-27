/* global DEBUG_PREFIX */
/* global ROOT_PATH */

import { throwError } from 'helpers/response';
import fs from 'fs';

export function downloadFile(req, res) {
  const { file_id } = req.params;
  const product_id = String(req.productData._id);
  let fileData = null;

  if (!file_id || !file_id.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid file id');
    return;
  }

  if (req.userData.role !== 'admin') {
    if (!req.orderData) {
      throwError(res, 'Order not found');
      return;
    }

    if (req.orderData.email !== req.userData.email) {
      throwError(res, 'Order not found');
      return;
    }

    let found = false;

    req.orderData.list.forEach((product) => {
      if (String(product._id) !== product_id) {
        return;
      }

      found = true;
    });

    if (!found) {
      throwError(res, 'Order not found');
      return;
    }
  }

  req.productData.files.forEach((file) => {
    if (file.file_id !== file_id) {
      return;
    }

    fileData = file;
  });

  if (!fileData) {
    throwError(res, 'File not found');
    return;
  }

  const path = `${ROOT_PATH}/../uploads/${fileData.path}`;
  const match = fileData.name.match(/\.(\w+)$/i);
  let mimeType = 'application';

  if (match) {
    mimeType = `application/${match[1]}`;
  }

  if (!fs.existsSync(path)) {
    throwError(res, 'File not found');
    return;
  }

  const stats = fs.statSync(path);

  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Disposition': `attachment; filename="${fileData.name.replace(/[^a-z0-9]/gi, '_')}"`,
    'Content-Length': stats.size,
  });

  const fileStream = fs.createReadStream(path);
  fileStream.pipe(res);
}
