import { useEffect, useState } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "./chakra_theme/theme";
import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/montserrat/400.css";
import { Image } from "@chakra-ui/react";
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
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../store/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import { getMRCImageUrlFromAvatar } from "../helpers/MRCImages";
import { getTokenAPI, getNonceAPI, loginNftAPI } from "../helpers/APICalls";

const { chains, provider } = configureChains(
  [chain.polygonMumbai], // DEV
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
  const router = useRouter();

  const CustomAvatar = ({ size }) => {
    return imageURL != "" ? (
      <Image
        src={imageURL}
        alt="avatar"
        width={size}
        height={size}
        style={{ borderRadius: 999 }}
      />
    ) : (
      <Image
        src={"./fallback.gif"}
        alt="avatar"
        width={size}
        height={size}
        style={{ borderRadius: 999 }}
      />
    );
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const data = await getTokenAPI();
      if (!data) {
        localStorage.removeItem("address");
        localStorage.removeItem("token");
        router.reload();
        setAuthenticationStatus("unauthenticated");
      } else {
        setAuthenticationStatus("authenticated");
        dispatch(setUserInfo(data.user));
      }
    };

    if (localStorage.getItem("token")) {
      fetchAuthStatus();
    } else {
      setAuthenticationStatus("unauthenticated");
    }
  }, [loginStatus]);

  useEffect(() => {
    if (user.contributor && user.verified && user.avatar) {
      (async () => {
        const mrc = await getMRCImageUrlFromAvatar(user.avatar);
        setImageURL(mrc);
      })();
    }
  }, [user]);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = (await provider.send("eth_requestAccounts", []))[0];
      return await getNonceAPI(account);
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
      const data = await loginNftAPI(message, signature);
      if (!data) {
        return false;
      } else {
        localStorage.setItem("token", "Bearer " + data.token);
        localStorage.setItem("address", data.user.address);
        dispatch(setUserInfo(data.user));
        setLoginStatus(true);
        if (window.location.pathname != "/") router.push("/");
        return true;
      }
    },
    signOut: async () => {
      localStorage.removeItem("address");
      localStorage.removeItem("token");
      router.reload();
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
              theme="dark"
              toastStyle={{ backgroundColor: "#333", color: "white" }}
            />
          </ThemeProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
