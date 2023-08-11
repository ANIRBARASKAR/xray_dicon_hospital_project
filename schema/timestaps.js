export default {
	type:'object',
	properties: {
		created:{type:'string',format:'iso-date-time'},
		last_modified:{type:'string',format:'iso-date-time'},
	},
	required:[created,last_modified]
}