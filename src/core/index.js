 
var needRequireCache = [];

function pushCache(operation){
    var operationFun;
    switch(operation){
        case '+':
            operationFun = 'addCalc';
            break;
        case '-':
            operationFun = 'minusCalc';
            break;
        case '*':
            operationFun = 'multCalc';
            break;
        case '/':
            operationFun = 'diviCalc';
            break;
        default: 
            operationFun = 'none';
    }
    if(needRequireCache.indexOf(operationFun)>=0) return operationFun;
    operationFun !== 'none' && needRequireCache.push(operationFun);
    return operationFun;
}

module.exports=function({template:template,types:t}){
   
    var preOperationAST=template("FUN_NAME(ARGS)");//将0.1+0.2转化为addCalc的模板
    var requireAST=template("var PROPERTIES=require(SOURCE)");//引入相应函数的模板

    function preObjectExpressAST(keys){//传入的keys为require的数组
        var properties=keys.map(function(){
            return t.objectProperty(t.identifier(key),t.identifier(key),false,true)
        });
        return t.ObjectPattern(properties);
    }

    return {
        visitor:{
            Program:{
                exit:function(path){
                    path.unshiftContainer("body",requireAST({
                        PROPERTIES:preObjectExpressAST(needRequireCache),
                        SOURCE: t.stringLiteral("calc/calc.js")
                    }));
                    needRequireCache = [];
                }
            },
            BinaryExpression:{ 
                exit:function(path){
                    var replaceOperator = pushCache(path.node.operator);

                    replaceOperator!=="none" && path.replaceWith(
                        preOperationAST({
                            FUN_NAME:t.identifier(replaceOperator),
                            ARGS:[path.node.left,path.node.right]
                        })
                    )
                }
            }
        }
    }
}