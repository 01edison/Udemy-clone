const User = require("../models/user");

const getUser = (req, res) => {
  const { id } = req.profile;
  User.findOne({ _id: id })
    .select("-password")
    .exec((err, user) => {
      if (!err) {
        return res.json({ user });
      } else {
        return res.status(400).json({ err });
      }
    });
};

module.exports = { getUser };
