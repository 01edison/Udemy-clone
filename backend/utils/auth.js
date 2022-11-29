const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const comparePassword = (password, hashedPassword) => {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
};

module.exports = { hashPassword, comparePassword };
