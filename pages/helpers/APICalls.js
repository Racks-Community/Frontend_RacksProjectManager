const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserById = async (id) => {
  if (id) {
    const res = await fetch(API_URL + "users/id/" + id, {
      method: "get",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      return data;
    }
  }
};

export const getAdmin = async () => {
  const res = await fetch(API_URL + "getAdminId", {
    method: "get",
    headers: new Headers({
      Authorization: localStorage.getItem("token"),
    }),
  });
  if (res?.ok) {
    const data = await res.json();
    return data;
  }
};
