import { useEffect, useState } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "./chakra_theme/theme";
import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/montserrat/400.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  AvatarComponent,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ethers } from "ethers";
import { wrapper } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../store/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [
    jsonRpcProvider({
      rpc: () => ({ http: process.env.NEXT_PUBLIC_RPC_URL }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Racks PM",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  const user = useSelector(selectUserInfo);
  const [authenticationStatus, setAuthenticationStatus] = useState("loading");
  const [loginStatus, setLoginStatus] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const dispatch = useDispatch();

  const CustomAvatar = ({ size }) => {
    return imageURL != "" ? (
      <img
        src={imageURL}
        width={size}
        height={size}
        style={{ borderRadius: 999 }}
      />
    ) : (
      <img
        src={"./fallback.gif"}
        width={size}
        height={size}
        style={{ borderRadius: 999 }}
      />
    );
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const res = await fetch(API_URL + "token", {
        method: "get",
        headers: new Headers({
          Authorization: localStorage.getItem("token"),
        }),
      });
      if (!res?.ok) {
        setAuthenticationStatus("unauthenticated");
      } else {
        setAuthenticationStatus("authenticated");
        const data = await res.json();
        dispatch(setUserInfo(data.user));
      }
    };

    if (localStorage.getItem("token")) {
      fetchAuthStatus();
    } else {
      setAuthenticationStatus("unauthenticated");
    }
    if (user.avatar && user.role === "user") {
      (async () => {
        const jsonToken = await (await fetch(user.avatar)).json();
        const imageURI = jsonToken.image;
        const imageURIURL = imageURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setImageURL(imageURIURL);
      })();
    }
  }, [loginStatus]);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = (await provider.send("eth_requestAccounts", []))[0];
      const response = await fetch(API_URL + "nonce?address=" + account);
      const nonceRes = await response.json();
      return await nonceRes.nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const verifyRes = await fetch(API_URL + "loginnft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes?.ok) {
        return false;
      } else {
        const data = await verifyRes.json();
        localStorage.setItem("token", "Bearer " + data.token);
        dispatch(setUserInfo(data.user));
        setLoginStatus(true);
        return true;
      }
    },
    signOut: async () => {
      localStorage.removeItem("token");
      dispatch(setUserInfo({}));
      setLoginStatus(false);
    },
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      >
        <RainbowKitProvider
          chains={chains}
          avatar={CustomAvatar}
          theme={darkTheme({
            accentColor: "#FEFE0E",
            overlayBlur: "small",
            borderRadius: "none",
            accentColorForeground: "#1A202C",
          })}
          modalSize="compact"
        >
          <ThemeProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              pauseOnVisibilityChange
              closeOnClick
              pauseOnHover
              toastStyle={{ backgroundColor: "#333", color: "white" }}
            />
          </ThemeProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
