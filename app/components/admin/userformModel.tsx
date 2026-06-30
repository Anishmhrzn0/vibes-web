"use client";
import { useState, useEffect, FormEvent } from "react";
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from "@/app/lib/api/admin-users";

interface Props {
  mode: "create" | "edit";
  user?: AdminUser | null;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
}

const emptyForm: FormState = { fullName: "", email: "", phone: "", password: "", role: "user" };

export function UserFormModal({ mode, user, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (mode === "edit" && user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        password: "",
        role: user.role,
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, user]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (mode === "create" && form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    if (mode === "edit" && form.password && form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CreateUserPayload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          role: form.role,
        };
        await onSubmit(payload);
      } else {
        const payload: UpdateUserPayload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await onSubmit(payload);
      }
    } catch (err: any) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "create" ? "Create User" : "Edit User"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Jane Doe"
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+977-98XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "user" | "admin" }))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {mode === "create" ? "Password" : "New Password"}
              {mode === "edit" && <span className="readonly-badge">optional</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder={mode === "create" ? "At least 6 characters" : "Leave blank to keep current"}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}