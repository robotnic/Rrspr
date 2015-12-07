module.exports=function(){
    var YAML = require('yamljs');
    var fs = require('fs');
    var merge = require('merge');

    var resources={};

    //read the raml in yaml format
    var data = fs.readFileSync('./index.yaml');
    var thebible=YAML.parse(data.toString()); 

    //convert /path/{id} format  to /path/:id
    preprocess(thebible,0);
    makeResource(thebible);

    //merge resourceTypes
    function preprocess(bible,d){
        if(bible instanceof Array){
            return 
        }

        if(typeof(bible)==="object"){
            for( var b in bible){
                console.log(b,d);
                if(bible[b] && bible[b].type){
                    console.log("type",bible[b].type);
                    var rT=thebible.resourceTypes[bible[b].type];
                    if(rT){
                        bible[b]=merge(rT,bible[b]);
                        bible[b]._type = bible[b].type; 
                        delete bible[b].type; 
                    }

                }else{
                    preprocess(bible[b],d+1);
                }
            }
        }
    }
    
    
    function makeResource(bible,path){
        if(!path){
            path="";
        }else{
            resources[path]=JSON.parse(JSON.stringify(bible));
        }
        for(var b in bible){
            if(b[0]=="/"){
                var s=b.replace(/\{/,":").replace(/\}/,"")
                makeResource(bible[b],path+s);
                if(resources[path]){
                    delete resources[path][b]; 
                }
            }
        }
    }

    return {
        route:"/",
        use:function(req,res,next){
            console.log(req);
            res.json({"hi":5});
            next();
        },
        resource:function(name){
            return resources[name];
        },
        resources:function(){
            return resources;  
        }

    }

}
