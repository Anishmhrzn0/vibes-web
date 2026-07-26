"use client";
import { useState, FormEvent, useRef, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";
import s from "./profile-edit.module.css";

export default function ProfileEditPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const { loading: authLoading } = useProtectedRoute();
  const [fullName, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading || !user) return null;

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      if (fullName) formData.append("fullName", fullName);
      if (phone) formData.append("phone", phone);
      if (bio) formData.append("bio", bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/auth/update", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.user);
      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/home"), 1500);
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <Link href="/home" className={s.backBtn}>← Back</Link>
        <h1 className={s.headerTitle}>Edit Profile</h1>
      </div>

      <div className={s.formCard}>
        {success && <div className={`${s.alert} ${s.alertSuccess}`}>{success}</div>}
        {error && <div className={`${s.alert} ${s.alertError}`}>{error}</div>}

        <div className={s.avatarUploadSection}>
          <div
            className={s.avatarUploadCircle}
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" />
            ) : (
              <span className={s.avatarPlaceholder}>
                {user?.fullName?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
            <div className={s.avatarOverlay}>
              <span>📷 Change</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <p className={s.avatarHint}>Click to upload (max 5MB)</p>
        </div>

        <form onSubmit={handleSubmit} className={s.profileForm}>
          <div className={s.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className={s.formGroup}>
            <label>Email <span className={s.readonlyBadge}>read-only</span></label>
            <input type="email" value={user?.email || ""} disabled />
          </div>

          <div className={s.formGroup}>
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977-98XXXXXXXX"
            />
          </div>

          <div className={s.formGroup}>
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={3}
            />
          </div>

          <div className={s.formActions}>
            <Link href="/home" className={s.btnSecondary}>Cancel</Link>
            <button type="submit" className={s.btnPrimary} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}