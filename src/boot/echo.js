import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { axios } from "src/boot/axios";

window.Pusher = Pusher;
console.log("REVERB HOST:", process.env.VITE_REVERB_HOST);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${process.env.SERVER_BASE_URL}`;

const startBroadcasting = async () => {
  try {
    // 2. This sets the XSRF-TOKEN cookie in your browser
    await axios.get("/sanctum/csrf-cookie");

    // 3. NOW you can initialize Echo
    initEcho();
  } catch (error) {
    console.error("CSRF Cookie failed", error);
  }
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
};

const initEcho = () => {
  window.Echo = new Echo({
    broadcaster: "reverb", // or 'pusher'
    key: process.env.VITE_REVERB_APP_KEY,
    wsHost: process.env.VITE_REVERB_HOST,
    wsHost: process.env.VITE_REVERB_HOST,
    wsPort: process.env.VITE_REVERB_PORT,
    // wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    // wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: false,
    // forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${process.env.SERVER_BASE_URL}/api/broadcasting/auth`,
    auth: {
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        "X-Requested-With": "XMLHttpRequest",
      },
    },
    withCredentials: true,
  });

  window.Echo.connector.pusher.connection.bind("connected", () => {
    console.log("✅ Reverb is connected and listening!");
  });
};

export default startBroadcasting;
