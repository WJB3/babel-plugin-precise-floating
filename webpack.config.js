module.exports={
    entry:"./src/index",
    module:{
        rules:[ {
            test:/\.js$/,
            use:'babel-loader',
            //排除node_modules目录下的文件
            exclude:/node_modules/
            
        }]
    },
}