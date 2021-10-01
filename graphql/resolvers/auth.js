const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async args => {
    const { email, password} = args;
    const user = await User.findOne({ email: email });
    if(!user) {
      throw new Error("No user found");
    }
    const correctPass = await bcrypt.compare(password, user.password);
    if(!correctPass) throw new Error('Incorrect Password');
    const token = jwt.sign({ userId: user.Id, email: user.email }, 'somekey', {
      expiresIn: '1hr'
    });
    return {
      userId: user.Id,
      token: token,
      tokenExpiration: 1
    };
  }
};