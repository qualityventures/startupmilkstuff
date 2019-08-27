import mongoose from 'mongoose';
import './products.js';

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  list: [{
    type: Schema.Types.ObjectId,
    ref: 'Products',
  }],
}, { collection: 'carts', strict: true });

CartSchema.methods.toClientJSON = function() {
  const products = [];

  this.list.forEach((product) => {
    if (!product.deleted) {
      products.push(product.toClientJSON());
    }
  });

  return {
    products,
    total: this.getPrice(),
  };
};

CartSchema.methods.getPrice = function() {
  let total = 0;

  this.list.forEach((product) => {
    if (!product.deleted) {
      total += product.price;
    }
  });

  return Math.floor(total * 100) / 100;
};

export default mongoose.model('Cart', CartSchema);
