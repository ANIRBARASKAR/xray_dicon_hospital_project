// not for sencitive  constants...

module.exports = {
    uploadPath: __dirname + '/uploads',
    resourcesPath: process.resourcesPath,
    isPackaged: true,
    backendHosted: false,
    getBackendUrl: function () {
        const url_replit = "https://dive-server.udayamalla27.repl.co/"
        const localhost = "http://localhost:3000/"

        const backendHosted = true;

        return backendHosted
            ? url_replit
            : localhost
    }
}