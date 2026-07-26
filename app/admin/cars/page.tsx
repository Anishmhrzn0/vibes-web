"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  adminCarsApi,
  type AdminCar,
  type CarPaginationMeta,
  type UpdateCarPayload,
} from "@/app/lib/api/admin-cars";
import { CarEditModal } from "@/app/components/admin/CarEditModal";
import "../users/admin-users.css";

const PAGE_SIZE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getDisplayStatus(car: AdminCar) {
  if (car.soldAt) return { label: "Sold", cls: "role-badge--admin" };
  if (car.isBooked) return { label: "Booked", cls: "role-badge--admin" };
  if (car.status === "active") return { label: "Active", cls: "role-badge--user" };
  if (car.status === "rejected") return { label: "Rejected", cls: "role-badge--danger" };
  return { label: "Pending", cls: "role-badge--user" };
}

export default function AdminCarsPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [cars, setCars] = useState<AdminCar[]>([]);
  const [meta, setMeta] = useState<CarPaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editTarget, setEditTarget] = useState<AdminCar | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminCar | null>(null);

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCarsApi.list({ page, limit: PAGE_SIZE, search: debouncedSearch });
      setCars(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || "Failed to load cars");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchCars();
    }
  }, [fetchCars, currentUser]);

  const handleEditSubmit = async (payload: UpdateCarPayload) => {
    if (!editTarget) return;
    await adminCarsApi.update(editTarget._id, payload);
    setEditTarget(null);
    fetchCars();
  };

  if (authLoading || !currentUser) return null;
  if (currentUser.role !== "admin") return null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Vehicle Management</h1>
          <p className="admin-sub">{meta.total} total listings</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by make, model, or VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-card">
        {loading ? (
          <div className="state-block">
            <div className="spinner" />
            <p>Loading listings...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="state-block">
            <span className="state-icon">🚗</span>
            <p>{debouncedSearch ? "No listings match your search." : "No listings found."}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const displayStatus = getDisplayStatus(car);
                const thumb = car.images?.[0]
                  ? car.images[0].startsWith("http")
                    ? car.images[0]
                    : `${API_BASE}${car.images[0]}`
                  : undefined;
                return (
                  <tr key={car._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {thumb ? <img src={thumb} alt={car.make} /> : <span>🚗</span>}
                        </div>
                        <span>
                          {car.year} {car.make} {car.carModel}
                        </span>
                      </div>
                    </td>
                    <td>
                      {car.sellerId?.fullName ?? "Unknown"}
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {car.sellerId?.email ?? ""}
                      </div>
                    </td>
                    <td>Rs.{car.price.toLocaleString()}</td>
                    <td>
                      <span className={`role-badge ${displayStatus.cls}`}>
                        {displayStatus.label}
                      </span>
                    </td>
                    <td className="col-actions">
                      <button className="btn-link" onClick={() => setDetailTarget(car)}>
                        View
                      </button>
                      <button className="btn-link" onClick={() => setEditTarget(car)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && cars.length > 0 && (
        <div className="pagination">
          <button
            className="btn-secondary"
            disabled={meta.page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={meta.page >= meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}

      {editTarget && (
        <CarEditModal
          car={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {detailTarget && (
        <div className="modal-overlay" onClick={() => setDetailTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {detailTarget.year} {detailTarget.make} {detailTarget.carModel}
            </h2>
            <div className="form-group">
              <label>VIN</label>
              <p>{detailTarget.vin}</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mileage</label>
                <p>{detailTarget.mileage.toLocaleString()} mi</p>
              </div>
              <div className="form-group">
                <label>Price</label>
                <p>Rs.{detailTarget.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Condition</label>
                <p>{detailTarget.condition}</p>
              </div>
              <div className="form-group">
                <label>Location</label>
                <p>{detailTarget.location}</p>
              </div>
            </div>
            <div className="form-group">
              <label>Seller</label>
              <p>
                {detailTarget.sellerId?.fullName ?? "Unknown"} —{" "}
                {detailTarget.sellerId?.email ?? "n/a"}
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDetailTarget(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}