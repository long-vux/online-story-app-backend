const Category = require("../models/Category");

// [POST] /api/categories
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Tên danh mục là bắt buộc!" });

    const requester = req.user;
    if (requester.role !== "Admin") return res.status(403).json({ message: "Bạn không có quyền truy cập!" });

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: "Danh mục đã tồn tại!" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Danh mục được tạo thành công!", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [GET] /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [GET] /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [PUT] /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại!" });

    const requester = req.user;
    if (requester.role !== "Admin") return res.status(403).json({ message: "Bạn không có quyền truy cập!" });

    category.name = name || category.name;

    await category.save();
    res.status(200).json({ message: "Cập nhật danh mục thành công!", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [DELETE]  /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại!" });

    const requester = req.user;
    if (requester.role !== "Admin") return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
