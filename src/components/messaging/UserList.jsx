import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, Divider, TextField, Button, Grid } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    header: {
        height: "60px",
        backgroundColor: "#075E54",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    userList: {
        flex: 1,
        overflow: "auto",
        padding: "10px",
    },
    chatContainer: {
        flex: 2,
        overflow: "auto",
        padding: "10px",
    },
    messageInput: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
    },
    messageTextField: {
        flex: 1,
        marginRight: "10px",
    },
}));

function UserList({ users, handleUserClick, handleAddUser, newUser, handleNewUserChange }) {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={4}>
            <div className={classes.userList}>
                <List>
                    {users.map((user, index) => (
                        <React.Fragment key={index}>
                            <ListItem button onClick={() => handleUserClick(user)}>
                                <ListItemText primary={user} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <div>
                    <TextField
                        label="Add User"
                        variant="outlined"
                        value={newUser}
                        onChange={handleNewUserChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddUser}>
                        Add
                    </Button>
                </div>
            </div>
        </Grid>
    );
}

export default UserList;
