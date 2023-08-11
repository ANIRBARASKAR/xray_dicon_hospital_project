module.exports = {
	type: 'object',
	properties: {
		created_at: { type: 'number'},
		// created_at: { type: 'string', format: 'iso-date-time' },
		last_modified: { type: 'number'},
		// last_modified: { type: 'string', format: 'iso-date-time' },
	},
	// required: ["created_at", "last_modified"]
}