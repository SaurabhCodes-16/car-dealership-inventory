import { Router } from 'express';
import {
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  getUserPurchases
} from '../controllers/vehicle.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { purchaseRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All vehicle & inventory routes are protected as required by specification
router.use(requireAuth);

// Search and Purchase history routes (declared before :id parameter)
router.get('/search', searchVehicles);
router.get('/purchases/me', getUserPurchases);

// Collection endpoints
router.get('/', getAllVehicles);
router.post('/', addVehicle);

// Single vehicle item endpoints
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', requireAdmin, deleteVehicle);

// Inventory endpoints
router.post('/:id/purchase', purchaseRateLimiter, purchaseVehicle);
router.post('/:id/restock', requireAdmin, restockVehicle);

export default router;
