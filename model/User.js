const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   first_name: { type: String, required: true },
   last_name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   age: { type: Number, required: true },
   password: { type: String, required: true },
   cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
   role: { type: String, default: 'user' }
});


userSchema.pre('save', function(next) {
   if (!this.isModified('password')) return next();
   this.password = bcrypt.hashSync(this.password, 10);
   next();const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  age: { type: Number, required: true, min: 18 },
  password: { type: String, required: true, minlength: 8 },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.pre('save', function (next) {
   if (!this.isModified('password')) return next();
   this.password = bcrypt.hashSync(this.password, 10);
   next();
 });

const User = mongoose.model('User', userSchema);

module.exports = User;
