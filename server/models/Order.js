import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    taxPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ======================================
    // New Fields for Expansion
    // ======================================
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deliveryLocation: {
      lat: { type: Number, default: 28.6139 }, // Default to New Delhi coordinates
      lng: { type: Number, default: 77.2090 },
      liveStatus: { type: String, default: "Order Placed" },
    },

    refundRequest: {
      status: {
        type: String,
        enum: ["None", "Requested", "Approved", "Refunded", "Rejected"],
        default: "None",
      },
      reason: { type: String, default: "" },
      refundId: { type: String, default: "" },
    },

    returnRequest: {
      status: {
        type: String,
        enum: ["None", "Requested", "Approved", "Completed", "Rejected"],
        default: "None",
      },
      reason: { type: String, default: "" },
      action: {
        type: String,
        enum: ["Return", "Exchange", "Cancel"],
        default: "Return",
      },
      images: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;