import { contractAddresses, MrCryptoAbi } from "../../web3Constants";
import { ethers } from "ethers";

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

export const getMRCImageUrlFromMetadata = async (jsonToken) => {
  const imageURI = jsonToken.image;
  const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  return imageURIURL;
};

export const getMRCMetadataUrl = async (tokenId) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com"
  );
  const MRC = new ethers.Contract(
    "0xeF453154766505FEB9dBF0a58E6990fd6eB66969",
    MrCryptoAbi,
    provider
  );
  const uri = await MRC.tokenURI(tokenId);
  uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  return uri;
};
