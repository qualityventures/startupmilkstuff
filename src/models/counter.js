import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  _id: String,
  next: {
    type: Number,
    default: 1,
  },
}, { collection: 'counters', strict: true });

CounterSchema.statics.increment = function(counter) {
  return this.findByIdAndUpdate(
    counter,
    { $inc: { next: 1 } },
    { new: true, upsert: true, select: { next: 1 } }
  );
};

export default mongoose.model('Counter', CounterSchema);
