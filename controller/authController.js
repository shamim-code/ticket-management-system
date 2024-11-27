const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ 
      status: 'success', 
      message: 'User registered successfully', 
      userId: user._id 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ 
      status: 'success', 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
