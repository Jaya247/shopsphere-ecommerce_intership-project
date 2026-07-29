import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["User", "Admin", "Manager", "Seller", "Delivery Partner"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.role === "Admin") {
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }
  if (typeof next === "function") next();
});

const User = mongoose.model("User", userSchema);

export default User;