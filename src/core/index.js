 

module.exports=function({template:template,types:t}){
   
    var preOperationAST=template("FUN_NAME(ARGS)");//将0.1+0.2转化为addCalc的模板
    var requireAST=template("var PROPERTIES=require(SOURCE)");//引入相应函数的模板

    return {
        visitor:{
            Program:{
                exit:function(path){
                    path.unshiftContainer("body",requireAST({
                        PROPERTIES:t.ObjectPattern([
                            t.objectProperty(t.identifier("addCalc"),t.identifier("addCalc"), false, true),
                            t.objectProperty(t.identifier("minusCalc"),t.identifier("minusCalc"), false, true),
                            t.objectProperty(t.identifier("multCalc"),t.identifier("multCalc"), false, true),
                            t.objectProperty(t.identifier("diviCalc"),t.identifier("diviCalc"), false, true),
                        ]),
                        SOURCE: t.stringLiteral("calc/calc.js")
                    }))
                }
            },
            BinaryExpression:{ 
                exit:function(path){
                     
                    if(path.node.operator==="+"){
                        
                        path.replaceWith(
                            preOperationAST({
                                FUN_NAME:t.identifier("addCalc"),
                                ARGS:[path.node.left,path.node.right]
                            })
                        )
                    }
                    if(path.node.operator==="-"){
                        
                        path.replaceWith(
                            preOperationAST({
                                FUN_NAME:t.identifier("minusCalc"),
                                ARGS:[path.node.left,path.node.right]
                            })
                        )
                    }
                    if(path.node.operator==="*"){
                        
                        path.replaceWith(
                            preOperationAST({
                                FUN_NAME:t.identifier("multCalc"),
                                ARGS:[path.node.left,path.node.right]
                            })
                        )
                    }
                    if(path.node.operator==="/"){
                        
                        path.replaceWith(
                            preOperationAST({
                                FUN_NAME:t.identifier("diviCalc"),
                                ARGS:[path.node.left,path.node.right]
                            })
                        )
                    }
                }
            }
        }
    }
}