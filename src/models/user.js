import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    required: true,
  },
  role: {
    type: String,
    trim: true,
    default: 'user',
  },
  hashed_password: {
    type: String,
    trim: true,
    required: true,
  },
  have_paid: {
    type: Boolean,
    default: false,
  },
  subscribe: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users', strict: true });

UserSchema.methods.toClientJSON = function () {
  return {
    email: this.email,
    role: this.role,
    _id: this._id,
    have_paid: this.have_paid,
    subscribe: this.subscribe,
  };
};

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hashed_password);
};

export default mongoose.model('User', UserSchema);