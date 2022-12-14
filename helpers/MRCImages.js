import axios from "axios";
import { ethers } from "ethers";
import ObjectIsNotEmpty from "./ObjectIsNotEmpty";
import { contractAddresses, MrCryptoAbi } from "../web3Constants";
import { getUserById } from "./APICalls";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const getMRCImageUrlFromContributor = async (id, token) => {
  if (!id || !token) return null;
  const data = await getUserById(id, token);
  const mrc = await getMRCImageUrlFromAvatar(data.avatar);
  return mrc;
};

export const getMRCImageUrlFromAvatar = async (uri) => {
  if (!uri) return null;

  const tokenURIResponse = (await axios.get(uri)).data;
  const imageURI = tokenURIResponse.image;
  const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  return imageURIURL;
};

export const getMRCImageUrlFromId = async (tokenId) => {
  if (!tokenId) return null;
  const uri = await getMRCMetadataUrl(tokenId);
  return await getMRCImageUrlFromAvatar(uri);
};

export const getMRCImageUrlFromMetadata = (jsonToken) => {
  if (ObjectIsNotEmpty(jsonToken)) {
    const imageURI = jsonToken.image;
    const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    return imageURIURL;
  }
};

export const getMRCMetadataUrl = async (tokenId) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com"
  );
  const MRC = new ethers.Contract(
    "0xeF453154766505FEB9dBF0a58E6990fd6eB66969", // DEV
    MrCryptoAbi,
    provider
  );
  const uri = await MRC.tokenURI(tokenId);
  uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  return uri;
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
