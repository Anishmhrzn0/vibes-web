import { ReactNode } from "react";
import s from "./seller.module.css";

interface StatCardProps {
  label: string;
  icon: ReactNode;
  value: string | number;
  sublabel?: string;
  positive?: boolean;
}

export default function StatCard({
  label,
  icon,
  value,
  sublabel,
  positive = false,
}: StatCardProps) {
  return (
    <div className={s.statCard}>
      <div className={s.statCardHeader}>
        <span>{label}</span>
        <span className={s.statCardIcon}>{icon}</span>
      </div>
      <div className={s.statValue}>{value}</div>
      {sublabel && (
        <div className={`${s.statSub} ${positive ? s.statSubPositive : ""}`}>
          {sublabel}
        </div>
      )}
    </div>
  );
}