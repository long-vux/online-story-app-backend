const User = require('../models/User');

class UserRepository {

    // Find all users
    static async findAll() {
        try {
            return await User.find().select("-password");
        } catch (error) {
            throw new Error('Error in findAll: ' + error.message);
        }
    }

    static async findOne(query) {
        try {
            return await User.findOne(query);
        } catch (error) {
            throw new Error('Error in findOne: ' + error.message);
        }
    }

    // Find a user by their ID
    static async findById(id) {
        try {
            return await User.findById(id).select("-password");
        } catch (error) {
            throw new Error('Error in findById: ' + error.message);
        }
    }

    // Create a new user
    static async create(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error in create: ' + error.message);
        }
    }

    // Update a user by their ID
    static async update(id, updateData) {
        try {
            return await User.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error in update: ' + error.message);
        }
    }

    // Delete a user by their ID
    static async delete(id) {
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error in delete: ' + error.message);
        }
    }

    // In your AuthRepository class
    static async exists(id) {
        try {
            return await User.findById(id); // or User.exists({ _id: id });
        } catch (error) {
            throw new Error('Error in exists: ' + error.message);
        }
    }
    
    // Update the avatar of the user
    static async updateAvatar(userId, filename) {
        const user = await this.findById(userId);
        if (user) {
          user.avatar = filename;
          await user.save();
          return user;
        }
        return null;
      }
    
}

module.exports = UserRepository;
