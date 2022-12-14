const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserById = async (id, token) => {
  if (id) {
    const res = await fetch(API_URL + "users/id/" + id, {
      method: "get",
      headers: new Headers({
        Authorization: token,
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      return data;
    }
  }
};

export const getAdmin = async (token) => {
  const res = await fetch(API_URL + "getAdminId", {
    method: "get",
    headers: new Headers({
      Authorization: token,
    }),
  });
  if (res?.ok) {
    const data = await res.json();
    return data;
  }
};

export default getUserById;
