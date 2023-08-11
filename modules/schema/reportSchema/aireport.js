module.exports =  {
    type:'object',
    properties:{
        report_type:{const:'aireport'},
        lable:{type:'string'},
        sub_lable:{type:'string'},
        path:{type:'string'}
    },
    required:["report_type","path"]
}