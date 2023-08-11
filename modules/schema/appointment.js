const timestamp = require("./timestamp.js")
const report = require("./report.js")

module.exports =  {
	type:'object',
	properties: {
		_id: { type: 'string', minLength:26},
		notes: { type: 'string'},
		examination_type: { type: 'string', maxLength: 50, minLength:3 },
		timestamp,
		reports: {type:'array', uniqueItems: true, items: report}
	},
	required:["timestamp","reports", "examination_type"]
}  