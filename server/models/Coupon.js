import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["Percentage", "Flat", "BOGO"],
      required: true,
    },

    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if coupon is expired helper method
couponSchema.methods.isExpired = function () {
  return new Date() > new Date(this.expiryDate);
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
