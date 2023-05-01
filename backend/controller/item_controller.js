const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const docClient = new DynamoDBClient({ regions: "us-east-1" });

exports.getCourses = async (req, res) => {
  const params = {
    TableName: "course",
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.getCoursesID = async (req, res) => {
  const params = {
    TableName: "course",
    IndexName: "student_id",
    KeyConditionExpression: "student_id = :id",
    ExpressionAttributeValues: {
      ":id": req.params.id,
    },
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.addItem = async (req, res) => {
  const item = {
    student_id: req.params.id,
    isselect: false,
    score: [],
  };
  const params = {
    Item: item,
    TableName: "course",
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    res.send(item);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
