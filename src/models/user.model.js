const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema();

const UserSchema = new Schema({
  first_name: {
    type: String,
    maxlength: 15,
    required: true
  },
  surname: {
    type: String,
    maxlength: 30
  },
  email: {
    type: String,
    maxlength: 50,
    required: true
  },
  password: {type: String, required: true},
  tokens: [
    {
      tokens: {
        type: String, 
        required: true
      }
    }
  ]
}, {
  timestamp: true,
  colletion: 'users'
});

// ==> create hash password pre save
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// ==> generate tokens
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ 
    _id: user._id,
    first_name: user.first_name,
    email: user.email
  }, 'secret');
  user.tokens = user.tokens.concat({token})
  await user.save();
  return token
};

// ==> find credentials
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne(
    {email}
  )

  if (!user) {
    throw new Error({
      error: 'Log is invalid!'
    })
  }

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    throw new Error({
      error: 'Your password is invalid!'
    })
  }
  
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User