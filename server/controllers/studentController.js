import Student from '../models/Student.js';
import User from '../models/User.js';

// @desc    List own students
// @route   GET /api/students/me
// @access  Private (parent)
export const listMyStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ parent: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// @desc    List students this tutor/centre has added (org-wide for centres)
// @route   GET /api/students/added
// @access  Private (tutor, centre)
export const listAddedStudents = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'centre' && req.user.organization
        ? { organization: req.user.organization }
        : { addedBy: req.user._id };

    const students = await Student.find(filter)
      .populate('parent', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a student on a parent's behalf. If a parent account already
//          exists with the given email, the student is linked to it;
//          otherwise a new parent account is created with the given password
//          (mirrors how centre admins create staff tutor accounts directly,
//          since there's no email-invite delivery yet).
// @route   POST /api/students/add-for-parent
// @access  Private (tutor, centre)
export const addStudentForParent = async (req, res, next) => {
  try {
    const { studentName, level, parentName, parentEmail, parentPhone, parentPassword } =
      req.body;

    if (!studentName || !level || !parentEmail) {
      res.status(400);
      throw new Error("Student's name, level and parent email are required");
    }

    let parent = await User.findOne({ email: parentEmail.toLowerCase() });
    let createdNewParent = false;

    if (parent && parent.role !== 'parent') {
      res.status(409);
      throw new Error('That email already belongs to a non-parent account');
    }

    if (!parent) {
      if (!parentName || !parentPhone || !parentPassword) {
        res.status(400);
        throw new Error(
          'Parent name, phone and password are required to create a new parent account'
        );
      }
      parent = await User.create({
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        password: parentPassword,
        role: 'parent',
      });
      createdNewParent = true;
    }

    const student = await Student.create({
      parent: parent._id,
      name: studentName,
      level,
      addedBy: req.user._id,
      organization: req.user.organization || null,
    });

    res.status(201).json({
      success: true,
      student,
      parent: { id: parent._id, name: parent.name, email: parent.email },
      createdNewParent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private (parent)
export const createStudent = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      res.status(400);
      throw new Error("Student's name and level are required");
    }

    const student = await Student.create({ parent: req.user._id, name, level });
    res.status(201).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own student
// @route   PATCH /api/students/:id
// @access  Private (parent)
export const updateStudent = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, parent: req.user._id },
      { name, level },
      { new: true, runValidators: true }
    );

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own student
// @route   DELETE /api/students/:id
// @access  Private (parent)
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, parent: req.user._id });

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
