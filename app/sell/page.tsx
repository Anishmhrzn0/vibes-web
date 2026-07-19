"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import s from "./sell.module.css";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

export default function SellPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    vin: "",
    year: "",
    make: "",
    carModel: "",
    bodyType: "Sedan",
    location: "",
    mileage: "",
    price: "",
    condition: "Excellent",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.county ||
            data.display_name ||
            "";
          handleChange("location", city);
        } catch {
          setError("Couldn't determine your location name — enter it manually");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("Location permission denied — enter it manually");
        setLocating(false);
      }
    );
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).slice(0, 6 - images.length);
    setImages((prev) => [...prev, ...newFiles].slice(0, 6));
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ].slice(0, 6));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("vin", form.vin);
      fd.append("year", form.year);
      fd.append("make", form.make);
      fd.append("carModel", form.carModel);
      fd.append("mileage", form.mileage);
      fd.append("price", form.price);
      fd.append("condition", form.condition);
      images.forEach((file) => fd.append("images", file));

      const res = await fetch("/api/cars", {           // ✅ relative path, goes through rewrite proxy
        method: "POST",
        credentials: "include",                          // ✅ sends the httpOnly ap_token cookie
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to submit listing");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return null;

  if (success) {
    return (
      <div className={s.page}>
        <nav className={s.nav}>
          <div className={s.navBrand}>VIBES</div>
        </nav>
        <div className={s.successBox}>
          <h1 className={s.successTitle}>Listing submitted</h1>
          <p className={s.successText}>
            Your vehicle is now pending admin review. It will appear on the marketplace once approved.
          </p>
          <Link href="/" className={s.backLink}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {/* ── Navbar ── */}
      <nav className={s.nav}>
        <div className={s.navBrand}>VIBES</div>
        <div className={s.navLinks}>
          <Link href="/" className={s.navLink}>Buy</Link>
          <Link href="/sell" className={`${s.navLink} ${s.navLinkActive}`}>Sell</Link>
        </div>
        <div className={s.navRight}>
          <button className={s.iconBtn} aria-label="Notifications">🔔</button>
          <button className={s.iconBtn} aria-label="Wishlist">🤍</button>
          <button className={s.btnAccount} onClick={logout}>
            {user.fullName?.split(" ")[0] ?? "Account"}
          </button>
        </div>
      </nav>

      <div className={s.container}>
        <h1 className={s.title}>Sell Your Vehicle</h1>
        <p className={s.subtitle}>Provide the essential details to begin your premium listing journey.</p>

        <form className={s.card} onSubmit={handleSubmit}>
          <div className={s.cardHeader}>
            <span className={s.cardIcon}>🚗</span>
            <div>
              <div className={s.cardTitle}>Vehicle Basics</div>
              <div className={s.cardSub}>Identity and technical fundamentals</div>
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>Vehicle Identification Number (VIN)</label>
            <input
              className={s.input}
              value={form.vin}
              onChange={(e) => handleChange("vin", e.target.value)}
              placeholder="VIN Number"
              required
            />
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>Year</label>
              <input
                className={s.input}
                type="number"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                placeholder="e.g. 2022"
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Make</label>
              <input
                className={s.input}
                value={form.make}
                onChange={(e) => handleChange("make", e.target.value)}
                placeholder="e.g. Honda"
                required
              />
            </div>
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>Model</label>
              <input
                className={s.input}
                value={form.carModel}
                onChange={(e) => handleChange("carModel", e.target.value)}
                placeholder="e.g. Honda Civic"
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Mileage (miles)</label>
              <input
                className={s.input}
                type="number"
                value={form.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>Body Type</label>
              <select
                className={s.select}
                value={form.bodyType}
                onChange={(e) => handleChange("bodyType", e.target.value)}
                required
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label}>Location</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  className={s.input}
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. Kathmandu"
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className={s.uploadBox}
                  onClick={handleUseLocation}
                  disabled={locating}
                  style={{ padding: "0 14px", whiteSpace: "nowrap", cursor: "pointer" }}
                >
                  {locating ? "Locating…" : "📍"}
                </button>
              </div>
            </div>
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>Price (Rs.)</label>
              <input
                className={s.input}
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="e.g. 2500000"
                required
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Condition</label>
              <select
                className={s.select}
                value={form.condition}
                onChange={(e) => handleChange("condition", e.target.value)}
                required
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>Photos (up to 6)</label>
            <label className={s.uploadBox}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className={s.fileInput}
                disabled={images.length >= 6}
              />
              <span className={s.uploadText}>
                📷 Tap to choose photos ({images.length}/6)
              </span>
            </label>

            {previews.length > 0 && (
              <div className={s.previewGrid}>
                {previews.map((src, i) => (
                  <div key={i} className={s.previewItem}>
                    <img src={src} alt={`Preview ${i + 1}`} className={s.previewImg} />
                    <button
                      type="button"
                      className={s.previewRemove}
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className={s.errorText}>{error}</p>}

          <div className={s.actions}>
            <Link href="/" className={s.backLink}>Back to Dashboard</Link>
            <button className={s.btnSubmit} type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Save & Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}