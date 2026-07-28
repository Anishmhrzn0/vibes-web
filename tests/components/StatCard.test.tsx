import { render, screen } from "@testing-library/react";
import StatCard from "@/app/components/sellers/StatCard";

describe("StatCard", () => {
  it("5. renders the label and value", () => {
    render(<StatCard label="Total Saves" icon={<span>icon</span>} value={42} />);
    expect(screen.getByText("Total Saves")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("6. renders the sublabel when provided", () => {
    render(
      <StatCard label="Active Listings" icon={<span />} value={3} sublabel="Inventory health: Optimal" />
    );
    expect(screen.getByText("Inventory health: Optimal")).toBeInTheDocument();
  });

  it("7. renders no sublabel text when none is provided", () => {
    const { container } = render(<StatCard label="Pending Offers" icon={<span />} value={0} />);
    expect(container.textContent).not.toMatch(/undefined/);
  });

  it("8. renders a string value as-is (e.g. formatted numbers)", () => {
    render(<StatCard label="Total Saves" icon={<span />} value="1,284" />);
    expect(screen.getByText("1,284")).toBeInTheDocument();
  });
});