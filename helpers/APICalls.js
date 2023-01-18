import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

// SIWE

export const getNonceAPI = async (account) => {
  const res = await axios({
    method: "get",
    url: API_URL + "nonce?address=" + account,
  });
  if (res?.status) {
    return res.data.nonce;
  }
  return null;
};

export const loginNftAPI = async (message, signature) => {
  const res = await axios({
    method: "post",
    url: API_URL + "loginnft",
    data: { message, signature },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// TOKEN

export const getTokenAPI = async () => {
  const res = await axios({
    method: "get",
    url: API_URL + "token",
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// LOGIN

export const loginAPI = async (loginData) => {
  const res = await axios({
    method: "post",
    url: API_URL + "login",
    data: loginData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// API

// POST

export const createProjectAPI = async (projectData) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects",
    headers: {
      Authorization: getToken(),
      "Content-Type": "multipart/form-data",
    },
    data: projectData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const approveProjectAPI = async (projectAddress, approve) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects/approve/" + projectAddress,
    headers: { Authorization: getToken() },
    data: { approve: approve },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const completeProjectAPI = async (projectAddress, projectData) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects/completed/" + projectAddress,
    headers: { Authorization: getToken() },
    data: projectData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const fundProjectAPI = async (projectAddress, projectData) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects/fund/" + projectAddress,
    headers: { Authorization: getToken() },
    data: projectData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const removeContributorAPI = async (
  contributorId,
  contributorAddress
) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects/remove-contributor/" + contributorId,
    headers: { Authorization: getToken() },
    data: { contributorAddress: contributorAddress },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const addContributorToProjectAPI = async (
  projectAddress,
  userAddress
) => {
  const res = await axios({
    method: "post",
    url: API_URL + "projects/add-contributor/" + projectAddress,
    headers: { Authorization: getToken() },
    data: { contributorAddress: userAddress },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const createContributorAPI = async (
  contributorAddress,
  contributorData
) => {
  const res = await axios({
    method: "post",
    url: API_URL + "users/contributor/" + contributorAddress,
    headers: { Authorization: getToken() },
    data: contributorData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// PATCH

export const updateUserAPI = async (userAddress, contributorData) => {
  const res = await axios({
    method: "patch",
    url: API_URL + "users/" + userAddress,
    headers: { Authorization: getToken() },
    data: contributorData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const banContributorAPI = async (contributorAddress, banned) => {
  const res = await axios({
    method: "patch",
    url: API_URL + "users/ban/" + contributorAddress,
    headers: { Authorization: getToken() },
    data: { banned: banned },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const updateProjectAPI = async (projectAddress, projectData) => {
  const res = await axios({
    method: "patch",
    url: API_URL + "projects/" + projectAddress,
    headers: {
      Authorization: getToken(),
      "Content-Type": "multipart/form-data",
    },
    data: projectData,
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// GET

export const getProjectsAPI = async () => {
  const res = await axios({
    method: "get",
    url: API_URL + "projects",
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const getUsersAPI = async () => {
  const res = await axios({
    method: "get",
    url: API_URL + "users",
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const getProjectParticipationAPI = async (projectAddress) => {
  const res = await axios({
    method: "get",
    url: API_URL + "projects/participation/" + projectAddress,
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const getDiscordInviteAPI = async () => {
  const res = await axios({
    method: "get",
    url: API_URL + "discord-invite",
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const deleteUserAPI = async (userAddress) => {
  const res = await axios({
    method: "delete",
    url: API_URL + "users/contributor/" + userAddress,
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

export const deleteProjectAPI = async (projectAddress) => {
  const res = await axios({
    method: "delete",
    url: API_URL + "projects/" + projectAddress,
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};

// UTILS

export const getUserByIdAPI = async (id) => {
  if (id) {
    const res = await axios({
      method: "get",
      url: API_URL + "users/id/" + id,
      headers: { Authorization: getToken() },
    });
    if (res?.status) {
      return res.data;
    }
    return null;
  }
};

export const getAdminAPI = async () => {
  const res = await axios({
    method: "get",
    url: API_URL + "getAdminId",
    headers: { Authorization: getToken() },
  });
  if (res?.status) {
    return res.data;
  }
  return null;
};
