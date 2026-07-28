import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListingRow from "@/app/components/sellers/ListingRow";
import type { SellerListing } from "@/types/seller";

function makeListing(overrides: Partial<SellerListing> = {}): SellerListing {
  return {
    _id: "listing1",
    title: "2020 Toyota Corolla",
    vin: "VIN12345",
    status: "active",
    price: 1000000,
    saves: 3,
    photosPublished: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderRow(listing: SellerListing, handlers: Partial<Record<string, jest.Mock>> = {}) {
  const onResume = handlers.onResume ?? jest.fn();
  const onDelete = handlers.onDelete ?? jest.fn();
  const onEdit = handlers.onEdit ?? jest.fn();
  const onViewReceipt = handlers.onViewReceipt ?? jest.fn();

  render(
    <table>
      <tbody>
        <ListingRow
          listing={listing}
          onResume={onResume}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewReceipt={onViewReceipt}
        />
      </tbody>
    </table>
  );

  return { onResume, onDelete, onEdit, onViewReceipt };
}

describe("ListingRow", () => {
  it("9. renders the title and VIN for an active listing", () => {
    renderRow(makeListing({ status: "active" }));
    expect(screen.getByText("2020 Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText(/VIN: VIN12345/)).toBeInTheDocument();
  });

  it("10. shows a 'Booked on' date instead of VIN for a booked listing", () => {
    renderRow(makeListing({ status: "booked", bookedOn: "2026-02-15T00:00:00.000Z" }));
    expect(screen.getByText(/Booked on/)).toBeInTheDocument();
    expect(screen.queryByText(/VIN:/)).not.toBeInTheDocument();
  });

  it("11. shows a 'Sold on' date for a sold listing", () => {
    renderRow(makeListing({ status: "sold", soldOn: "2026-03-01T00:00:00.000Z" }));
    expect(screen.getByText(/Sold on/)).toBeInTheDocument();
  });

  it("12. shows a Delete button for an active listing and calls onDelete when clicked", async () => {
    const { onDelete } = renderRow(makeListing({ status: "active" }));
    const deleteBtn = screen.getByLabelText("Delete listing");
    await userEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("listing1");
  });

  it("13. shows a Resume button for a pending listing and calls onResume when clicked", async () => {
    const { onResume } = renderRow(makeListing({ status: "pending" }));
    const resumeBtn = screen.getByText("Resume");
    await userEvent.click(resumeBtn);
    expect(onResume).toHaveBeenCalledWith("listing1");
  });

  it("14. shows a View Receipt button for a sold listing and calls onViewReceipt when clicked", async () => {
    const { onViewReceipt } = renderRow(makeListing({ status: "sold" }));
    const receiptBtn = screen.getByText("View Receipt");
    await userEvent.click(receiptBtn);
    expect(onViewReceipt).toHaveBeenCalledWith("listing1");
  });

  it("15. shows the deposit amount for a booked listing", () => {
    renderRow(makeListing({ status: "booked", depositAmount: 100000 }));
    expect(screen.getByText(/Deposit: Rs\.1,00,000/)).toBeInTheDocument();
  });
});