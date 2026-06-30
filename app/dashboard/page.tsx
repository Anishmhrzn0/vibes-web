"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useProtectedRoute } from "../router/protected.route";

export default function DashboardPage() {
  const { loading } = useProtectedRoute(); 
  const { user, logout } = useAuth();

  if (loading || !user) return null; 

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="nav-brand"> VIBES</div>
        <div className="nav-links">
          {user.role === "admin" && (
  <Link href="/admin/users" className="nav-link">Admin Panel</Link>
)}
          <Link href="/profile/edit" className="nav-link">Edit Profile</Link>
          <Link href="/profile/password" className="nav-link">Change Password</Link>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="avatar-large">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} />
            ) : (
              <span>{user.fullName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h1>Hello, {user.fullName}! 👋</h1>
          <p>{user.email}</p>
          {user.bio && <p className="bio">{user.bio}</p>}
          {user.phone && <p className="phone"> {user.phone}</p>}
        </div>

        <div className="quick-actions">
          <Link href="/profile/edit" className="action-card">
            <span className="action-icon"></span>
            <h3>Edit Profile</h3>
            <p>Update your fullName, bio, avatar and more</p>
          </Link>
          <Link href="/profile/password" className="action-card">
            <span className="action-icon"></span>
            <h3>Change Password</h3>
            <p>Keep your account secure</p>
          </Link>
        </div>
      </div>
    </div>
  );
}