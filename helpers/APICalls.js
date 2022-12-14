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
};
