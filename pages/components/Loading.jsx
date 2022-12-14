import React, { useEffect } from "react";
import { Center, Image } from "@chakra-ui/react";

const Loading = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      var count = 0;
      var counting = setInterval(function () {
        if (count <= 100) {
          document.getElementById("LoadingNumber").textContent = count + "%";
          document.getElementById("LoadingProgress").style.width = count + "%";
          count += 5;
        } else {
          clearInterval(counting);
          document
            .getElementById("LoadingScreen")
            .classList.add("loading-screen--hidden");
        }
      }, 35);
    }
  }, []);

  return (
    <>
      <div className="loading-screen" id="LoadingScreen">
        <Center w="100%" h="80%">
          <Image
            src={"./IN_CODE_WE_TRUST.png"}
            alt="In Code We Trust"
            className="loading-img"
          />
        </Center>
        <div className="loading-screen__wrapper">
          <h4 className="loading-text">Racks Community Project Manager</h4>
          <h1 className="section-title" id="LoadingNumber">
            0%
          </h1>
          <div className="loading__progress-container">
            <div className="loading__progress" id="LoadingProgress"></div>
          </div>
        </div>
      </div>
      <style global jsx>{`
        .loading-screen {
          height: 100vh;
          width: 100%;
          z-index: 100;
          position: fixed;
          top: 0;
          right: 0;
          overflow: hidden;
          background: #121212;
          background-position: left top;
          background-size: 400vw 300vw;
          background-attachment: fixed;
          transition: all 1s ease-in-out;
        }

        .loading-screen--hidden {
          opacity: 0;
          pointer-events: none;
        }

        .loading-screen__wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
          position: absolute;
          bottom: 90px;
          left: 0;
          width: 100%;
          padding: 0 140px;
        }

        .loading-img {
          object-fit: contain !important;
          width: 1000px !important;
          z-index: 200;
        }

        .loading-text {
          font-family: SyncopateBold;
          font-size: 30px;
        }

        .loading-screen .section-title {
          font-size: 60px;
        }

        .loading__progress-container {
          width: 100%;
          height: 5px;
          background-color: #2d2d2d;
          border-radius: 5px;
          position: relative;
        }

        .loading__progress {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #6d6d04, #fefe0e);
          border-radius: inherit;
        }

        @media screen and (max-width: 1000px) {
          .loading-img {
            width: 80vw !important;
          }
          .loading-text {
            font-size: 3.5vw;
          }
          .loading-screen .section-title {
            font-size: 7vw;
          }
          .loading-screen__wrapper {
            padding: 0 10vw;
          }
        }
      `}</style>
    </>
  );
};

export default Loading;
