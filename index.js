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
const getAmazonQueues = (nt = null, resultsHolder = []) => {
  connect.listQueues(
    { InstanceId: process.env.INSTANCE, MaxResults: 1000, NextToken: nt },
    (err, data) => {
      if (err) {
        console.log(err, "err with listqueues");
      } else {
        resultsHolder=[...data.QueueSummaryList, ...resultsHolder];
        if(data.NextToken){
            getAmazon(data.NextToken, resultsHolder)
        }else {
            console.log(resultsHolder[0], 'final res length')
            return resultsHolder
        }
      }
    }
  );
};
// getAmazonQueues()

const getMetricData=(nt=null, resArr)=>{
    connect.getMetricData({
        EndTime:1580400000, 
        Filters:{
            Channels:['VOICE', 'CHAT'], 
            Queues:[
                '0002ddc3-6fdb-4bec-9fde-d555e4bde81b'
            ]
        }, 
        HistoricalMetrics:[
            {
                Name:'CONTACTS_QUEUED', 
                Statistic:'SUM', 
                Threshold:{
                    Comparison:'LT', 
                    ThresholdValue:100
                },
                Unit:'COUNT'
            }, 
        ], 
        InstanceId:process.env.INSTANCE, 
        StartTime:1580371200, 
        Groupings:[
            'QUEUE'
        ], 
        MaxResults:100, 
        NextToken:nt

    }, function(err, data){
        if(err){
            console.log(err, 'err with get')
        }else {

            resArr=[...data.MetricResults, ...resArr]
            console.log(data.MetricResults.length)
            // getMetricData(data.NextToken, resArr)
        }
    })
}

getMetricData()