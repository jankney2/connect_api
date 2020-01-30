const AWS = require("aws-sdk");
require("dotenv").config();
const connect = new AWS.Connect({
  region: "us-west-2"
});

// let allResults = [];
// connect.listQueues(
//   {
//     InstanceId: process.env.INSTANCE,
//     MaxResults: 100,
//     NextToken: null
//   },
//   function(err, data) {
//     if (err) {
//       console.log(err, "error with list users");
//     } else {
//       allResults.push(data.QueueSummaryList);
//       console.log(data.QueueSummaryList.length, "FIRST LENGTH");

//       if (data.NextToken) {
//         connect.listQueues(
//           {
//             InstanceId: process.env.INSTANCE,
//             MaxResults: 100,
//             NextToken: data.NextToken
//           },
//           function(err, data) {
//             if (err) {
//               console.log(err, "err with get");
//             } else {
//               console.log(data.QueueSummaryList.length, "next token 2");
//               allResults.push(data.QueueSummaryList);
//             }
//           }
//         );
//       }
//     }

//     console.log(allResults.length, "results length");
//   }
// );

//make me recursive
const getAmazon = (nt = null, resultsHolder = []) => {
  connect.listQueues(
    { InstanceId: process.env.INSTANCE, MaxResults: 100, NextToken: nt },
    (err, data) => {
      if (err) {
        console.log(err, "err with listqueues");
      } else {
        resultsHolder=[...data.QueueSummaryList, ...resultsHolder];
        if(data.NextToken){
            getAmazon(data.NextToken, resultsHolder)
        }else {
            console.log(resultsHolder.length, 'final res length')
            return resultsHolder
        }
      }
    }
  );
};
getAmazon()