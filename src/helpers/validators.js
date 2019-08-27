import CATEGORIES_LIST from 'data/categories';
import DISPLAY_LIST from 'data/products-display';

export function validateEmail(email) {
  if (!email) {
    return 'The email cannot be empty';
  }

  if (typeof email !== 'string' || !email) {
    return 'Please enter Email Address';
  }

  if (!email.match(/^[0-9a-z_.+-]+@[0-9a-z.]+$/i)) {
    return 'The Email Address is in an invalid format';
  }

  return true;
}

export function validatePassword(password) {
  if (!password) {
    return 'The password cannot be empty';
  }

  if (typeof password !== 'string') {
    return 'The password is in an invalid format';
  }

  if (password.length < 8) {
    return 'The password must be at least 8 characters';
  }

  if (password.length > 40) {
    return 'The password must no more then 40 characters';
  }

  return true;
}

export function validateProductCategory(category) {
  if (!category) {
    return 'The category cannot be empty';
  }

  if (CATEGORIES_LIST[category] === undefined) {
    return 'The category is invalid';
  }

  return true;
}

export function validateProductDesc(desc) {
  if (typeof desc !== 'string') {
    return 'Please enter valid desc';
  }

  if (!desc) {
    return true;
  }

  if (desc.length > 1000) {
    return 'The desc must no more then 1000 characters';
  }

  return true;
}

export function validateProductPrice(price) {
  price = parseFloat(price);

  if (isNaN(price)) {
    return 'Please enter valid price';
  }

  if (price < 0) {
    return 'The price cannot be negative';
  }

  if (price > 1000000) {
    return 'The price is too big';
  }

  return true;
}

export function validateProductUrl(url) {
  if (!url) {
    return 'The url cannot be empty';
  }

  if (url.length < 1) {
    return 'The url must be at least 1 character';
  }

  if (url.length > 60) {
    return 'The url must no more then 60 characters';
  }

  if (!url.match(/^[0-9a-z_-]+$/)) {
    return 'The url contains invalid symbols';
  }

  return true;
}

export function validateProductName(name) {
  if (!name) {
    return 'The name cannot be empty';
  }

  if (name.length < 1) {
    return 'The name must be at least 1 character';
  }

  if (name.length > 60) {
    return 'The name must no more then 60 characters';
  }

  if (!name.match(/^[0-9a-z_!@#$& -]+$/i)) {
    return 'The name contains invalid symbols';
  }

  return true;
}

export function validateProductDisplay(display) {
  if (!display || typeof display !== 'string') return 'Invalid dipslay';
  if (DISPLAY_LIST[display] === undefined) return 'The category is invalid';
  return true;
}

export function validateProductYoutube(youtube) {
  if (typeof youtube !== 'string') return 'Invalid youtube link';
  if (youtube && !youtube.match(/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[0-9a-z_-]+$/gi)) return 'Invalid youtube link';
  return true;
}
