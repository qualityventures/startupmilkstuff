/* global DEBUG_PREFIX */
/* global ROOT_PATH */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import { getFileType } from 'helpers/files';
import {
  validateProductUrl,
  validateProductName,
  validateProductCategory,
  validateProductDesc,
  validateProductPrice,
  validateProductDisplay,
  validateProductYoutube
} from 'helpers/validators';
import Products from 'models/products';
import debug from 'debug';
import { RESULTS_PER_PAGE } from 'data/config.public';
import CATEGORIES_LIST from 'data/categories';
import crypto from 'crypto';
import fs from 'fs';
import FORMATS_LIST from 'data/files';
import makePreview from 'helpers/make-preview';
import mongoose from 'mongoose';

const log = debug(`${DEBUG_PREFIX}:controller.products`);

function processDesc(desc) {
  desc = desc.replace(/[\r]/g, '');
  desc = desc.replace(/^[\n]+/, '');
  desc = desc.replace(/[\n]+$/, '');
  desc = desc.replace(/[\n]/g, '<br/>');
  desc = `<p>${desc}</p>`;

  return desc;
}

function validateProductData(req, res) {
  const fields = {
    desc: validateProductDesc,
    price: validateProductPrice,
    category: validateProductCategory,
    url: validateProductUrl,
    name: validateProductName,
    display: validateProductDisplay,
    youtube: validateProductYoutube,
  };
  const data = {};
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; ++i) {
    const field = keys[i];
    const value = req.body[field];
    const validation = fields[field](value);

    if (validation !== true) {
      throwError(res, validation);
      return false;
    }

    data[field] = value;
  }

  data.deleted = !!req.body.deleted;

  return data;
}

export function getProducts(req, res) {
  const query = {};
  const { category, status } = req.query;
  let { sort, search } = req.query;
  let page = Math.min(parseInt(req.query.page || 1, 10) || 1, 100);
  let pages = 0;
  let total = 0;
  let per_page = RESULTS_PER_PAGE;

  if (['-created', 'price'].indexOf(sort) === -1) {
    sort = '-created';
  }

  if (search) {
    search = search
      .replace(/[^0-9a-z ]/gi, '')
      .trim()
      .replace(/\s+/g, '|');

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
  }

  if (CATEGORIES_LIST[category]) {
    query.category = category;
  }

  if (req.userData.role === 'admin' && req.query.rpp) {
    per_page = parseInt(req.query.rpp, 10) || RESULTS_PER_PAGE;
  }

  if (req.userData.role !== 'admin' || status === 'visible') {
    query.visible = true;
  } else {
    query.deleted = status === 'deleted';
  }

  Products.count(query)
    .then((data) => {
      total = data || 0;

      pages = Math.max(Math.floor(total / per_page), 1);
      if (pages * per_page < total) {
        ++pages;
      }

      if (page > pages) {
        page = pages;
      }

      return Products.find(query)
        .sort(sort)
        .limit(per_page)
        .skip(per_page * (page - 1))
        .exec();
    })
    .then((products) => {
      if (products === null) {
        throw new Error('Products not found');
      }

      returnObjectAsJSON(res, {
        page,
        pages,
        total,
        products: products.map((product) => {
          return product.toClientJSON();
        }),
      });
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function getProductByUrl(req, res) {
  const { url } = req.params;

  if (!url || !url.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid url');
    return;
  }

  Products.findOne({ url, visible: true })
    .populate('related')
    .then((product) => {
      if (product === null) {
        throw new Error('Product not found');
      }

      returnObjectAsJSON(res, product.toClientJSON());
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Internal server error';
      log(error);
      throwError(res, error);
    });
}

export function getProductById(req, res) {
  returnObjectAsJSON(res, req.productData);
}

export function updateProduct(req, res) {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid id');
    return;
  }

  const data = validateProductData(req);

  if (!data) {
    return;
  }

  Products.findById(id)
    .then((product) => {
      if (product === null) {
        throw new Error('Product not found');
      }

      product.name = data.name;
      product.url = data.url;
      product.price = data.price;
      product.desc_raw = data.desc;
      product.desc_html = processDesc(data.desc);
      product.category = data.category;
      product.deleted = data.deleted;
      product.youtube = data.youtube;
      product.display = data.display;

      return product.save();
    })
    .then((product) => {
      product.updateVisibility();
      return product.save();
    })
    .then((product) => {
      returnObjectAsJSON(res, product);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function createNewProduct(req, res) {
  const data = validateProductData(req);

  if (!data) {
    return;
  }

  Products.findOne({ url: data.url })
    .then((product) => {
      if (product !== null) {
        throw new Error('Product with given url already exists');
      }

      data.desc_raw = data.desc;
      data.desc_html = processDesc(data.desc);
      data.desc = null;

      return Products.create(data);
    })
    .then((createdProduct) => {
      if (createdProduct === null) {
        throw new Error('Error while creating product');
      }

      returnObjectAsJSON(res, createdProduct);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function addProductImage(req, res) {
  if (!req.busboy) {
    throwError(res, 'Internal server error');
    return;
  }

  const public_path = `${ROOT_PATH}/../public/`;
  const image_dir = `/images/${String(req.productData._id).substr(0, 2)}`;
  const image_id = crypto.randomBytes(8).toString('hex');
  const preview_path = `${image_dir}/${image_id}-preview.png`;
  let image_path = `${image_dir}/${image_id}`;
  let resize_path = `${image_dir}/${image_id}`;
  let animated = false;

  if (!fs.existsSync(`${public_path}/${image_dir}`)) {
    fs.mkdirSync(`${public_path}/${image_dir}`);
  }

  req.busboy.on('file', (fieldname, file, filename) => {
    let ext = false;
    const match = filename.match(/\.(jpg|jpeg|png|gif)$/i);

    if (match) {
      ext = match[1].toLowerCase();
      image_path += `.${ext}`;
      resize_path += `.${ext}`;

      if (ext === 'gif') {
        animated = true;
        resize_path += '[0]';
      }
    }

    const file_path = `${public_path}/${image_path}`;
    const fstream = fs.createWriteStream(file_path);

    file.pipe(fstream);

    fstream.on('close', () => {
      if (!ext) {
        fs.unlinkSync(file_path);
        throwError(res, 'Invalid file format');
        return;
      }

      makePreview(
        `${public_path}/${resize_path}`,
        `${public_path}/${preview_path}`,
        (err) => {
          if (err) {
            fs.unlinkSync(file_path);
            throwError(res, err);
            return;
          }

          req.productData.images.push({
            animated,
            full: image_path,
            preview: preview_path,
          });

          req.productData
            .save()
            .then((product) => {
              product.updateVisibility();
              return product.save();
            })
            .then((product) => {
              returnObjectAsJSON(res, product.images);
            })
            .catch((save_err) => {
              const error =
                save_err && save_err.toString
                  ? save_err.toString()
                  : 'Error while saving image';
              log(save_err);
              fs.unlinkSync(file_path);
              throwError(res, error);
            });
        }
      );
    });
  });

  req.pipe(req.busboy);
}

export function moveProductImage(req, res) {
  const { image, direction } = req.body;
  const images = [...req.productData.images];
  let index = -1;

  for (let i = 0; i < images.length; ++i) {
    images[i] = { ...images[i] };

    if (images[i].full === image) {
      index = i;
    }
  }

  if (index < 0) {
    throwError(res, 'Incorrect image');
    return;
  }

  if (direction === 'up' && index > 0) {
    const swap = images[index - 1];
    images[index - 1] = images[index];
    images[index] = swap;
  } else if (direction === 'down' && index < images.length - 1) {
    const swap = images[index + 1];
    images[index + 1] = images[index];
    images[index] = swap;
  } else {
    throwError(res, 'Unable to move image');
    return;
  }

  req.productData.images = images;
  req.productData
    .save()
    .then((savedProduct) => {
      returnObjectAsJSON(res, savedProduct.images);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while moving image';
      log(error);
      throwError(res, error);
    });
}

export function deleteProductImage(req, res) {
  const { image } = req.body;
  const images = [...req.productData.images];
  let index = -1;

  for (let i = 0; i < images.length; ++i) {
    images[i] = { ...images[i] };

    if (images[i].full === image) {
      index = i;
    }
  }

  if (index < 0) {
    throwError(res, 'Incorrect image');
    return;
  }
  try {
    fs.unlinkSync(`${ROOT_PATH}/../public/${images[index].full}`);
    fs.unlinkSync(`${ROOT_PATH}/../public/${images[index].preview}`);
  } catch (e) {
    console.error(e);
  }

  images.splice(index, 1);

  req.productData.images = images;
  req.productData
    .save()
    .then((product) => {
      product.updateVisibility();
      return product.save();
    })
    .then((product) => {
      returnObjectAsJSON(res, product.images);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while deleting image';
      log(error);
      throwError(res, error);
    });
}

export function addProductFile(req, res) {
  if (!req.busboy) {
    throwError(res, 'Internal server error');
    return;
  }
  req.setTimeout(600000);

  const public_path = `${ROOT_PATH}/../uploads/`;
  const image_dir = `${String(req.productData._id).substr(0, 2)}`;
  const file_id = crypto.randomBytes(8).toString('hex');
  let file_path = `${image_dir}/${file_id}`;

  if (!fs.existsSync(`${public_path}/${image_dir}`)) {
    fs.mkdirSync(`${public_path}/${image_dir}`);
  }

  req.busboy.on('file', (fieldname, file, filename) => {
    let ext = false;
    let file_type = false;

    const match = filename.match(/\.([0-9a-z_-]{1,12})$/i);

    if (match) {
      ext = match[1].toLowerCase();
      file_type = getFileType(ext);
      file_path += `.${ext}`;
    }

    const absolute_path = `${public_path}/${file_path}`;
    const fstream = fs.createWriteStream(absolute_path);

    file.pipe(fstream);

    fstream.on('close', () => {
      if (!ext || !file_type) {
        fs.unlinkSync(absolute_path);
        throwError(res, 'Invalid file format');
        return;
      }

      req.productData.files.push({
        file_id,
        types: [file_type],
        path: file_path,
        name: filename,
      });
      req.productData
        .save()
        .then((product) => {
          product.updateVisibility();
          return product.save();
        })
        .then((product) => {
          returnObjectAsJSON(res, product.files);
        })
        .catch((err) => {
          const error =
            err && err.toString ? err.toString() : 'Error while saving file';
          log(error);
          fs.unlinkSync(absolute_path);
          throwError(res, error);
        });
    });
  });

  req.pipe(req.busboy);
}

export function deleteProductFile(req, res) {
  const { file_id } = req.body;
  const files = [...req.productData.files];
  let index = -1;

  for (let i = 0; i < files.length; ++i) {
    if (files[i].file_id !== file_id) {
      continue;
    }

    index = i;
    break;
  }

  if (index < 0) {
    throwError(res, 'Incorrect image');
    return;
  }

  try {
    fs.unlinkSync(`${ROOT_PATH}/../uploads/${files[index].path}`);
  } catch (e) {
    console.error(e);
  }
  files.splice(index, 1);

  req.productData.files = files;
  req.productData
    .save()
    .then((product) => {
      product.updateVisibility();
      return product.save();
    })
    .then((product) => {
      returnObjectAsJSON(res, product.files);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while deleting file';
      log(error);
      throwError(res, error);
    });
}

export function updateProductFile(req, res) {
  const { formats } = req.body;
  const { file_id } = req.params;
  const files = [...req.productData.files];

  if (!Array.isArray(formats)) {
    throwError(res, 'Invalid formats format');
    return;
  }

  const valid = [];

  formats.forEach((format) => {
    if (FORMATS_LIST[format] === undefined) {
      return;
    }

    valid.push(format);
  });

  if (!valid.length) {
    throwError(res, 'Formats list is empty');
    return;
  }

  for (let i = 0; i < files.length; ++i) {
    if (files[i].file_id !== file_id) {
      continue;
    }

    files[i] = { ...files[i] };
    files[i].types = valid;
  }

  req.productData.files = files;
  req.productData
    .save()
    .then((product) => {
      product.updateVisibility();
      return product.save();
    })
    .then((product) => {
      returnObjectAsJSON(res, product.files);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while deleting file';
      log(error);
      throwError(res, error);
    });
}

export function updateProductRelated(req, res) {
  const { related } = req.body;

  if (!Array.isArray(related)) {
    throwError(res, 'Invalid related format');
    return;
  }

  if (!related.length) {
    req.productData.related = [];
    req.productData
      .save()
      .then((product) => {
        returnObjectAsJSON(res, product);
      })
      .catch((err) => {
        const error =
          err && err.toString ? err.toString() : 'Error while updating related';
        log(error);
        throwError(res, error);
      });

    return;
  }

  const query = [];

  related.forEach((id) => {
    if (!id.match(/^[0-9a-z_]{10,40}$/i)) {
      return;
    }

    query.push(mongoose.Types.ObjectId(id));
  });

  Products.find({ visible: true, _id: { $in: query } })
    .then((products) => {
      const ids = [];

      products.forEach((product) => {
        ids.push(product._id);
      });

      req.productData.related = ids;
      return req.productData.save();
    })
    .then((product) => {
      return Products.findById(product._id).populate('related');
    })
    .then((product) => {
      returnObjectAsJSON(res, product);
    })
    .catch((err) => {
      const error =
        err && err.toString ? err.toString() : 'Error while updating related';
      log(error);
      throwError(res, error);
    });
}
