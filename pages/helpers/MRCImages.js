import ObjectIsNotEmpty from "./ObjectIsNotEmpty";
import { contractAddresses, MrCryptoAbi } from "../../web3Constants";
import { ethers } from "ethers";
import { getUserById } from "./APICalls";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const getMRCImageUrlFromContributor = async (id) => {
  const data = await getUserById(id);
  const mrc = await getMRCImageUrlFromAvatar(data.avatar);
  return mrc;
};

export const getMRCImageUrlFromAvatar = async (uri) => {
  const tokenURIResponse = await (await fetch(uri)).json();
  const imageURI = tokenURIResponse.image;
  const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  return imageURIURL;
};

export const getMRCImageUrlFromId = async (tokenId) => {
  const uri = await getMRCMetadataUrl(tokenId);
  const tokenURIResponse = await (await fetch(uri)).json();
  const imageURI = tokenURIResponse.image;
  const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  return imageURIURL;
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

export default getMRCImageUrlFromMetadata;
