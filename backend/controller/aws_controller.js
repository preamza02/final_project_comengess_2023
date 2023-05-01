const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = new DynamoDBClient({ regions: "us-east-1" });

exports.getCourses = async (req, res) => {
  try {
    const params = {
      TableName: "course",
    };
    const data = await docClient.send(new ScanCommand(params)).Items;
    for (let i = 0; i < data.length; i++) {
      if (data[i]["student_id"] === req.params.student_id) {
        j = data[i];
        break;
      }
    }
    res.send(j["data"]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.postCourses = async (req, res) => {
  const item = {
    student_id: req.params.student_id,
    ...req.body,
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
