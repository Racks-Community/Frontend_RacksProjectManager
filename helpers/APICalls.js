import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserById = async (id, token) => {
  if (id) {
    const res = await axios({
      method: "get",
      url: API_URL + "users/id/" + id,
      headers: { Authorization: token },
    });
    if (res?.status) {
      return res.data;
    }
    return null;
  }
};

export const getAdmin = async (token) => {
  const res = await axios({
    method: "get",
    url: API_URL + "getAdminId",
    headers: { Authorization: token },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const fetchUser = async () => {
  const res = await fetch(API_URL + "token", {
    method: "get",
    headers: new Headers({
      Authorization: localStorage.getItem("token"),
    }),
  });
  if (res?.ok) {
    return await res.json();
  }
  return null;
};
