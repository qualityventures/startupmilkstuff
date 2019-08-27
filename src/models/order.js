import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  order_numeric_id: {
    type: Number,
    required: true,
    default: 0,
  },
  email: {
    type: String,
    index: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  list: [{
    type: Schema.Types.ObjectId, ref: 'Products',
  }],
  price: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  stripe_token: {
    type: String,
  },
  stripe_charge: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'orders', strict: true });

OrderSchema.methods.toClientJSON = function() {
  return {
    id: this._id,
    numeric_id: this.order_numeric_id,
    price: this.price,
    user: this.user.toClientJSON(),
    created: this.created,
    email: this.email,
    products: this.list.map((product) => {
      return product.toClientJSON();
    }),
  };
};

export default mongoose.model('Order', OrderSchema);