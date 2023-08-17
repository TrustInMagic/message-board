const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formatDate = require('../utils/format-date');

const PostSchema = new Schema({
  title: { type: String },
  timestamp: { type: Date },
  text: { type: String, required: true, maxLength: 50 },
  poster: { type: Schema.Types.ObjectId, ref: 'User' },
});

PostSchema.virtual('formatted_timestamp').get(function () {
  return formatDate(this.timestamp);
});

module.exports = mongoose.model('Post', PostSchema);
