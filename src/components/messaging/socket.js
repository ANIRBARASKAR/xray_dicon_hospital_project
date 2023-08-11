import { io } from "socket.io-client";

const socket = io(electron.config.getBackendUrl(), //! has '/' at the end, should not be there?
    {
        autoConnect: false,
        extraHeaders: {
            Authorization: `Bearer ${electron.auth.getUserToken()}`
        }
    });

export default socket;