import timestaps from "./timestaps.js"
import text from "./reportSchema/text.js"
import dicom from "./reportSchema/dicom.js"
import aiReport from "./reportSchema/aireport.js"

export default {
	type:'object',
	properties: {
		report_id:{type:'string',format:'uuid'},
		timestaps,
		report_data:{
			oneOf:[
				text,
				dicom,
				aiReport
			]
		}
	},
	required:[report_id,timestaps,report_data]
}