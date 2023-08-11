const BackendUrl = require("./../constants.js").getBackendUrl();

//? for production use RAM for storing the login credentials,
//? just for developement we use localStorage for persistant sessioning

//todo remove alert() ; return error messages instead, to be handled by frontend!
//? allert breaks the existing code stability:
//? input if focused while alert, it becomes locked unfocused!
let user = {};
let token = "";

const atemptUser = {};
/*
returns a promice that is actually a api call to login server
success gives:
{
    user: {
        createdAt: "2023-01-01T12:55:26.383Z"
        email: "a@a.a"
        name: "aaaa"
        password: "$2a$10$xwJUM16Tvsvs0uyuWyNkPu0NAWh8FD2SprnDdmVSvLseLE8zmBXje"
        updatedAt: "2023-01-01T12:55:26.383Z"
        _id: "63b182be555b91131b807a91"
    }
}
failure gives:
{}
*/
function login(email, password) {
  console.log(email, password);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "manual",
  };

  return fetch(BackendUrl + "login", requestOptions)
    .then((response) => {
      if (!response.ok) {
        console.error(
          new Error({ message: response.statusText, code: response.status })
        );
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
      let errors = [];
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      if (result.errors?.msg && !Array.isArray(result.errors.msg)) {
        result.errors.msg = [JSON.parse(JSON.stringify(result.errors))];
      }

      result.errors?.msg.forEach((errorMsg) => {
        let { msg, value, param } = errorMsg;
        let sentence = `error message: ${param || ""} ${
          msg || ""
        } , given value: ${value || ""}`;
        errors.push(sentence);
      });

      if (errors.length) {
        return { message: JSON.stringify(errors) };
      } else {
        // localStorage.setItem('authentication', result.token)
        // localStorage.setItem('user', JSON.stringify(result.user))

        // if(result.user.role=='admin')window.location.pathname = '/pages/admin'
        // if(result.user.role=='user')window.location.pathname = '/pages/profile'
        if (result.user.role == "visitor") {
          return { message: "You are not yet activated by admin" };
        } else {
          result.message = "Logged inn successfully";
          user = result.user;
          token = result.token;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          return result;
        }
      }
    })
    .catch((error) => {
      if (error.errors?.msg && !Array.isArray(error.errors.msg)) {
        error.errors.msg = [JSON.parse(JSON.stringify(error.errors))];
      }
      console.log("error", error);
      let errors = [];
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      error.errors?.msg.forEach((errorMsg) => {
        let { msg, value, param } = errorMsg;
        let sentence = `error: ${msg} in value "${value}" as parameter ${param}`;
        errors.push(sentence);
      });
      return { message: JSON.stringify(errors) };
    });
}

function signup(email, password, name) {
  console.log(email, password, name);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("name", name);
  urlencoded.append("password", password);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "manual",
  };

  return fetch(BackendUrl + "register", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error({
          message: response.statusText,
          code: response.status,
        });
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
      let errors = [];
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      if (result.errors?.msg && !Array.isArray(result.errors.msg)) {
        result.errors.msg = [JSON.parse(JSON.stringify(result.errors))];
      }

      result.errors?.msg.forEach((errorMsg) => {
        let { msg, value, param } = errorMsg;
        let sentence = `error message: ${param || ""} ${
          msg || ""
        } , given value: ${value || ""}`;
        errors.push(sentence);
      });

      if (errors.length) {
        alert(JSON.stringify(errors));
        return {};
      } else {
        // localStorage.setItem('authentication', result.token)
        // localStorage.setItem('user', JSON.stringify(result.user))

        // if(result.user.role=='admin')window.location.pathname = '/pages/admin'
        // if(result.user.role=='user')window.location.pathname = '/pages/profile'
        if (result.user.role == "visitor") {
          alert("You are not yet activated by admin");
          return {};
        } else {
          alert("Logged inn successfully");
          user = result.user;
          token = result.token;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);

          return result;
        }
      }
    })
    .catch((error) => {
      if (error.errors?.msg && !Array.isArray(error.errors.msg)) {
        error.errors.msg = [JSON.parse(JSON.stringify(error.errors))];
      }
      console.log("error", error);
      let errors = [];
      // result.message?.forEach(errorMsg => {
      //   let sentence = `message: ${msg} in value "${value}" as parameter ${param}`
      // });
      error.errors?.msg.forEach((errorMsg) => {
        let { msg, value, param } = errorMsg;
        let sentence = `error: ${msg} in value "${value}" as parameter ${param}`;
        errors.push(sentence);
      });
      alert(JSON.stringify(errors));
    });
}

function logout() {
  user = {};
  token = "";
  localStorage.setItem("user", false);
  localStorage.setItem("token", false);
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
  // return user;
}
function getUserToken() {
  return localStorage.getItem("token");
  // return token;
}

function isLoggedIn() {
  return getUser()?._id ? true : false;
}

module.exports = { getUser, login, signup, isLoggedIn, getUserToken, logout };
