"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  adminUsersApi,
  type AdminUser,
  type PaginationMeta,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/app/lib/api/admin-users";

import { DeleteConfirmModal } from "@/app/components/admin/DeleteConfirmModal";
import { UserFormModal } from "@/app/components/admin/userformModel";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  console.log("currentUser:", currentUser);
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Route guard: only admins
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [authLoading, currentUser, router]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to first page on new search
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminUsersApi.list({ page, limit: PAGE_SIZE, search: debouncedSearch });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [fetchUsers, currentUser]);

  const openCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
  };

  const openEdit = (u: AdminUser) => {
    setSelectedUser(u);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (payload: CreateUserPayload | UpdateUserPayload) => {
    if (modalMode === "create") {
      await adminUsersApi.create(payload as CreateUserPayload);
    } else if (modalMode === "edit" && selectedUser) {
      await adminUsersApi.update(selectedUser.id, payload as UpdateUserPayload);
    }
    closeModal();
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminUsersApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      // if last item on page was deleted, step back a page
      if (users.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchUsers();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !currentUser) return null;
  if (currentUser.role !== "admin") return null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>User Management</h1>
          <p className="admin-sub">{meta.total} total users</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + New User
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-card">
        {loading ? (
          <div className="state-block">
            <div className="spinner" />
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="state-block">
            <span className="state-icon">👥</span>
            <p>{debouncedSearch ? "No users match your search." : "No users found."}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-sm">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.fullName ?? 'User'} />
                        ) : (
                          <span>{u.fullName?.charAt(0).toUpperCase() ?? "?"}</span>
                        )}?
                      </div>
                      <span>{u.fullName}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-badge--${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="col-actions">
                    <button className="btn-link" onClick={() => openEdit(u)}>
                      Edit
                    </button>
                    <button
                      className="btn-link btn-link--danger"
                      onClick={() => setDeleteTarget(u)}
                      disabled={u.id === currentUser.id}
                      title={u.id === currentUser.id ? "You cannot delete your own account" : ""}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && users.length > 0 && (
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

      {modalMode && (
        <UserFormModal
          mode={modalMode}
          user={selectedUser}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}