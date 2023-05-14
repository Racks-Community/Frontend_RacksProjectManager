import axios from "axios";
import { ethers } from "ethers";
import ObjectIsNotEmpty from "./ObjectIsNotEmpty";
import { contractAddresses, MrCryptoAbi } from "../web3Constants";
import { getUserByIdAPI } from "./APICalls";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const getMRCImageUrlFromContributor = async (id) => {
  if (!id) return null;
  const data = await getUserByIdAPI(id);
  const mrc = await getMRCImageUrlFromAvatar(data.avatar);
  return mrc;
};

export const getMRCImageUrlFromAvatar = async (uri) => {
  if (!uri) return null;

  const tokenURIResponse = (await axios.get(uri)).data;
  return tokenURIResponse.image;
};

export const getMRCImageUrlFromId = async (tokenId) => {
  if (!tokenId) return null;
  const uri = await getMRCMetadataUrl(tokenId);
  return await getMRCImageUrlFromAvatar(uri);
};

export const getMRCImageUrlFromMetadata = (jsonToken) => {
  if (ObjectIsNotEmpty(jsonToken)) {
    return jsonToken.image;
  }
};

export const getMRCMetadataUrl = async (tokenId) => {
  return (
    "https://mrcrypto.s3.eu-central-1.amazonaws.com/metadata/" +
    tokenId +
    ".json"
  );
};

export const fetchNFTIds = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const MRC = new ethers.Contract(
    contractAddresses[CHAIN_ID].MRCRYPTO,
    MrCryptoAbi,
    signer
  );
  const tokenIds = await MRC.walletOfOwner(
    (
      await provider.send("eth_requestAccounts", [])
    )[0]
  );
  let ids = [];
  for (let id of tokenIds) {
    ids.push(ethers.BigNumber.from(id).toNumber());
  }
  return ids;
};
