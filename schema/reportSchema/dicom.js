export default {
    type:'object',
    properties:{
        report_type:{const:'dicom'},
        lable:{type:'string'},
        value:{type:'string'},
        path:{type:'string'}
    },
    required:[value]
}