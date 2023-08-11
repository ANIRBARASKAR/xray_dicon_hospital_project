import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
} from "react";

export const ChatContext = createContext(null);
export const ConnectionsContext = createContext(null);
export const SocketContext = createContext(null);
export const PatientContext = createContext(null);

import io from "socket.io-client";

export default function MessagingContext({ children }) {
  let [ConnectionsList, setConnectionsList] = useState([]);

  function getErrorString(errorObj) {
    let errors = [];
    // result.message?.forEach(errorMsg => {
    //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
    // });
    errorObj.forEach((errorMsg) => {
      let { msg, value, param } = errorMsg;
      let sentence = `error: ${msg} in provided value ${value} for parameter ${param}`;
      errors.push(sentence);
    });

    return JSON.stringify(errors);
  }

  async function addConnection(email) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + electron.auth.getUserToken());
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("connectionEmail", email);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "manual",
    };

    return await fetch(
      electron.config.getBackendUrl() + "profile/connection",
      requestOptions
    )
      .then((response) => {
        // if (!response.ok) {
        //     throw new Error(message, { message: response.statusText, code: response.status });
        // }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        result.messages = [];
        if (result.errors) {
          alert(getErrorString(result.errors.msg));
        } else if (result.code >= 400) {
          alert(result.message);
        } else {
          alert("connection added!", "success");
          let connectionId = result[1]._id;
          setConnectionsList({ ...ConnectionsList, connectionId: result[1] });
        }
      })
      .catch((error) => {
        alert("some error!");
        // console.log('error', error)
      });
  }
  const connections = { ConnectionsList, setConnectionsList, addConnection };

  const [ActiveConnectionId, setActiveConnectionId] = useState();

  function getActiveConnectionMessages() {
    // console.log('active:', getActiveConnection()?.messages);
    return getActiveConnection()?.messages || [];
  }
  function getActiveConnection() {
    return ConnectionsList[ActiveConnectionId];
  }
  async function loadActiveConnectionChats(page, limit) {
    try {
      let lastMessageId = ConnectionsList[ActiveConnectionId]?.messages[0]?._id;
      let chats = await fetchActiveConnectionChatsFor(
        ActiveConnectionId,
        lastMessageId,
        page,
        limit
      );
      // console.log(chats);
      chats = chats.docs;
      if (!chats || chats.length == 0) {
        alert("no more chats available!");
      }
      addToChatMessages(chats, true);
    } catch (error) {
      alert(error.message || "some error fetching more chats", "error");
    }
    // fetch chats and return as array
  }

  async function fetchActiveConnectionChatsFor(
    userId,
    lastMessageId,
    page = 1,
    limit = 10
  ) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + electron.auth.getUserToken());

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "manual",
    };

    return fetch(
      electron.config.getBackendUrl() +
        `chat?page=${page}&limit=${limit}&sort=_id&order=-1&user=${userId}&lastMessageId=${lastMessageId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        return response;
      })
      .catch((error) => {
        alert("error", "error");
        // console.log('error', error)
      });
  }
  function updateMessageStatus(receiverId, messageId, status) {
    let userId = electron.auth.getUser()._id;
    setConnectionsList((PrevConnectionsList) => {
      PrevConnectionsList[receiverId].messages.forEach((m) => {
        if (messageId == m._id) {
          m.status = status;
        }
      });
      // console.log(PrevConnectionsList);
      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }
  function updateUserStatus(userId, status) {
    setConnectionsList((PrevConnectionsList) => {
      PrevConnectionsList[userId].status = status;
      // console.log(PrevConnectionsList);
      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }

  function addToChatMessages(messages = [], addToTop = false) {
    if (!Array.isArray(messages)) {
      // console.log('messages provided as object!');
      messages = [messages];
    }
    let userId = electron.auth.getUser()._id;
    setConnectionsList((PrevConnectionsList) => {
      messages.forEach((message) => {
        let connectionId;
        if (message.senderId == userId) {
          connectionId = message.receiverId;
        } else {
          connectionId = message.senderId;
        }
        if (!PrevConnectionsList[connectionId]?.messages) {
          PrevConnectionsList[connectionId].messages = [];
        }
        !addToTop
          ? PrevConnectionsList[connectionId].messages.push(message)
          : PrevConnectionsList[connectionId].messages.unshift(message);
      });
      // console.log(PrevConnectionsList);
      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }

  function markSeenAllMessages(userId) {
    setConnectionsList((PrevConnectionsList) => {
      PrevConnectionsList[userId].messages.forEach((message) => {
        if (message.status == "unseen" && message.senderId == userId) {
          message.status = "seen";
          socket.emit("chat:seen", message);
        }
      });
      // console.log(PrevConnectionsList, 'markSeenAllMessages', userId);

      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }

  const sendMessage = (message) => {
    // console.log(message);

    if (!socket.connected) {
      // console.log('socket not connected!!');
    }
    socket.emit("chat:message", generateSendingMessage(message));
  };
  function generateSendingMessage(messageString) {
    let sendingMessage = {
      receiverId: ActiveConnectionId,
      senderId: electron.auth.getUser()._id,
      message: messageString,
    };
    if (ActivePatientId != "general") {
      // console.log('adding patient id generateSendingMessage', ActivePatientId);
      sendingMessage["linkedPatient"] = ActivePatientId;
    }
    return sendingMessage;
  }

  const chat = {
    ActiveConnectionId,
    setActiveConnectionId,
    loadActiveConnectionChats,
    getActiveConnection,
    getActiveConnectionMessages,
    addToChatMessages,
    sendMessage,
    markSeenAllMessages,
  };

  const [ActivePatientId, setActivePatientId] = useState("general");

  function getActivePatient() {
    // // console.log();
    return getActiveConnection()?.PatientsList[ActivePatientId];
  }

  function setActiveConnectionPatientId(PatientId) {
    if (ConnectionsList[ActivePatientId].PatientsList[PatientId]) {
      setActivePatientId(PatientId);
    } else {
      // console.log('this patient is yet not shared ...');
    }
  }
  async function sendPatient(ptientId) {
    if (!ActivePatientId) {
      console.error("cant send patient, no patient selected...");
    } else {
      let patientData = await generateSendingPatient(ptientId);
      socket.emit("patient:share", patientData);
    }
  }
  async function generateSendingPatient(id) {
    // get patient from db, return as it is
  }
  function sendPatientMessage(messageString) {
    if (!ActivePatientId) {
      console.error("cant send patient message, no patient selected...");
    } else {
      socket.emit("chat:message", generateSendingMessage(messageString));
    }
  }

  function markSeenAllPatientMessages(patientId) {
    setConnectionsList((PrevConnectionsList) => {
      if (PrevConnectionsList[ActiveConnectionId].PatientsList[patientId]) {
        PrevConnectionsList[ActiveConnectionId].PatientsList[
          patientId
        ].messages.forEach((message) => {
          if (message.status == "unseen" && message.senderId == userId) {
            message.status = "seen";
            socket.emit("chat:seen", message);
          }
        });
        // console.log(PrevConnectionsList, 'markSeenAllPatientMessages', userId);
      }
      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }
  function markSeenAllPatients(userId) {
    setConnectionsList((PrevConnectionsList) => {
      Object.keys(PrevConnectionsList[userId].PatientsList).forEach(
        (patientId) => {
          let patient = PrevConnectionsList[userId].PatientsList;
          if (patient.status == "unseen" && patient.senderId == userId) {
            patient.status = "seen";
            patient.messages = [];
            socket.emit("patient:seen", patient);
          }
        }
      );
      // console.log(PrevConnectionsList, 'markSeenAllPatients', userId);

      return JSON.parse(JSON.stringify(PrevConnectionsList));
    });
  }

  const patient = {
    setActiveConnectionPatientId,
    markSeenAllPatients,
    sendPatient,
    getActivePatient,
    markSeenAllPatients,
    sendPatientMessage,
    markSeenAllPatientMessages,
  };

  const [socket, setSocket] = useState(null);

  function connect() {}

  useEffect(() => {
    try {
      const newSocket = io(electron.config.getBackendUrl(), {
        extraHeaders: {
          Authorization: `Bearer ${electron.auth.getUserToken()}`,
        },
      }); // your server URL here

      // if (newSocket.connected) // console.log('connection established...');
      // else {
      //     alert('some error occured while connecting', 'error')
      //     return;
      // }
      setSocket(newSocket);

      return () => newSocket.close();
    } catch (error) {
      alert("error-socket", "error");
      // console.log('error-socket', error);
    }
  }, []);

  useEffect(() => {
    socket &&
      socket.on("connect_error", (error) => {
        // console.log('connect_error', error, error.message, JSON.parse(JSON.stringify(error)))
        if (
          error.message === "net::ERR_CONNECTION_REFUSED" ||
          error.message == "xhr poll error"
        ) {
          alert(
            "Your internet connection is loose. Please try again later.",
            "error"
          );
        } else if (error.message === "jwt expired") {
          alert(
            "Your login session has expired. Please log in again.",
            "error"
          );
        } else if (
          error.message === "invalid token" ||
          error.message === "Unauthorized"
        ) {
          alert("Some authentication error! Please log in again.", "error");
        } else {
          alert("connect_error", "error");
        }
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("chat:message", (message) => {
        // console.log('messag read...');
        markSeenAllMessages(message.senderId);
        addToChatMessages(message);
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("chat:sending", (message) => {
        // console.log('sending...');
        addToChatMessages(message);
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("chat:seen", (message) => {
        // console.log('message seen...', message);
        updateMessageStatus(message.receiverId, message._id, "seen");
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("error", (message) => {
        alert(message.message, "warning");
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("user:init", (connectionsData) => {
        // console.log(connectionsData);
        setConnectionsList(connectionsData);
        setActiveConnectionId(Object.keys(connectionsData)[0]);
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("user:now_offline", (userId) => {
        // console.log(userId);
        updateUserStatus(userId, "offline");
      });
  }, [socket]);
  useEffect(() => {
    socket &&
      socket.on("user:now_online", (userId) => {
        // console.log(userId);
        updateUserStatus(userId, "online");
      });
  }, [socket]);

  return (
    <ChatContext.Provider value={chat}>
      <ConnectionsContext.Provider value={connections}>
        <SocketContext.Provider value={socket}>
          <PatientContext.Provider value={patient}>
            {children} 
          </PatientContext.Provider>
        </SocketContext.Provider>
      </ConnectionsContext.Provider>
    </ChatContext.Provider>
  );
}
