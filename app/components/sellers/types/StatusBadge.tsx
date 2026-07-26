import type { ListingStatus } from "@/types/seller";
import s from "./seller.module.css";

const STYLES: Record<ListingStatus, string> = {
  active: s.badgeActive,
  pending: s.badgeDraft,
  booked: s.badgeBooked,
  sold: s.badgeSold,
};

const LABELS: Record<ListingStatus, string> = {
  active: "Active",
  pending: "Pending",
  booked: "Booked",
  sold: "Sold",
};

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={`${s.badge} ${STYLES[status]}`}>{LABELS[status]}</span>
  );
}