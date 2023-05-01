function get_course_info(cv_cid) {}
function get_greaded_item(cv_cid) {}
function get_all_course() {}

function getPayload() {
  all_course = get_all_course();
  const payload = [];
  all_course = all_course["data"]["student"];
  for (let i = 0; i < all_course.length; i++) {
    const cv_cid = all_course[i]["cv_cid"];
    const course_no = all_course[i]["course_no"];
    const year = all_course[i]["year"];
    var info = get_course_info(cv_cid);

    info = info["data"];
    const name = title["title"];
    const course_icon = title["course_icon"];

    var gi = get_greaded_item(cv_cid);
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
  return payload;
}
function startingCourse() {}
