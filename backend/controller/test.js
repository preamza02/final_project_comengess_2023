const https = require("https");

//   const allCourses = {
//     data: {
//       student: [
//         {
//           cv_cid: 24587,
//           course_no: "2103106",
//           year: "2021",
//           semester: 1,
//           section: "0",
//           role: "student",
//         },
//         {
//           cv_cid: 32206,
//           course_no: "2301107",
//           year: "2021",
//           semester: 1,
//           section: "0",
//           role: "student",
//         },
//       ],
//     },
//     status: 1,
//   };
// var allCourseGrade = [
//   {
//     status: 1,
//     data: [
//       {
//         itemid: 572589,
//         title: "Self Assessment",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 46,
//         weight_in_group: 5,
//       },
//       {
//         itemid: 572600,
//         title: "Homework",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 140,
//         weight_in_group: 10,
//       },
//       {
//         itemid: 572615,
//         title: "Project 01",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 10,
//         weight_in_group: 5,
//       },
//       {
//         itemid: 572616,
//         title: "Project 02",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 10,
//         weight_in_group: 10,
//       },
//       {
//         itemid: 572617,
//         title: "Midterm Examination",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 50,
//         weight_in_group: 35,
//       },
//       {
//         itemid: 572623,
//         title: "Final Examination",
//         type: "graded_item",
//         status: 1,
//         created: 1626945598,
//         changed: 1627657460,
//         raw_total: 50,
//         weight_in_group: 35,
//       },
//     ],
//   },
//   {
//     status: 1,
//     data: [
//       {
//         itemid: 868217,
//         title: "Class Activities",
//         type: "graded_item",
//         status: 1,
//         created: 1673338843,
//         changed: 1673338889,
//         raw_total: 10,
//         weight_in_group: 10,
//       },
//       {
//         itemid: 868218,
//         title: "Quiz",
//         type: "graded_item",
//         status: 1,
//         created: 1673338857,
//         changed: 1673338889,
//         raw_total: 40,
//         weight_in_group: 40,
//       },
//       {
//         itemid: 868219,
//         title: "Midterm",
//         type: "graded_item",
//         status: 1,
//         created: 1673338868,
//         changed: 1673338889,
//         raw_total: 25,
//         weight_in_group: 25,
//       },
//       {
//         itemid: 868220,
//         title: "Final",
//         type: "graded_item",
//         status: 1,
//         created: 1673338877,
//         changed: 1673338889,
//         raw_total: 25,
//         weight_in_group: 25,
//       },
//     ],
//   },
// ];
// const allCourseDetails = [
//   {
//     data: {
//       cv_cid: 24587,
//       title: "Engineering Drawing",
//       course_no: "2103106",
//       year: "2021",
//       semester: "1",
//       course_icon:
//         "https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/21031061.png",
//     },
//     status: 1,
//   },
//   {
//     data: {
//       cv_cid: 32206,
//       title: "Calculus I",
//       course_no: "2301107",
//       year: "2021",
//       semester: "1",
//       course_icon:
//         "https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/2301107_asc_1531364951.png",
//     },
//     status: 1,
//   },
// ];
async function getAllCoursesWithDetails() {
  const allCoursesPromise = new Promise((resolve, reject) => {
    https
      .get("https://random-word-api.herokuapp.com/word", (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const allCourses = JSON.parse(data);
          resolve(allCourses);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
  const allCourses = await allCoursesPromise;
  return allCourses;
}
getAllCoursesWithDetails()
  .then(async (courseDetails) => {
    console.log(courseDetails);
  })
  .catch((error) => console.error(error));

console.log("asdasdasd");
