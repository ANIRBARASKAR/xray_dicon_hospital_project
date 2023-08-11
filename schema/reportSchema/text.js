export default {
    type: 'object',
    properties: {
        report_type: { const: 'text' },
        data: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    lable: { type: 'string' },
                    value: { type: 'string' }
                },
                required: [value]
            }
        }
    },
    required: [value]
}