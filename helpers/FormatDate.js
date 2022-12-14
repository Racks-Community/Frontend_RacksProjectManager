export const formatDate = (originalDate) => {
  let date = new Date(originalDate);
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = date.getFullYear();

  const formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate;
};
