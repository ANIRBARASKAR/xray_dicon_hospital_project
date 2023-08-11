const { exec } = require("child_process");
const path = require("path");
const fs = require("fs-extra");
const resourcesPath = require("./../constants").resourcesPath;
const db = require("./db/index.js");
const ulid = require("ulid");

//! this was one big chellange, to decide locations of directories in packaged and dev modes...
let isPackaged = require("./../constants").isPackaged;
let inputPath = isPackaged
  ? path.join(resourcesPath, "./../Input")
  : path.join(__dirname, "./../Input");
let outputPath = isPackaged
  ? path.join(resourcesPath, "./../Output")
  : path.join(__dirname, "./../Output");

let uploadPath = require("./../constants").uploadPath;

function getAllScriptNames() {
  //check scripts direcory and return scrings array of all exe scripts available...

  const scriptPath = path.join(__dirname, `../scripts/`);
  try {
    const files = fs.readdirSync(scriptPath);
    //.exe for windows, .app for mac, .bin .out .elf for linux based scripts.
    const exeAppBinOutFiles = files.filter(
      (file) =>
        file.endsWith(".exe") ||
        file.endsWith(".app") ||
        file.endsWith(".bin") ||
        file.endsWith(".out") ||
        file.endsWith(".elf")
    );
    const exeAppBinOutFileNames = exeAppBinOutFiles.map((filename) =>
      filename.replace(/\.(exe|app|bin|out|elf)$/, "")
    );
    console.log(exeAppBinOutFiles, exeAppBinOutFileNames);
    return exeAppBinOutFileNames;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// files is array of file names as strings
function inputFiles(files = []) {
  // Make sure inputPath exists, if not create it
  if (!fs.existsSync(inputPath)) {
    fs.mkdirSync(inputPath, { recursive: true });
  }

  // Empty the contents of inputPath
  const existingFiles = fs.readdirSync(inputPath);
  existingFiles.forEach((file) => {
    const filePath = path.join(inputPath, file);
    fs.unlinkSync(filePath);
  });

  // Copy all files from files[] to inside inputPath
  files.forEach((file) => {
    const fileName = path.basename(file);
    const destFilePath = path.join(inputPath, fileName);
    fs.copyFileSync(file, destFilePath);
  });
}
function runScript(ScriptName) {
  // check inputPath exists and is not empty, scriptPath exists and is not empty

  const scriptPath = path.join(__dirname, `../scripts/${ScriptName}`);
  return new Promise((resolve, reject) => {
    exec(scriptPath, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function fetchOutputFor(patientId, ScriptName) {
  //move outputs to uploads after creating new appointment for patient with the AI reports...
  //clean outputs directory for next time use...
  const patientData = await db.getPatient(patientId);
  let Patient = patientData.resp.patient;

  const appointment = {
    reports: [],
    examination_type: "AI_" + ScriptName.slice(0, 5),
  };
  let timestamp = {
    created_at: Date.now(),
    last_modified: Date.now(),
  };

  appointment.timestamp = timestamp;
  appointment._id = patientId + "-" + Patient.appointments.length;

  // Empty the contents of inputPath
  const outputFiles = fs.readdirSync(outputPath);
  outputFiles.forEach(async (file, index) => {
    const oldFilePath = path.join(outputPath, file);
    const newFilePath = path.join(
      uploadPath,
      ulid.ulid() + "." + file.split(".").reverse()[0]
    );

    let resp = fs.copyFileSync(oldFilePath, newFilePath);

    appointment.reports.push({
      _id: appointment._id + "-" + index,
      timestamp: appointment.timestamp,
      report_data: {
        report_type: "dicom",
        // report_type: file.mimeType.indexOf('image/') != -1 ? 'image' : 'dicom',
        label: path.basename(oldFilePath),
        sub_label: "img sub label",
        path: newFilePath,
      },
    });

    fs.unlinkSync(oldFilePath);
  });

  Patient.appointments.push(appointment);

  await db
    .editPatient(patientId, Patient)
    .then((res) => {
      console.log(res);
      if (res.objectEdited) {
        console.log("added");
      } else {
        alert(res.error.instancePath + " " + res.error.message);
      }
      // setLoder(false)
    })
    .catch((e) => {
      // setLoder(false)
      console.log(e);
    });

  return appointment;
}

let paths = {
  __dirname: __dirname,
  inputPath,
  outputPath,
  resourcesPath,

  /* in built app:
inputPath:"C:\\Users\\bawne\\AppData\\Local\\electron_react_app\\app-1.0.0\\Input"
outputPath:"C:\\Users\\bawne\\AppData\\Local\\electron_react_app\\app-1.0.0\\Output"
resourcesPath:"C:\\Users\\bawne\\AppData\\Local\\electron_react_app\\app-1.0.0\\resources"
__dirname:"C:\\Users\\bawne\\AppData\\Local\\electron_react_app\\app-1.0.0\\resources\\app\\modules"


  */
};

module.exports = {
  runScript,
  inputFiles,
  fetchOutputFor,
  getAllScriptNames,
  paths,
};
