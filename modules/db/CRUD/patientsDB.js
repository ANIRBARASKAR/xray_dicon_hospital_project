const ajv = require("./../../schema/index.js");
const ulid = require("ulid");

/**
 *
 * @param {localForage database instance} patientStore
 * @returns CRUD functions for patient database
 */

let successCallback = function (err, value) {
  console.log(err, value);
};

let unknownError = {
  message: "unknown error",
  status: "not ok",
  code: 6,
  time: Date(),
};
let validationError = {
  message: "request format not valid",
  status: "not ok",
  code: 5,
  time: Date(),
};
let objectNotFound = {
  message: "requested object not found",
  status: "not ok",
  code: 3,
  time: Date(),
};

let objectFetched = {
  message: "object fetched successfully",
  status: "ok",
  code: 1,
  time: Date(),
};
let objectEdited = {
  message: "object edited successfully",
  status: "ok",
  code: 2,
  time: Date(),
};
let objectCreated = {
  message: "object created successfully",
  status: "ok",
  code: 2,
  time: Date(),
};
let objectDeleted = {
  message: "object deleted successfully",
  status: "ok",
  code: 4,
  time: Date(),
};

module.exports = function (patientStore) {
  return {
    getPatients: async function (
      page = 1,
      pageSize = 10,
      factor = "lastVisited",
      ascending = false
    ) {
      let queryData = { page, pageSize, factor, ascending };
      try {
        const validate = ajv.getSchema("querySehema/getPatients");
        const validation = validate(queryData);
        if (!validation) {
          return {
            validationError,
            resp: { error: validate.errors },
            req: { queryData },
            error: validate.errors[0],
          };
        }

        let patients = [];
        let TotalPatients = 0;

        reverse = ascending ? 1 : -1;

        //! one based indexng is done on the database!!!
        const response = await patientStore
          .iterate((value, key, index) => {
            TotalPatients++;
            value.visits = value.appointments?.length;
            value.lastVisited = value.visits
              ? value.appointments[value.appointments.length - 1]?.timestamp
                  ?.created_at
              : value.firstVisited;
            value.appointments = undefined;
            if (!value._id) value._id = key;

            patients.push(value);
          }, successCallback)
          .catch((x) => console.error(x));

        patients = patients
          .sort((p1, p2) => (p1[factor] > p2[factor] ? 1 : -1) * reverse)
          .slice((page - 1) * pageSize, page * pageSize);

        return {
          objectFetched,
          resp: { patients, response, TotalPatients },
          req: { page, pageSize },
          error: {},
        };
      } catch (error) {
        return { unknownError, req: { queryData }, error: error };
      }
    },
    getPatient: async function (patientId) {
      console.log(patientId);
      if (!patientId) {
        console.log("no patientId provided!");
        return;
      }
      let response;
      try {
        response = await patientStore.getItem(patientId, successCallback);
      } catch (error) {
        console.log(error);
      }

      if (!response) {
        return {
          objectNotFound,
          req: { patientId },
          resp: { response },
          error: objectNotFound,
        };
      }
      console.log(response);

      return {
        objectFetched,
        resp: { patient: response },
        req: { patientId },
        error: {},
      };
    },
    setPatient: async function (patientData) {
      const validate = ajv.getSchema("patient");
      const validation = validate(patientData);
      if (!validation) {
        return {
          validationError,
          resp: { error: validate.errors },
          req: { patientData },
          error: validate.errors[0],
        };
      }

      patientData._id = ulid.ulid();
      patientData.appointments.forEach((appointment, index) => {
        appointment._id = patientData._id + "-" + index;
        appointment.reports.forEach((report, index) => {
          report._id = appointment._id + "-" + index;
        });
      });

      const response = await patientStore
        .setItem(patientData._id, patientData, successCallback)
        .catch((x) => console.error(x));

      return {
        objectCreated,
        resp: { patientId: patientData._id, response, patientData },
        req: { patientData },
        error: {},
      };
    },  
    editPatient: async function (patientId, patientData) {
      const validate = ajv.getSchema("patient");
      const validation = validate(patientData);

      console.log(validation);
      if (!validation) {
        return {
          validationError,
          resp: { error: validate.errors },
          req: { patientData },
          error: validate.errors[0],
        };
      }
      let response;
      try {
        response = await patientStore.getItem(patientId, successCallback);
        console.log(response);

        response = await patientStore
          .setItem(patientId, patientData, successCallback)
          .catch((x) => console.error(x));
        console.log(response);

        if (!response) {
          return {
            objectNotFound,
            req: { patientId },
            resp: { response },
            error: {},
          };
        }
      } catch (error) {
        console.log(error);
      }

      return {
        objectEdited,
        req: { patientId, patientData },
        resp: { response },
        error: {},
      };
    },
    deletePatient: async function (patientId) {
      let response = await patientStore.getItem(patientId, successCallback);

      if (!response) {
        return {
          objectNotFound,
          req: { patientId },
          resp: { response },
          error: {},
        };
      }
      response = await patientStore.removeItem(patientId, successCallback);
      return {
        objectDeleted,
        req: { patientId },
        resp: { response },
        error: {},
      };
    },
    deleteAllPatients: async function () {
      patientStore
        .clear()
        .then(function () {
          // Run this code once all data has been removed
          console.log("All data has been removed from the patientStore");
        })
        .catch(function (err) {
          // This code runs if there were any errors
          console.log(err);
        });
      return {
        objectDeleted,
        req: "delete all patients request",
        resp: {},
        error: {},
      };
    },
  };
};
