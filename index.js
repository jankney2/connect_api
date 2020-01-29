const AWS = require("aws-sdk");
require("dotenv").config();
const connect = new AWS.Connect({
    region:'us-west-2'
});



let allResults=[]
connect.listQueues(
  {
    InstanceId: process.env.INSTANCE,
    MaxResults: 100,
  },
  function(err, data) {
    if (err) {
      console.log(err, "error with list users");
    } else {
      console.log(data.NextToken, 'next token');

if(data.NextToken){
    connect.listQueues({
        InstanceId:process.env.INSTANCE, 
        MaxResults:100, 
        NextToken:data.NextToken
    })
}


    }
  }
);

