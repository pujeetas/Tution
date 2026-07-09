import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TutorProfile from '../models/TutorProfile.js';
import Organization from '../models/Organization.js';
import Student from '../models/Student.js';

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
  dob: user.dob,
  organization: user.organization || null,
  onboardingComplete: user.onboardingComplete,
  registrationForms: user.registrationForms,
  formConfig: user.formConfig,
});

// @desc    Register a new tutor, parent or centre
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      dob,
      organizationName,
      registrationNo,
      orgPhone,
    } = req.body;

    if (!name || !email || !password || !role || !phone || !dob) {
      res.status(400);
      throw new Error('Name, email, password, role, phone number and date of birth are required');
    }

    if (!['tutor', 'parent', 'centre'].includes(role)) {
      res.status(400);
      throw new Error('Role must be tutor, parent or centre');
    }

    if (role === 'centre' && (!organizationName || !orgPhone)) {
      res.status(400);
      throw new Error('Organization name and phone number are required for centres');
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
      phone,
      dob,
    });

    if (role === 'centre') {
      const organization = await Organization.create({
        name: organizationName,
        registrationNo,
        phone: orgPhone,
        owner: user._id,
      });
      user.organization = organization._id;
      await user.save();
    }

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

// @desc    Complete the post-signup "Getting Started" step by choosing which
//          registration forms are active (Student always on; Admin Form is
//          only meaningful for centres with a team to register)
// @route   PATCH /api/auth/onboarding
// @access  Private (tutor, centre)
export const completeOnboarding = async (req, res, next) => {
  try {
    if (!['tutor', 'centre'].includes(req.user.role)) {
      res.status(403);
      throw new Error('Onboarding only applies to tutor and centre accounts');
    }

    const { admin } = req.body;

    req.user.registrationForms = {
      student: true,
      // An individual tutor has no team to register, so Admin Form never applies.
      admin: req.user.role === 'centre' ? Boolean(admin) : false,
    };
    req.user.onboardingComplete = true;
    await req.user.save();

    res.json({ success: true, user: userResponse(req.user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Save one form type's field configuration from the Form Builder
//          (Student or Admin registration form)
// @route   PATCH /api/auth/form-config
// @access  Private (tutor, centre)
export const saveFormConfig = async (req, res, next) => {
  try {
    if (!['tutor', 'centre'].includes(req.user.role)) {
      res.status(403);
      throw new Error('Form customisation only applies to tutor and centre accounts');
    }

    const { formType, sections } = req.body;
    if (!['student', 'admin'].includes(formType) || !sections) {
      res.status(400);
      throw new Error('formType (student or admin) and sections are required');
    }

    req.user.formConfig = {
      ...(req.user.formConfig || {}),
      [formType]: sections,
    };
    await req.user.save();

    res.json({ success: true, user: userResponse(req.user) });
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

    if (req.user.organization) {
      payload.organization = await Organization.findById(req.user.organization).select(
        'name registrationNo phone'
      );
    }

    if (req.user.role === 'parent') {
      payload.students = await Student.find({ parent: req.user._id }).sort({ createdAt: -1 });
    }

    res.json(payload);
  } catch (error) {
    next(error);
  }
};
