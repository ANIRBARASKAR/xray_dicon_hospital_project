import timestaps from "./timestaps.js"
import report from "./report.js"

export default {
	properties: {
		apointment_id:{type:'string',format:'uuid'},
		timestaps,
		reports: {type:'array', uniqueItems: true, items: report}
	},
	required:[patient_id,age,gender,name,contact_number]
}