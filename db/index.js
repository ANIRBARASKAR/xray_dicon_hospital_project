// all indexdb localforage funcitons to be exposed to app window

import localforage from "localforage";
import patientsDB from "./CRUD/patientsDB";
import userDataDB from "./CRUD/userDataDB";
import userDataDB from "./CRUD/reportsDB";
import setAuthMiddleware from "./authMiddleware";

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
const user = userDataDB(patientStore)

const operations = {
  ...patient,
  ...user
}

setAuthMiddleware(operations)


export default operations