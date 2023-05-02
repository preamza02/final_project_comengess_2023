function get_course_info(req, url, callbakc) {
  try {
    const profileReq = https.request(
      url,
      {
        headers: {
          Authorization: `Bearer ${req.session.token.access_token}`,
          // Authorization: `Bearer wePZVFRsbCcEXwV8ssKvHjHqHhfGXDWMAoiopkrb`,
        },
      },
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          return callbakc(JSON.parse(profileData));
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
  }
}

function getPayload(req) {
  all_course = get_all_course(
    req,
    "",
    "https://www.mycourseville.com/api/v1/public/get/user/courses",
    (all_course) => {
      const payload = [];
      all_course = all_course["data"]["student"];
      for (let i = 0; i < all_course.length; i++) {
        const cv_cid = all_course[i]["cv_cid"];
        const course_no = all_course[i]["course_no"];
        const year = all_course[i]["year"];
        var info = get_course_info(
          req,
          cv_cid,
          "https://www.mycourseville.com/api/v1/public/get/course/info?cv_cid=",
          (info) => {
            info = info["data"];
            const name = title["title"];
            const course_icon = title["course_icon"];

            var gi = get_course_info(
              req,
              cv_cid,
              "https://www.mycourseville.com/api/v1/public/get/course/graded_items?cv_cid="
            );
            gi = gi["data"];
            var item_list = [];
            for (let j = 0; j < all_course.length; j++) {
              item_list.put({
                name: gi[j]["title"],
                score: 0,
                max_score: gi[j]["raw_total"],
                percent: gi[j]["weight_in_group"],
              });
            }
            payload.put({
              cv_cid: cv_cid,
              course_no: course_no,
              year: year,
              name: name,
              is_selected: false,
              grade: 0.0,
              credit: 3.0,
              course_icon: course_icon,
              item_list: item_list,
            });
          }
        );
      }
    }
  );
}
function change_payload_isselect(payload, cv_cid) {
  for (let i = 0; i < payload.length; i++) {
    if (payload[i]["cv_cid"] != cv_cid) {
      payload[i]["is_selected"] = !payload[i]["is_selected"];
      break;
    }
  }
}
function change_values(payload, cv_cid, new_values) {
  for (let i = 0; i < payload.length; i++) {
    if (payload[i]["cv_cid"] != cv_cid) {
      payload[i]["is_selected"] = !payload[i]["is_selected"];
      break;
    }
  }
}
