const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  ScanCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const https = require("https");
const docClient = new DynamoDBClient({ regions: "us-east-1" });

async function getcou(student_id) {
  const params = {
    TableName: "course",
  };
  j = {};
  const data = await docClient.send(new ScanCommand(params));
  for (let i = 0; i < data.Items.length; i++) {
    if (data.Items[i]["student_id"] === student_id) {
      j = data.Items[i];
      break;
    }
  }
  // console.log(data)
  // console.log(j)
  return j;
}

exports.getStarting = async (req, res) => {
  try {
    getAllCoursesWithDetails(req.session.token.access_token)
      // getAllCoursesWithDetails("ciw0MuPY1to8mbTAPP02Pv5B2o472R8EcDSP8kzY")
      .then(async (courseDetails) => {
        var j = await getcou(req.params.student_id);
        if (Object.keys(j).length === 0) {
          j = courseDetails;
        } else {
          j = j["data"];
        }
        console.log(j);
        res.send(j);
        res.end();
      })
      .catch((error) => console.error(error));
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
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

async function getAllCoursesWithDetails(access_token) {
  const allCoursesPromise = new Promise((resolve, reject) => {
    https
      .get(
        "https://www.mycourseville.com/api/v1/public/get/user/courses",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
        (response) => {
          let data = "";
          response.on("data", (chunk) => {
            data += chunk;
          });
          response.on("end", () => {
            const allCourses = JSON.parse(data);
            resolve(allCourses);
          });
        }
      )
      .on("error", (error) => {
        reject(error);
      });
  });
  const allCourses = await allCoursesPromise;
  const allCoursesID = allCourses["data"]["student"].map((allCourse) => {
    return allCourse["cv_cid"];
  });

  const courseDetailsPromises = allCoursesID.map((course) => {
    return new Promise((resolve, reject) => {
      https
        .get(
          "https://www.mycourseville.com/api/v1/public/get/course/info?cv_cid=" +
            course,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
          (response) => {
            let data = "";
            response.on("data", (chunk) => {
              data += chunk;
            });
            response.on("end", () => {
              const courseDetail = JSON.parse(data);
              courseDetail + resolve(courseDetail);
            });
          }
        )
        .on("error", (error) => {
          reject(error);
        });
    });
  });
  const courseGradePromises = allCoursesID.map((course) => {
    return new Promise((resolve, reject) => {
      https
        .get(
          "https://www.mycourseville.com/api/v1/public/get/course/graded_items?cv_cid=" +
            course,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
          (response) => {
            let data = "";
            response.on("data", (chunk) => {
              data += chunk;
            });
            response.on("end", () => {
              const courseDetail = JSON.parse(data);
              courseDetail + resolve(courseDetail);
            });
          }
        )
        .on("error", (error) => {
          reject(error);
        });
    });
  });
  const allCourseDetails = await Promise.all(courseDetailsPromises);
  const allCourseGrade = await Promise.all(courseGradePromises);

  const allCourseA = allCourses["data"]["student"].map((aa) => {
    return {
      cv_cid: aa["cv_cid"].toString(),
      course_no: aa["course_no"],
      year: aa["year"],
      semester: aa["semester"],
      is_selected: false,
      grade: 0.0,
      credit: 3.0,
    };
  });
  const allCourseB = allCourseDetails.map((aa) => {
    return {
      cv_cid: aa["data"]["cv_cid"].toString(),
      name: aa["data"]["title"],
      course_icon: aa["data"]["course_icon"],
    };
  });
  const allCourseC = allCourseGrade.map((aa) => {
    return {
      item_list: aa["data"].map((bb) => {
        return {
          name: bb["title"],
          score: 0,
          max_score: bb["raw_total"],
          percent: bb["weight_in_group"],
        };
      }),
    };
  });

  const concat = allCourseA.map((itemA, index) => {
    const itemB = allCourseB[index];
    return Object.assign({}, itemA, itemB);
  });
  const concat2 = concat.map((itemA, index) => {
    const itemB = allCourseC[index];
    return Object.assign({}, itemA, itemB);
  });
  const groupedCourses = Object.values(
    concat2.reduce((acc, course) => {
      var year = course.year + "/" + course.semester; // calculate group number based on year
      if (!acc[year]) {
        acc[year] = { year, courses: [] }; // initialize the group if it doesn't exist
      }
      acc[year].courses.push(course); // add the course to the group
      return acc;
    }, {})
  );
  return groupedCourses;
}
const params = {
  Key: { student_id: "6432174421" },
  TableName: "course",
};
const data = docClient.send(new DeleteCommand(params));
// AWS.config.update({ region: "us-east-1" });
// const data2 = getcou("");
// data2.then(console.log);

exports.deletCourses = async (req, res) => {
  const params = {
    Key: { student_id: req.params.student_id },
    TableName: "course",
  };
  try {
    const data = await docClient.send(new DeleteCommand(params));
    res.send(data);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
