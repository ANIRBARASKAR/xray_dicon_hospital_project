import React, { useState, useEffect, useContext, useRef } from "react";
import Box from "@mui/material/Box";

import {
  ConnectionsContext,
  ChatContext,
  SocketContext,
} from "./ContextProvider.js";
import Button from "@mui/material/Button";
import ExpandMore from "@mui/icons-material/ExpandMore";

import styled from "styled-components";
import moment from "moment";

export default function ChatArea({ chats = [] }) {
  chats = JSON.parse(JSON.stringify(chats));
  const listRef = useRef(null);
  const { loadActiveConnectionChats, ActiveConnectionId } =
    useContext(ChatContext);
  const userId = electron.auth.getUser()._id;

  useEffect(() => {
    if (!chats || chats.length == 0) {
      loadActiveConnectionChats();
    }
  }, [ActiveConnectionId]);

  chats = chats.reverse();
  return (
    <Box
      component="div"
      ref={listRef}
      sx={{
        overflowY: "scroll",
        height: "-webkit-fill-available",
        display: "flex",
        flexDirection: "column-reverse",
        backgroundColor: "aliceblue",
      }}
    >
      {/* render the chats list here */}
      {chats.map((chat) => {
        return chat.senderId == userId ? (
          <SentChat chat={chat} key={chat._id} />
        ) : (
          <ReceivedChat chat={chat} key={chat._id} />
        );
      })}

      <Button
        variant="outlined"
        startIcon={<ExpandMore />}
        onClick={loadActiveConnectionChats}
        sx={{ margin: "auto" }}
      >
        Load More Chat
      </Button>
    </Box>
  );
}
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isSent }) => (isSent ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
  margin-left: ${({ isSent }) => (isSent ? "0" : "10px")};
  margin-right: ${({ isSent }) => (isSent ? "10px" : "0")};
`;

const MessageBubble = styled.div`
  padding: 10px;
  margin: 2px;
  border-radius: ${({ isSent }) =>
    isSent ? "16px 0px 16px 16px" : "0px 16px 16px 16px"};
  background-color: ${({ isSent }) => (isSent ? "#0d6efd" : "white")};
  color: ${({ isSent }) => (isSent ? "white" : "black")};
  max-width: 70%;
  word-wrap: break-word;
  font-size: 14px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const TimeStamp = styled.p`
  font-size: 10px;
  color: ${({ isSent }) => (isSent ? "black" : "gray")};
  align-self: ${({ isSent }) => (isSent ? "flex-end" : "flex-start")};
  margin: 3px;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ isSent }) => (isSent ? "0" : "10px")};
  margin-right: ${({ isSent }) => (isSent ? "10px" : "0")};
`;

const SeenStatus = styled.p`
  font-size: 10px;
  color: ${({ isSeen }) => (isSeen ? "green" : "gray")};
  margin: 3px;
`;

const Messagetext = styled.p`
  margin: 2px;
`;
function SentChat({ chat }) {
  if (!chat) {
    return "some error...";
  }
  return (
    <MessageContainer isSent>
      <MessageBubble isSent>
        <Messagetext>{chat.message}</Messagetext>
      </MessageBubble>
      <StatusContainer isSent>
        <TimeStamp isSent>{moment(chat.createdAt).format("h:mm A")}</TimeStamp>
        <SeenStatus isSeen={chat.status === "seen"}>{chat.status}</SeenStatus>
      </StatusContainer>
    </MessageContainer>
  );
}

function ReceivedChat({ chat }) {
  const { markSeenAllMessages } = useContext(ChatContext);

  useEffect(() => {
    if (chat.status === "unseen") {
      markSeenAllMessages(chat.senderId);
    }
  }, []);

  if (!chat) {
    return "some error...";
  }
  const isSameDay = moment(chat.createdAt).isSame(moment(), "day");
  const isSameYear = moment(chat.createdAt).isSame(moment(), "year");
  const timeFormat = isSameDay ? "h:mm A" : isSameYear ? "D MMMM" : "D MMM YY";
  return (
    <MessageContainer>
      <MessageBubble>
        <Messagetext>{chat.message}</Messagetext>
      </MessageBubble>
      <StatusContainer>
        <TimeStamp>{moment(chat.createdAt).format(timeFormat)}</TimeStamp>
      </StatusContainer>
    </MessageContainer>
  );
}

function PatientCard({ patientData }) {
  console.log(patientData);
  return (
    <div>
      <Messagetext sx={{ color: "purple" }}>{patientData.name}</Messagetext>
    </div>
  );
}
