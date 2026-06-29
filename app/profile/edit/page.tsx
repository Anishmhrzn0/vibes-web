"use client";
import { useState, FormEvent, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/api/auth/auth.api";
import { useAuth } from "@/app/context/AuthContext";
import { useProtectedRoute } from "@/app/router/protected.route";
import { useEffect } from "react";


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
    if (phone)    formData.append("phone", phone);
    if (bio)      formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);
    
    const res = await fetch("/api/auth/update", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    setUser(data.user);         // ✅ update context
    setSuccess("Profile updated successfully!");
    setTimeout(() => router.push("/dashboard"), 1500);
  } catch (err: any) {
    setError(err.message || "Update failed");
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="page-container">
            <div className="page-header">
                <Link href="/dashboard" className="back-btn">← Back</Link>
                <h1>Edit Profileee</h1>
            </div>

            <div className="form-card">
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <div className="avatar-upload-section">
                    <div
                        className="avatar-upload-circle"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar preview" />
                        ) : (
                            <span className="avatar-placeholder">
                                {user?.fullName?.charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                        <div className="avatar-overlay">
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
                    <p className="avatar-hint">Click to upload (max 5MB)</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Full fullName</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full fullName"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email <span className="readonly-badge">read-only</span></label>
                        <input type="email" value={user?.email || ""} disabled />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+977-98XXXXXXXX"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell others about yourself..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <Link href="/dashboard" className="btn-secondary">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}