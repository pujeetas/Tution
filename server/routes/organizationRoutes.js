import express from 'express';
import {
  getMyOrganization,
  updateMyOrganization,
  createStaffTutor,
  listStaff,
  bulkDeleteStaff,
  getStaffOptions,
  listOrgAdmins,
  createOrgAdmin,
  bulkDeleteAdmins,
} from '../controllers/organizationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, authorize('centre'), getMyOrganization);
router.patch('/me', protect, authorize('centre'), updateMyOrganization);
router.get('/me/staff', protect, authorize('centre'), listStaff);
router.post('/staff', protect, authorize('centre'), createStaffTutor);
router.post('/staff/bulk-delete', protect, authorize('centre'), bulkDeleteStaff);
router.get('/meta/options', protect, authorize('centre'), getStaffOptions);
router.get('/admins', protect, authorize('centre'), listOrgAdmins);
router.post('/admins', protect, authorize('centre'), createOrgAdmin);
router.post('/admins/bulk-delete', protect, authorize('centre'), bulkDeleteAdmins);

export default router;
