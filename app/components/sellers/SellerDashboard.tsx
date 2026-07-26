"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Eye, Tag, Car, Clock, Search, SlidersHorizontal } from "lucide-react";
import StatCard from "./StatCard";
import ListingRow from "./ListingRow";
import {
  getSellerStats,
  getSellerListings,
  resumeListing,
  deleteListing,
} from "@/app/lib/api/seller";
import type { SellerStats, SellerListing } from "@/types/seller";
import s from "./seller.module.css";

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, listingsRes] = await Promise.all([
        getSellerStats(),
        getSellerListings({ search: searchTerm }),
      ]);
      setStats(statsRes);
      setListings(listingsRes.listings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(search);
  };

  const handleResume = async (id: string) => {
    await resumeListing(id);
    loadData(search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this draft listing?")) return;
    await deleteListing(id);
    loadData(search);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/sell/edit/${id}`;
  };

  const handleViewReceipt = (id: string) => {
    window.location.href = `/sell/receipt/${id}`;
  };

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.headerTitle}>Seller Dashboard</h1>
          <p className={s.headerDesc}>
            Manage your inventory, track performance metrics, and optimize
            your listings for the highest market value.
          </p>
        </div>
        <a href="/sell/new" className={s.listBtn}>
          <Plus size={16} />
          List Your Vehicle
        </a>
      </div>

      {/* Stat cards */}
      <div className={s.statsGrid}>
        <StatCard
          label="Total Views"
          icon={<Eye size={16} />}
          value={stats?.totalViews.toLocaleString() ?? "—"}
          sublabel={
            stats ? `↑ ${stats.totalViewsChangePct}% from last week` : undefined
          }
          positive
        />
        <StatCard
          label="Pending Offers"
          icon={<Tag size={16} />}
          value={stats?.pendingOffers.toString().padStart(2, "0") ?? "—"}
          sublabel={
            stats
              ? `${stats.pendingOffersNeedingReview} requires immediate review`
              : undefined
          }
        />
        <StatCard
          label="Active Listings"
          icon={<Car size={16} />}
          value={stats?.activeListings.toString().padStart(2, "0") ?? "—"}
          sublabel={
            stats ? `Inventory health: ${stats.inventoryHealth}` : undefined
          }
        />
        <StatCard
          label="Avg. Days to Sell"
          icon={<Clock size={16} />}
          value={stats?.avgDaysToSell ?? "—"}
          sublabel={
            stats
              ? `Top ${stats.avgDaysToSellPercentile}% in your region`
              : undefined
          }
        />
      </div>

      {/* Listings */}
      <div className={s.listingsSection}>
        <div className={s.listingsHeader}>
          <h2 className={s.listingsTitle}>Current Listings</h2>
          <div className={s.listingsControls}>
            <form onSubmit={handleSearch} className={s.searchWrap}>
              <span className={s.searchIcon}>
                <Search size={16} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your inventory..."
                className={s.searchInput}
              />
            </form>
            <button className={s.filterBtn}>
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className={s.tableWrap}>
          {error ? (
            <div className={`${s.stateMsg} ${s.stateError}`}>{error}</div>
          ) : loading ? (
            <div className={s.stateMsg}>Loading listings…</div>
          ) : listings.length === 0 ? (
            <div className={s.stateMsg}>
              No listings yet — list your first vehicle to get started.
            </div>
          ) : (
            <table className={s.table}>
              <thead>
                <tr className={s.theadRow}>
                  <th>Vehicle Details</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <ListingRow
                    key={listing._id}
                    listing={listing}
                    onResume={handleResume}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onViewReceipt={handleViewReceipt}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}