const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { getPayload } = require("./item_controller");
const docClient = new DynamoDBClient({ regions: "us-east-1" });

async function getcou(student_id) {
  const params = {
    TableName: "course",
  };
  j = {};
  const data = await docClient.send(new ScanCommand(params)).Items;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["student_id"] === student_id) {
      j = data[i];
      break;
    }
  }
  return j;
}

exports.getStarting = async (req, res) => {
  try {
    var j = getcou(req.params.student_id)["data"];
    if (j == {}) {
      j = getPayload(req);
    }
    res.send(j);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.getCourses = async (req, res) => {
  try {
    var j = getcou(req.params.student_id)["data"];
    res.send(j);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.postCourses = async (req, res) => {
  const item = {
    student_id: req.params.student_id,
    data: req.body,
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
