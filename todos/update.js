'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  // validation
  /** 
  if (typeof data.end_date !== 'string' 
  || typeof data.initial_budget !== 'number' 
  || typeof data.most_recent_request_amt !== 'number'
  || typeof data.net_amt_remaining !== 'number'
  || typeof data.project_id !== 'number'
  || typeof data.project_type !== 'string'
  || typeof data.start_date !== 'string'
  || typeof data.team !== 'string'
  || typeof data.team_manager !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    });
    return;
  }
  */

  const params = {
    TableName: "budget-14-prd",
    Key: {
      project_id: event.pathParameters.project_id,
      request_id: event.pathParameters.request_id,
    },
    ExpressionAttributeValues: {
      //':initial_budget': data.initial_budget,
      ":request_amount": data.request_amount,
      //':net_amt_remaining': data.initial_budget - data.most_recent_request_amt,
      //':project_id' : data.project_id,
      //':project_type' : data.project_type,
      //':start_date' : data.start_date,
      //':team' : data.team,
      ":request_reason": data.request_reason,
    },
    //UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    UpdateExpression:
      "SET request_reason = :request_reason, request_amount = :request_amount, net_amount_remaining = net_amount_remaining - :request_amount",
    ReturnValues: "ALL_NEW",
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
