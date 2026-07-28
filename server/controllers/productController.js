import mongoose from "mongoose";
import Product from "../models/Product.js";

// =============================
// Add Product
// =============================
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      price,
      discount,
      stock,
      rating,
      numReviews,
      images,
      featured,
    } = req.body;

    const product = await Product.create({
      name,
      brand,
      description,
      category,
      price,
      discount,
      stock,
      rating,
      numReviews,
      images,
      featured,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Products (Search + Filter + Sort + Pagination)
// =============================
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const brand = req.query.brand || "";
    const rating = Number(req.query.rating) || 0;
    const sort = req.query.sort || "";

    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice =
      Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Brand
    if (brand) {
      query.brand = brand;
    }

    // Price
    query.price = {
      $gte: minPrice,
      $lte: maxPrice,
    };

    // Rating
    if (rating) {
      query.rating = {
        $gte: rating,
      };
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "low") {
      sortOption = { price: 1 };
    }

    if (sort === "high") {
      sortOption = { price: -1 };
    }

    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    const totalProducts =
      await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
    
// =============================
// Get Single Product
// =============================
export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Product
// =============================
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    product.name = req.body.name ?? product.name;
    product.brand = req.body.brand ?? product.brand;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;
    product.price = req.body.price ?? product.price;
    product.discount = req.body.discount ?? product.discount;
    product.stock = req.body.stock ?? product.stock;
    product.rating = req.body.rating ?? product.rating;
    product.numReviews =
      req.body.numReviews ?? product.numReviews;
    product.images = req.body.images ?? product.images;
    product.featured = req.body.featured ?? product.featured;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Product
// =============================
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Featured Products
// =============================
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// New Arrivals
// =============================
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Best Sellers
// =============================
export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Search Products
// =============================
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const products = await Product.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// Get Categories
// =============================
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};