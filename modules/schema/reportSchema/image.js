module.exports =  {
    type:'object',
    properties:{
        report_type:{const:'image'},
        lable:{type:'string'},
        sub_lable:{type:'string'},
        path:{type:'string'},
        notes:{type:'object'}
    },
    required:["report_type","path"]

}