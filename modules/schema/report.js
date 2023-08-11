const timestamp = require("./timestamp.js")
const text = require("./reportSchema/text.js")
const dicom = require("./reportSchema/dicom.js")
const aiReport = require("./reportSchema/aireport.js")
const image = require("./reportSchema/image.js")

module.exports =  {
	type:'object',
	properties: {
		_id:{type:'string', minLength:26},
		timestamp,
		report_data:{
			oneOf:[
				text,
				dicom,
				aiReport,
				image
			]
		}
	},
	required:["timestamp","report_data"]
}