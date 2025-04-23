const GenreRepository = require('../repositories/genreRepository');
const Story = require("../models/Story");

// [POST] /api/genres
const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Tên danh mục là bắt buộc!" });

    const existingGenre = await GenreRepository.findOne({ name });
    if (existingGenre) return res.status(400).json({ message: "Danh mục đã tồn tại!" });

    const genre = await GenreRepository.create({ name });
    res.status(201).json({ message: "Danh mục được tạo thành công!", genre });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [GET] /api/genres
const getGenres = async (req, res) => {
  try {
    const genres = await GenreRepository.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [GET] /api/genres/:id
const getGenreById = async (req, res) => {
  try {
    const genre = await GenreRepository.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [PUT] /api/genres/:id
const updateGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const genre = await GenreRepository.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Danh mục không tồn tại!" });
    
    genre.name = name || genre.name;
    await genre.save();

    res.status(200).json({ message: "Cập nhật danh mục thành công!", genre });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [DELETE]  /api/genres/:id
const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    
    const genre = await GenreRepository.findById(id);
    if (!genre) return res.status(404).json({ message: "Danh mục không tồn tại!" });

    await GenreRepository.deleteById(id);
    res.status(200).json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// [GET] /api/genres/:id/stories
const getStoriesByGenre = async (req, res) => {
  try {
    const { genreName } = req.params;

    const stories = await Story.find({ genre: genreName });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

module.exports = { 
  createGenre, 
  getGenres, 
  getGenreById, 
  updateGenre, 
  deleteGenre, 
  getStoriesByGenre 
};
