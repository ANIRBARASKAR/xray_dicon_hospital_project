import timestaps from "./timestaps.js"
import apointment from "./apointment.js"

export default {
	type: 'object',
	properties: {
		patient_id: { type: 'string', format: 'uuid' },
		ref_id: { type: 'string', format: 'uuid' },
		age: { type: 'integer', minimum: 0, maximum: 200 },
		gender: { enum: ['male', 'female', 'other'] },
		name: { type: 'string', maxLength: 50 },
		contact_number: { type: 'string', patern: '^[0-9]{10}$' },
		timestaps,
		appointments: { type: 'array', uniqueItems: true, items: apointment }
	},
	required: [patient_id, age, gender, name, contact_number]
}