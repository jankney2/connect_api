const AWS = require("aws-sdk");
require("dotenv").config();
const connect = new AWS.Connect({  
  region: "us-west-2"
});

// let allResults = [];
const listQueues = () => {
  connect.listQueues(
    {
      InstanceId: process.env.INSTANCE,
      MaxResults: 100,
      NextToken: null
    },
    function(err, data) {
      if (err) {
        console.log(err, "error with list users");
      } else {
        allResults.push(data.QueueSummaryList);
        console.log(data.QueueSummaryList.length, "FIRST LENGTH");

        if (data.NextToken) {
          connect.listQueues(
            {
              InstanceId: process.env.INSTANCE,
              MaxResults: 100,
              NextToken: data.NextToken
            },
            function(err, data) {
              if (err) {
                console.log(err, "err with get");
              } else {
                console.log(data.QueueSummaryList.length, "next token 2");
                allResults.push(data.QueueSummaryList);
              }
            }
          );
        }
      }

      console.log(allResults.length, "results length");
    }
  );
};
//make me recursive



function getMetricData(queues, nt = null, resArr = []) {

  connect.getMetricData(
    {
      EndTime: 1580472000,
      Filters: {
        // Channels: ["VOICE"],
        Queues: queues
      },
      HistoricalMetrics: [
        {
          Name: 'HANDLE_TIME',
          Statistic: "AVG",
          Unit: "SECONDS"
        }
      ],
      InstanceId: process.env.INSTANCE,
      StartTime: 1580428800,
      // Groupings: ["QUEUE"],
      // MaxResults: 100,
      NextToken: nt, 
    },
    function(err, data) {
      if (err) {
        console.log(err, "err with get");
      } else {
        resArr = [...data.MetricResults, ...resArr];
        console.log(data.MetricResults.length);
        getMetricData(data.NextToken, resArr)
      }
    }
  );
};


const getAmazonQueues=(nt = null, resultsHolder = []) =>{
  try {
    connect.listQueues(
      { InstanceId: process.env.INSTANCE, MaxResults: 1000, NextToken: nt, QueueTypes:['AGENT'] },
      (err, data) => {
        if (err) {
          console.log(err, "err with listqueues");
        } else {
          resultsHolder = [...data.QueueSummaryList, ...resultsHolder];
          if (data.NextToken) {
            getAmazon(data.NextToken, resultsHolder);
          } else {
            
            
            let ids=resultsHolder.map(el=>{return el.Arn})
            ids.splice(99,200)
            // resultsHolder.forEach((el, i)=>{
            //   console.log(el, i)
            // })
            // console.log(resultsHolder[0], 'id length')
            //request to metric data endpoint
            getMetricData(ids)
          }
        }
      }
    );  
  } catch (error) {
    console.log(error, 'error')
  }
  
};

