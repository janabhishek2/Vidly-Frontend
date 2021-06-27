export function searchRenatalsUsingEmail(rentals, email) {
  if (email == "") {
    return rentals;
  }
  const rentalsx = rentals.filter((rental) => {
    let newEmail = "";
    for (let i = 0; i < email.length; i++) {
      newEmail += rental.user.email[i];
    }

    return newEmail.toLowerCase() == email.toLowerCase();
  });
  return rentalsx;
}
