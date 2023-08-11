const timestamp = require("../timestamp.js")
const appointment = require("../appointment.js")

module.exports =  {
    type: 'object',
    properties: {
        page: { type: 'integer', minimum: 0 },
        pageSize: { type: 'integer', minimum: 0 },
        factor: {
            enum: ['_id', 'referance_id', 'age', 'gender'
                , 'laterality', 'name', 'contact_number','lastVisited','visits']
        },
        ascending: { type: 'boolean' }
    },
    required:[]
}


