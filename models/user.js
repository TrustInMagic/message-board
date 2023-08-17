const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 3 },
  last_name: { type: String, required: true, minLength: 3 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership: {
    type: String,
    required: true,
    enum: ['regular', 'member', 'admin'],
    default: 'regular',
  },
});

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('User', UserSchema);
