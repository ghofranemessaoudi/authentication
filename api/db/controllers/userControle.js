var { User } = require("../models/users");

module.exports = {
  read: callbacks => {
    User.find().exec(callbacks);
  },
  update: (id, obj, callback) => {
    User.findOneAndUpdate({ _id: id }, obj, callback);
  }
};