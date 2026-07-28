import { render, screen } from "@testing-library/react";
import StatusBadge from "@/app/components/sellers/StatusBadge";

describe("StatusBadge", () => {
  it("1. renders 'Active' for status active", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("2. renders 'Pending' for status pending", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("3. renders 'Booked' for status booked", () => {
    render(<StatusBadge status="booked" />);
    expect(screen.getByText("Booked")).toBeInTheDocument();
  });

  it("4. renders 'Sold' for status sold", () => {
    render(<StatusBadge status="sold" />);
    expect(screen.getByText("Sold")).toBeInTheDocument();
  });
});