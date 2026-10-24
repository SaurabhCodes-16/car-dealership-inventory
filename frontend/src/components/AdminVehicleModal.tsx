import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { useInventory } from '../context/InventoryContext';
import { X, Plus, Edit2, ShieldAlert } from 'lucide-react';

interface AdminVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editVehicle: Vehicle | null;
}

export const AdminVehicleModal: React.FC<AdminVehicleModalProps> = ({
  isOpen,
  onClose,
  editVehicle,
}) => {
  const { addVehicle, updateVehicle } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '',
    year: new Date().getFullYear().toString(),
    vin: '',
    mileage: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    if (editVehicle) {
      setFormData({
        make: editVehicle.make,
        model: editVehicle.model,
        category: editVehicle.category,
        price: editVehicle.price.toString(),
        quantity: editVehicle.quantity.toString(),
        year: (editVehicle.year || 2024).toString(),
        vin: editVehicle.vin || '',
        mileage: (editVehicle.mileage || 0).toString(),
        fuelType: editVehicle.fuelType || 'Gasoline',
        transmission: editVehicle.transmission || 'Automatic',
        imageUrl: editVehicle.imageUrl || '',
        description: editVehicle.description || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: 'Sedan',
        price: '',
        quantity: '1',
        year: new Date().getFullYear().toString(),
        vin: '',
        mileage: '',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        imageUrl: '',
        description: '',
      });
    }
    setError(null);
  }, [editVehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.make.trim() || !formData.model.trim()) {
      setError('Make and model are required fields.');
      return;
    }

    const priceNum = Number(formData.price);
    const qtyNum = Number(formData.quantity);

    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    if (isNaN(qtyNum) || qtyNum < 0 || !Number.isInteger(qtyNum)) {
      setError('Quantity must be a non-negative whole integer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Vehicle> = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category,
        price: priceNum,
        quantity: qtyNum,
        year: formData.year ? Number(formData.year) : undefined,
        vin: formData.vin.trim() || undefined,
        mileage: formData.mileage ? Number(formData.mileage) : 0,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        imageUrl: formData.imageUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (editVehicle) {
        await updateVehicle(editVehicle.id, payload);
      } else {
        await addVehicle(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-soft-hover overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              {editVehicle ? <Edit2 className="w-4 h-4 text-champagne-300" /> : <Plus className="w-4 h-4 text-champagne-300" />}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-stone-900">
                {editVehicle ? 'Update Vehicle Record' : 'Add Vehicle to Fleet'}
              </h3>
              <p className="text-xs text-stone-500">Administrator Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Make & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Make *</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g. Porsche, Genesis"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Model *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Taycan 4S, GV80"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Category, Price & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Truck">Truck</option>
                <option value="Luxury">Luxury</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Price ($) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 85000"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Stock Units *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 3"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Year, Mileage & VIN */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Model Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Mileage (mi)</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">VIN Code</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="VIN-XXXX"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Powertrain / Fuel</label>
              <input
                type="text"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                placeholder="Dual Motor EV / Twin-Turbo V6"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Transmission</label>
              <input
                type="text"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                placeholder="8-Speed Automatic"
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Vehicle Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Description / Editorial Notes</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Vehicle condition, package options, upholstery details..."
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 transition-soft shadow-soft font-medium"
            >
              {isSubmitting ? 'Saving...' : editVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
