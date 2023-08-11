const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv()
addFormats(ajv)
// addFormats(ajv, ["iso-date-time","uuid"])

const schemas = [
    'patient',
    'appointment',
    'report',
    'timestamp',
    'reportSchema/text',
    'reportSchema/dicom',
    'reportSchema/aireport',

    'querySehema/getPatients',
]; // same to file names of schema folder

schemas.forEach(modulename => {
    const module = require(`./${modulename}.js`)
    let resp = ajv.addSchema(module, modulename)
    // console.log(('schema adding: ' + modulename + ': ', resp)
})

module.exports = ajv

/*
validate patientObject like: 

const ajv = require('./../../schema/index.js') //relativ path to this file  

const validate = ajv.getSchema('querySehema/getPatients')  // exact name from schemas array
const validation = validate(queryData)
if (!validation) {
    return { validationError  }
}
*/


