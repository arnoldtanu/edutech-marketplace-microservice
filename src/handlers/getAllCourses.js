const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const validator = require('../helper/validator.js');

module.exports.handler = async (event) => {
  const startKey = event.queryStringParameters ? checkIfHaveLastKey(event.queryStringParameters) : null;
  const params = {
    TableName: "CourseTable",
    Limit: 12,
    ExclusiveStartKey: startKey,
    ScanIndexForward: false,
  };

  try {
    const courses = await documentClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        courses,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Cannot fetch courses",
        error: err,
      }),
    };
  }
};

const checkIfHaveLastKey = (queryStringParameters) => {
  const {lastid, lastpostdate} = queryStringParameters;
  const startKey = (validator.isEmptyStringOrUndefined(lastid) || validator.isEmptyStringOrUndefined(lastpostdate)) || isNaN(parseInt(lastpostdate)) ? null : {
    id: lastid,
    postDate: parseInt(lastpostdate)
  }
  return startKey;
}
