export function searchRentalsUsingId(rentals, rentalId) {
  if (rentalId == "") {
    return rentals;
  }
  const rental = rentals.filter((rental) => {
    return rental._id == rentalId;
  });

  return rental;
}
