import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Check if the model is already defined
const User = mongoose.models.User || (() => {
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default: 'default-profile.jpg'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  });

  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Method to compare password
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return mongoose.model('User', userSchema);
})();

export default User;
