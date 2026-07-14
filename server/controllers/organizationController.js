import User from '../models/User.js';
import Organization from '../models/Organization.js';
import TutorProfile, { SUBJECTS, LEVELS, TEACHING_MODES } from '../models/TutorProfile.js';

// @desc    Get own organization profile
// @route   GET /api/organizations/me
// @access  Private (centre)
export const getMyOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.user.organization);
    res.json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own organization profile
// @route   PATCH /api/organizations/me
// @access  Private (centre)
export const updateMyOrganization = async (req, res, next) => {
  try {
    const { name, registrationNo, phone } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      req.user.organization,
      { name, registrationNo, phone },
      { new: true, runValidators: true }
    );

    if (!organization) {
      res.status(404);
      throw new Error('Organization not found');
    }

    res.json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

// @desc    List staff tutors belonging to this organization
// @route   GET /api/organizations/me/staff
// @access  Private (centre)
export const listStaff = async (req, res, next) => {
  try {
    const staff = await TutorProfile.find({ organization: req.user.organization })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: staff.length, staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk-remove staff tutors from this organization — deletes both the
//          TutorProfile and the underlying User login account. `ids` are
//          TutorProfile ids (what the staff list/table key on), not user ids.
//          Classes/Bookings that already reference the removed tutor keep
//          their stored id as a dangling reference rather than being
//          rewritten, matching the same tolerance already used for deleted
//          Students elsewhere in the app.
// @route   POST /api/organizations/staff/bulk-delete
// @access  Private (centre)
export const bulkDeleteStaff = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error('ids must be a non-empty array');
    }

    const profiles = await TutorProfile.find({
      _id: { $in: ids },
      organization: req.user.organization,
    });

    await TutorProfile.deleteMany({ _id: { $in: profiles.map((p) => p._id) } });
    const result = await User.deleteMany({
      _id: { $in: profiles.map((p) => p.user) },
      role: 'tutor',
      organization: req.user.organization,
    });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a staff tutor account under this organization
// @route   POST /api/organizations/staff
// @access  Private (centre)
export const createStaffTutor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      subjects,
      levels,
      teachingMode,
      hourlyRate,
      bio,
      yearsExperience,
    } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400);
      throw new Error('Name, email, password and phone are required');
    }

    if (!subjects?.length || !levels?.length || !teachingMode || !hourlyRate) {
      res.status(400);
      throw new Error('Subjects, levels, teaching mode and hourly rate are required');
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      throw new Error('An account with that email already exists');
    }

    const tutor = await User.create({
      name,
      email,
      password,
      phone,
      role: 'tutor',
      organization: req.user.organization,
    });

    const profile = await TutorProfile.create({
      user: tutor._id,
      organization: req.user.organization,
      subjects,
      levels,
      teachingMode,
      hourlyRate,
      bio,
      yearsExperience,
    });

    res.status(201).json({
      success: true,
      tutor: { id: tutor._id, name: tutor.name, email: tutor.email, phone: tutor.phone },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter option lists (subjects, levels, modes) for the staff tutor form
// @route   GET /api/organizations/meta/options
// @access  Private (centre)
export const getStaffOptions = (req, res) => {
  res.json({
    success: true,
    subjects: SUBJECTS,
    levels: LEVELS,
    teachingModes: TEACHING_MODES,
  });
};

// @desc    List admin accounts belonging to this organization, with search
//          and pagination (the org creator is flagged isOwner for display
//          only — every admin has identical full access, there's no
//          permission tiering yet)
// @route   GET /api/organizations/admins
// @access  Private (centre)
export const listOrgAdmins = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const organization = await Organization.findById(req.user.organization);

    const filter = { organization: req.user.organization, role: 'centre' };
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: re }, { email: re }];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    const [admins, total] = await Promise.all([
      User.find(filter)
        .select('name email phone createdAt')
        .sort({ createdAt: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    const withOwnerFlag = admins.map((admin) => ({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      createdAt: admin.createdAt,
      isOwner: admin._id.toString() === organization.owner.toString(),
    }));

    res.json({
      success: true,
      admins: withOwnerFlag,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk-delete admin accounts under this organization. The
//          organization owner is always excluded from the delete filter —
//          never deletable via this endpoint — which also guarantees at
//          least one admin always remains (no lockout scenario possible).
// @route   POST /api/organizations/admins/bulk-delete
// @access  Private (centre)
export const bulkDeleteAdmins = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error('ids must be a non-empty array');
    }

    const organization = await Organization.findById(req.user.organization);

    const result = await User.deleteMany({
      _id: { $in: ids, $ne: organization.owner },
      organization: req.user.organization,
      role: 'centre',
    });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create another admin account under this organization (attaches to
//          the existing organization rather than creating a new one)
// @route   POST /api/organizations/admins
// @access  Private (centre)
export const createOrgAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400);
      throw new Error('Name, email, password and phone are required');
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      throw new Error('An account with that email already exists');
    }

    // The org this admin is joining has already been through onboarding
    // (registration forms set up etc.) — inherit that state from the admin
    // who's creating them rather than making the new admin redo the
    // Getting Started checklist for an org that's already set up.
    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: 'centre',
      organization: req.user.organization,
      onboardingComplete: true,
      registrationForms: req.user.registrationForms,
      formConfig: req.user.formConfig,
    });

    res.status(201).json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, phone: admin.phone },
    });
  } catch (error) {
    next(error);
  }
};
