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

// @desc    List students this tutor/centre has added (org-wide for centres),
//          with search/level/status filtering and pagination
// @route   GET /api/students/added
// @access  Private (tutor, centre)
export const listAddedStudents = async (req, res, next) => {
  try {
    const { search, level, status, page = 1, limit = 10 } = req.query;

    const scope =
      req.user.role === 'centre' && req.user.organization
        ? { organization: req.user.organization }
        : { addedBy: req.user._id };

    const filter = { ...scope };
    if (level) filter.level = level;
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: re }, { phone: re }];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('parent', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      students,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk-delete students this tutor/centre added (org-scoped for centres)
// @route   POST /api/students/bulk-delete
// @access  Private (tutor, centre)
export const bulkDeleteStudents = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error('ids must be a non-empty array');
    }

    const scope =
      req.user.role === 'centre' && req.user.organization
        ? { organization: req.user.organization }
        : { addedBy: req.user._id };

    const result = await Student.deleteMany({ _id: { $in: ids }, ...scope });
    res.json({ success: true, deletedCount: result.deletedCount });
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
    const {
      studentName,
      level,
      dob,
      phone,
      gender,
      email,
      homeAddress,
      postalCode,
      schoolName,
      parentName,
      parentEmail,
      parentPhone,
      parentPassword,
      parentDob,
    } = req.body;

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
      if (!parentName || !parentPhone || !parentPassword || !parentDob) {
        res.status(400);
        throw new Error(
          "Parent name, date of birth, phone and password are required to create a new parent account"
        );
      }
      parent = await User.create({
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        password: parentPassword,
        dob: parentDob,
        role: 'parent',
      });
      createdNewParent = true;
    }

    const student = await Student.create({
      parent: parent._id,
      name: studentName,
      level,
      dob: dob || undefined,
      phone: phone || '',
      gender: gender || '',
      email: email || '',
      homeAddress: homeAddress || '',
      postalCode: postalCode || '',
      schoolName: schoolName || '',
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
