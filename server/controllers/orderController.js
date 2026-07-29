import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ======================================
// Place Order
// ======================================
export const placeOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Order Items",
      });
    }

    const order = await Order.create({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Orders
// ======================================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Order
// ======================================
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name images price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Orders
// ======================================
export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Order Status
// ======================================
export const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    const { status } = req.body;

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Status Updated Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Payment Status
// ======================================
export const updatePaymentStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment Updated Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Order
// ======================================
export const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Request Return / Exchange (Customer)
// ======================================
export const requestOrderReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, images } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }

    order.returnRequest = {
      status: "Requested",
      action: action || "Return",
      reason: reason || "",
      images: images || [],
    };

    // If it's a direct cancellation before dispatch, we can approve automatically
    if (action === "Cancel" && order.status === "Pending") {
      order.returnRequest.status = "Completed";
      order.status = "Cancelled";
      if (order.isPaid) {
        order.refundRequest = {
          status: "Approved",
          reason: "Auto-approved refund for cancellation",
        };
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: action === "Cancel" ? "Order Cancelled successfully" : "Return request submitted successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// Request Refund (Customer)
// ======================================
export const requestOrderRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }

    order.refundRequest = {
      status: "Requested",
      reason: reason || "",
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// Process Return / Exchange (Admin / Seller)
// ======================================
export const processOrderReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Completed, Rejected

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }

    order.returnRequest.status = status;

    if (status === "Completed") {
      if (order.returnRequest.action === "Return") {
        // Automatically request a refund if user paid online or COD refund approval
        order.refundRequest.status = "Approved";
        order.refundRequest.reason = "Approved after product return verification";
      } else if (order.returnRequest.action === "Exchange") {
        // Create an exchange delivery status
        order.status = "Processing";
        order.returnRequest.status = "Completed";
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Return request marked as ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// Process Refund (Admin / Seller) - Simulates Razorpay Refund API
// ======================================
export const processOrderRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Refunded, Rejected

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order Not Found" });
    }

    order.refundRequest.status = status;

    if (status === "Refunded") {
      // Simulate Razorpay Refund API Call Success
      order.refundRequest.refundId = "REF_RPAY_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      order.isPaid = false; // Flag status as refunded (reverted payment)
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Refund status processed: ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};