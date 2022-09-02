import { useEffect, useState } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "./chakra_theme/theme";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ethers } from "ethers";
import { wrapper } from "../store/store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/userSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [
    jsonRpcProvider({ rpc: () => ({ http: "https://rpc.ankr.com/eth" }) }),
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
  const [authenticationStatus, setAuthenticationStatus] = useState("loading");
  const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useDispatch();

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
        setLoginStatus(true);
      }
    };

    if (localStorage.getItem("token")) {
      fetchAuthStatus();
    } else {
      setAuthenticationStatus("unauthenticated");
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
          theme={darkTheme({
            accentColor: "#FEFE0E",
            overlayBlur: "small",
            borderRadius: "none",
            accentColorForeground: "#1A202C",
          })}
          modalSize="compact"
        >
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
