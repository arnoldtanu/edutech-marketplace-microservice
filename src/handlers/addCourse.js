const uuid = require('uuid');
const AWS = require('aws-sdk');
const validator = require('../helper/validator.js');
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { title, description } = body;

  if (validator.isEmptyStringOrUndefined(title) || validator.isEmptyStringOrUndefined(description)){
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "title and description is required.",
      }),
    };
  }

  const item = {
    id: uuid.v1(),
    postDate: new Date().getTime(),
    title: title,
    description: description,
  };

  const params = {
    TableName: "CourseTable",
    Item: item,
  };

  try {
    await documentClient.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Course added successfully",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Cannot add course",
        error: err,
      }),
    };
  }
};
