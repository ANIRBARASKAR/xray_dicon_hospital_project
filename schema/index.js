import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
addFormats(ajv);

var schemas = [
  "patient",
  "apointment",
  "report",
  "timestamp",
  "reportSchema/text",
  "reportSchema/dicom",
  "reportSchema/aireport",
]; // same to file names of schema folder

await Promise.all(
  schemas.map((modulename) =>
    import(`./${modulename}.js`)
      .then((module) => {
        ajv.addSchema(module.default, modulename);
      })
      .catch((err) => console.log(err))
  )
);

export default ajv;

// validate patientObject like:
