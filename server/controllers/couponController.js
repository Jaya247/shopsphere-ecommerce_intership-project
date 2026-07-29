import Coupon from "../models/Coupon.js";

// ======================================
// Create Coupon (Admin Only)
// ======================================
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minPurchase, expiryDate } = req.body;

    if (!code || !discountType || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Code, discountType, and expiryDate are required",
      });
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: discountValue || 0,
      minPurchase: minPurchase || 0,
      expiryDate: new Date(expiryDate),
    });

    res.status(201).json({
      success: true,
      message: "✅ Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Coupons (Admin/Checkout list)
// ======================================
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Coupon (Admin Only)
// ======================================
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Apply Coupon (Checkout Validation)
// ======================================
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartItems, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });
    }

    if (coupon.isExpired()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }

    if (Number(cartTotal) < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString("en-IN")} required to apply this coupon`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;

    if (coupon.discountType === "Percentage") {
      discountAmount = (Number(cartTotal) * coupon.discountValue) / 100;
    } else if (coupon.discountType === "Flat") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "BOGO") {
      // Buy One Get One Free:
      // Loop through items, find any item with quantity >= 2.
      // Free unit is the price of the item! We give discount of the highest priced eligible BOGO item.
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty, cannot apply BOGO coupon",
        });
      }

      let maxBogoDiscount = 0;
      cartItems.forEach((item) => {
        if (item.quantity >= 2) {
          if (item.price > maxBogoDiscount) {
            maxBogoDiscount = item.price;
          }
        }
      });

      if (maxBogoDiscount === 0) {
        return res.status(400).json({
          success: false,
          message: "Buy One Get One (BOGO) requires at least 2 units of the same item in your cart",
        });
      }

      discountAmount = maxBogoDiscount;
    }

    // Prevent discount from exceeding total
    if (discountAmount > Number(cartTotal)) {
      discountAmount = Number(cartTotal);
    }

    res.status(200).json({
      success: true,
      message: "✅ Coupon applied successfully",
      discountAmount,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
