import Image from "next/image";
import { Trash2, Heart } from "lucide-react";
import type { SellerListing } from "@/types/seller";
import StatusBadge from "./StatusBadge";
import s from "./seller.module.css";

interface ListingRowProps {
  listing: SellerListing;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewReceipt: (id: string) => void;
}

function formatPrice(n: number) {
  return `Rs.${n.toLocaleString("en-IN")}`;
}

export default function ListingRow({
  listing,
  onResume,
  onDelete,
  onEdit,
  onViewReceipt,
}: ListingRowProps) {
  const isPending = listing.status === "pending";
  const isSold = listing.status === "sold";
  const isActive = listing.status === "active";
  const isBooked = listing.status === "booked";

  return (
    <tr className={s.row}>
      {/* Vehicle details */}
      <td>
        <div className={s.vehicleCell}>
          <div className={s.vehicleThumbWrap}>
            {listing.image ? (
              <Image
                src={listing.image}
                alt={listing.title}
                width={64}
                height={48}
                className={s.vehicleImg}
              />
            ) : (
              <div className={s.vehicleImg} />
            )}
            <span
              className={`${s.imgTag} ${
                isSold
                  ? s.imgTagSold
                  : isBooked
                  ? s.imgTagBooked
                  : isPending
                  ? s.imgTagPending
                  : s.imgTagActive
              }`}
            >
              {isSold ? "Sold" : isBooked ? "Booked" : isPending ? "Pending" : "Active"}
            </span>
          </div>
          <div>
            <div className={s.vehicleTitle}>{listing.title}</div>
            <div className={s.vehicleSub}>
              {isSold ? (
                <>
                  Sold on{" "}
                  {new Date(listing.soldOn!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              ) : isBooked ? (
                <>
                  Booked on{" "}
                  {listing.bookedOn &&
                    new Date(listing.bookedOn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                </>
              ) : (
                <>VIN: {listing.vin}</>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td>
        <StatusBadge status={listing.status} />
      </td>

      {/* Price */}
      <td>
        <div className={s.price}>{formatPrice(listing.price)}</div>
        <div className={s.priceSub}>
          {isSold
            ? "Final Sale"
            : isBooked
            ? `Deposit: ${formatPrice(listing.depositAmount ?? 0)}`
            : "Market Avg"}
        </div>
      </td>

      {/* Performance */}
      <td>
        {isPending && !listing.photosPublished ? (
          <span className={s.notPublished}>Not published</span>
        ) : isPending ? (
          <span className={s.notPublished}>Awaiting admin review</span>
        ) : isBooked ? (
          <span className={s.notPublished}>Reserved — hidden from buyers</span>
        ) : isSold ? (
          <>
            <div className={s.marketTime}>{listing.marketTimeDays} days</div>
            <div className={s.marketTimeSub}>Market Time</div>
          </>
        ) : (
          <div className={s.perfRow}>
            <div className={s.perfItem}>
              <span className={s.perfIcon}>
                <Heart size={14} />
              </span>
              {listing.saves}
              <span className={s.perfLabel}>Saves</span>
            </div>
          </div>
        )}
      </td>

      {/* Actions */}
      <td>
        {isActive && (
          <div className={s.actions}>
            <button
              onClick={() => onDelete(listing._id)}
              className={`${s.iconBtn} ${s.iconBtnDanger}`}
              aria-label="Delete listing"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        {isPending && (
          <div className={s.actions}>
            <button onClick={() => onResume(listing._id)} className={s.resumeBtn}>
              Resume
            </button>
            <button
              onClick={() => onDelete(listing._id)}
              className={`${s.iconBtn} ${s.iconBtnDanger}`}
              aria-label="Delete listing"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        {isBooked && (
          <span className={s.notPublished}>Awaiting buyer payment</span>
        )}
        {isSold && (
          <button onClick={() => onViewReceipt(listing._id)} className={s.receiptBtn}>
            View Receipt
          </button>
        )}
      </td>
    </tr>
  );
}