const bcrypt = require('bcryptjs');
const config = require('../config/config');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(config.bcryptRounds);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
