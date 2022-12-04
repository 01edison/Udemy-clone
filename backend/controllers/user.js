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

const becomeInstructor = async (req, res) => {
  const { id } = req.profile;
  const { secretKey } = req.body;

  const user = await User.findById(id);

  if (!user.role.includes("Instructor")) {
    user.paystackPublicKey = secretKey;
    user.role.push("Instructor");

    user.save((err) => {
      if (!err) return res.json({ msg: "Successfully migrated to Instructor" });
      else {
        return res.status(400).json({ err });
      }
    });
  } else {
    return res.status(400).json({ err: "User is already an instructor" });
  }
};

module.exports = { getUser, becomeInstructor };
