"use client";
import { useState } from "react";
import type { AdminCar, UpdateCarPayload } from "@/app/lib/api/admin-cars";

interface CarEditModalProps {
  car: AdminCar;
  onClose: () => void;
  onSubmit: (payload: UpdateCarPayload) => Promise<void>;
}

export function CarEditModal({ car, onClose, onSubmit }: CarEditModalProps) {
  const [form, setForm] = useState({
    vin: car.vin,
    year: car.year,
    make: car.make,
    carModel: car.carModel,
    bodyType: car.bodyType,
    mileage: car.mileage,
    price: car.price,
    location: car.location,
    condition: car.condition,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        vin: form.vin,
        year: Number(form.year),
        make: form.make,
        carModel: form.carModel,
        bodyType: form.bodyType,
        mileage: Number(form.mileage),
        price: Number(form.price),
        location: form.location,
        condition: form.condition,
      });
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Listing</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>VIN</label>
            <input value={form.vin} onChange={(e) => handleChange("vin", e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Make</label>
              <input value={form.make} onChange={(e) => handleChange("make", e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Model</label>
              <input
                value={form.carModel}
                onChange={(e) => handleChange("carModel", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Body Type</label>
              <select
                value={form.bodyType}
                onChange={(e) => handleChange("bodyType", e.target.value)}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mileage</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Price (Rs.)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={form.condition}
                onChange={(e) => handleChange("condition", e.target.value)}
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}