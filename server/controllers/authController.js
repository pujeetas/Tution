import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TutorProfile from '../models/TutorProfile.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  childName: user.childName,
  childLevel: user.childLevel,
});

// @desc    Register a new tutor or parent
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, childName, childLevel } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Name, email, password and role are required');
    }

    if (!['tutor', 'parent'].includes(role)) {
      res.status(400);
      throw new Error('Role must be either tutor or parent');
    }

    if (role === 'tutor' && !phone) {
      res.status(400);
      throw new Error('Phone number is required for tutors');
    }

    if (role === 'parent' && (!childName || !childLevel)) {
      res.status(400);
      throw new Error("Child's name and level are required for parents");
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      throw new Error('An account with that email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || undefined,
      childName: role === 'parent' ? childName : undefined,
      childLevel: role === 'parent' ? childLevel : undefined,
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      token: signToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user (with tutor profile if tutor)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const payload = { success: true, user: userResponse(req.user) };

    if (req.user.role === 'tutor') {
      payload.profile = await TutorProfile.findOne({ user: req.user._id });
    }

    res.json(payload);
  } catch (error) {
    next(error);
  }
};
