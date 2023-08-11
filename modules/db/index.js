// all indexdb localforage funcitons to be exposed to app window

const localforage = require( "localforage");
const patientsDB = require( "./CRUD/patientsDB");
const userDataDB = require( "./CRUD/userDataDB");
const setAuthMiddleware = require( "./authMiddleware");

localforage.config({
    name: 'aikalpa'
});

var patientStore = localforage.createInstance({
  name: "Patients"
});
const patient = patientsDB(patientStore)

var userDataStore = localforage.createInstance({
  name: "User"
});
const user = userDataDB(userDataStore)

const operations = {
  ...patient,
  ...user
}

setAuthMiddleware(operations)


module.exports = operations