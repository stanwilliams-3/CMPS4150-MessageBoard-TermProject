import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.statics.usernameMapByIds = async function usernameMapByIds(ids) {
  if (!ids?.length) {
    return new Map();
  }
  const rows = await this.find({ _id: { $in: ids } })
    .select("username")
    .lean();
  const map = new Map();
  for (const row of rows) {
    map.set(String(row._id), row.username);
  }
  return map;
};

const User = mongoose.model("User", userSchema);

export default User;