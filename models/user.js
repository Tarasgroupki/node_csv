const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  second_name: String,
  date_of_birth: Date,
  description: String,
  sex: {
    type: String,
    enum: ['men', 'women'],
  }
});

module.exports = mongoose.model('User', userSchema);
