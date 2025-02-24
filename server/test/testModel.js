const {Person}=require('../models/person');
Person.find({TYPE:'Critic'})
    .then((res)=>{
        console.log(res);
    });

    
    
