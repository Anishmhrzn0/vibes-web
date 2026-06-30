"use client";
import type { AdminUser } from "@/app/lib/api/admin-users";

interface Props {
  user: AdminUser;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export function DeleteConfirmModal({ user, onCancel, onConfirm, deleting }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card modal-card--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete User</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <p className="confirm-text">
          Are you sure you want to delete <strong>{user.fullName}</strong> ({user.email})?
          This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}