const timestamp = require("./timestamp.js")
const appointment = require("./appointment.js")

module.exports =  {
	type: 'object',
	properties: {
		_id: { type: 'string', maxLength: 26, minLength:26},
		referance_id: { type: 'string', maxLength: 50 },
		age: { type: 'integer', minimum: 0, maximum: 200 },
		gender: { enum: ['male', 'female', 'trans'] },
		laterality: { enum: ['left', 'right', 'neutral'] },
		name: { type: 'string', maxLength: 50, minLength:3 },
		contact_number: { type: 'string', pattern: '^[0-9]{10}$' },
		timestamp,
		appointments: { type: 'array', uniqueItems: true, items: appointment },
		firstVisited:  { type: 'number'}
	},
	required: [ "age", "gender", "name"]
}