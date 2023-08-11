import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, Divider, TextField, Button, Grid } from "@material-ui/core";
import UserList from "./UserList.jsx";


function ChatApp({ util }) {
    const [users, setUsers] = useState(["John Doe"]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [newUser, setNewUser] = useState("");
    const token = electron.auth.getUserToken()
    if (!token) {
        //
        alert(
            'please login first'
        )
        return <button onClick={() => { util.navigate('Login') }}>Login</button>
    }

    useEffect(() => {
        // Fetch users from server and set to users state
        // You can use socket.io for real-time chat or a REST API for polling users
    }, []);

    useEffect(() => {
        if (selectedUser) {
            // Fetch messages for selected user from server and set to messages state
            // You can use socket.io for real-time chat or a REST API for polling messages
        } else {
            setMessages([]);
        }
    }, [selectedUser]);

    const fetchContacts = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var formdata = new FormData();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: formdata,
            redirect: 'manual'
        };

        return await fetch("http://localhost:3000/profile", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error({ message: response.statusText, code: response.status });
                }
                return response.json();
            }).then(result => {
                // console.log(result);
                return result
            })
            .catch(error => {
                console.error(error);
                if (error.code == 401) {
                    electron.auth.logout()
                    util.navigate('Login');
                }
            });
    }

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSend = () => {
        // Send new message to server and add to messages state
        // You can use socket.io for real-time chat or a REST API for sending messages
        setMessages([...messages, newMessage]);
        setNewMessage("");
    };

    const handleNewUserChange = (event) => {
        setNewUser(event.target.value);
    };

    const handleAddUser = () => {
        if (newUser.trim() !== "") {
            setUsers([...users, newUser]);
            setNewUser("");
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <h2>Chat App</h2>
            </div>
            <Grid container spacing={2}>
                <UserList users={users} handleUserClick={handleUserClick} handleAddUser={handleAddUser} newUser={newUser} handleNewUserChange={handleNewUserChange} />
                <Grid item xs={12} sm={8}>
                    <div className={classes.chatContainer}>
                        {selectedUser ? (
                            <List>
                        
                                {messages.map((message, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={message}
                                                secondary={new Date().toLocaleTimeString()}
                                                sx={{ wordBreak: "break-all" }}
                                            />
                                            
                                        </ListItem>
                                       <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <p>Select a user to start chatting</p>
                        )}
                    </div>
                    <div className={classes.messageInput}>
                        <TextField
                            className={classes.messageTextField}
                            label="Type a message"
                            variant="outlined"
                            value={newMessage}
                            onChange={handleMessageChange}
                        />
                        <Button variant="contained" color="primary" onClick={handleSend}>
                            Send
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default ChatApp;
