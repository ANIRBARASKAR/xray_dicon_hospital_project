const path = require('path');
const ulid = require('ulid')
const fs = require('fs-extra');
const os = require('os');

// get application directory
const appDir = require('./../constants').uploadPath
// const appDir = path.resolve( os.homedir(), 'electron-app-files' );

//todo convert all functionns into const arrow funcitons somehow s.t. if someone gets access to override the file, should not be able to reasign the variables

let fileUploaded = { message: "file uploaded", status: "ok", code: 6, time: Date() }


function getExtension(filename) {
    return filename.split('.').reverse()[0]
}

function sanatizeName(name) {
    return name
}

function upload(file) {
    console.log(file)
    // ensure `appDir` exists
    let resp = fs.ensureDirSync(appDir);
    console.log(resp)

    // copy `files` recursively (ignore duplicate file names)
    file.name = sanatizeName(file.name)

    const filePath = path.resolve(appDir, ulid.ulid() + '.' + getExtension(file.name));

    if(!fs.existsSync(file.path)){
        console.error(file.path , 'does not exist');
    }
    resp = fs.copyFileSync(file.path, filePath);
    file.path = filePath
    console.log(file)

    return { fileUploaded, req: { file }, resp: { file } }
};


//todo display notification
// notification.filesAdded( files.length );

module.exports = {
    upload, read:fs.readFileSync
}