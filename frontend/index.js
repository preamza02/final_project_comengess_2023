const myScoreButton = document.getElementById("my-score-button");
const totalScoreButton = document.getElementById("total-score-button");
const myScoreView = document.getElementById("my-score-view");
const totalScoreView = document.getElementById("total-score-view");
const myScoreCourseSelector = document.getElementById(
  "my-score-course-selector"
);
const totalScoreCourseSelector = document.getElementById(
  "total-score-course-selector"
);

// handle navigating between two views
const MY_SCORE_VIEW = "MY_SCORE";
const TOTAL_SCORE_VIEW = "TOTAL_SCORE";
const setView = (view) => {
  if (view === MY_SCORE_VIEW) {
    myScoreView.style.removeProperty("display");
    myScoreCourseSelector.style.removeProperty("display");
    myScoreButton.style.borderWidth = "2px";
    totalScoreView.style.display = "none";
    totalScoreCourseSelector.style.display = "none";
    totalScoreButton.style.borderWidth = "0";
  } else if (view === TOTAL_SCORE_VIEW) {
    myScoreView.style.display = "none";
    myScoreCourseSelector.style.display = "none";
    myScoreButton.style.borderWidth = "0";
    totalScoreView.style.removeProperty("display");
    totalScoreCourseSelector.style.removeProperty("display");
    totalScoreButton.style.borderWidth = "2px";
  } else {
    throw Error("Unknown view: " + view);
  }
};
myScoreButton.onclick = () => setView(MY_SCORE_VIEW);
totalScoreButton.onclick = () => setView(TOTAL_SCORE_VIEW);

// handle show loading page
const loadingScreen = document.getElementById("loading-screen");
const showLoadingScreen = (show) => {
  if (show) {
    loadingScreen.style.removeProperty("display");
  } else {
    loadingScreen.style.display = "none";
  }
};

// functions/data related to api
const isProduction = false;
const frontendIPAddress = "127.0.0.1:5500";
const backendIPAddress = "127.0.0.1:3000";
const redirect_url = encodeURIComponent(
  `http://${frontendIPAddress}/frontend/index.html`
);
const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app/${redirect_url}`;
};
const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout/${redirect_url}`;
};
const getProfile = async () => {
  response = await fetch(`http://${backendIPAddress}/courseville/profile`, {
    method: "GET",
    credentials: "include",
  });
  result = await response.json();
  return result;
};
const getCourse = async (id) => {
  return [
    {
      year: "1",
      courses: [
        {
          name: "course1",
          is_selected: false,
          grade: 0.0,
          credit: 0.0,
          item_list: [
            {
              name: "item1",
              score: 0,
              max_score: 25,
              percent: 25,
            },
            {
              name: "item2",
              score: 15,
              max_score: 25,
              percent: 25,
            },
          ],
        },
      ],
    },
    {
      year: "2",
      courses: [
        {
          name: "course1",
          is_selected: false,
          grade: 0.0,
          credit: 0.0,
          item_list: [
            {
              name: "item1",
              score: 0,
              max_score: 35,
              percent: 60,
            },
            {
              name: "item2",
              score: 9,
              max_score: 50,
              percent: 40,
            },
          ],
        },
        {
          name: "course2",
          is_selected: true,
          grade: 0.0,
          credit: 0.0,
          item_list: [
            {
              name: "item1",
              score: 0,
              max_score: 35,
              percent: 20,
            },
            {
              name: "item2",
              score: 12,
              max_score: 50,
              percent: 40,
            },
            {
              name: "item3",
              score: 15,
              max_score: 50,
              percent: 40,
            },
          ],
        },
      ],
    },
  ];
};

// handle authentication
const logoutButton = document.getElementById("logout-button");
logoutButton.onclick = () => logout();
const loginButton = document.getElementById("login-button");
loginButton.onclick = () => authorizeApplication();
const setIsLoggedIn = (bool) => {
  if (bool) {
    loginButton.style.display = "none";
    logoutButton.style.removeProperty("display");
  } else {
    loginButton.style.removeProperty("display");
    logoutButton.style.display = "none";
  }
};

// updating profile data
const profileText = document.getElementById("profile-text");
const profileImage = document.getElementById("profile-image");
const setProfile = (profile) => {
  profileText.innerHTML = `
    Logged in as<br/>
    ${profile.student.firstname_en} ${profile.student.lastname_en}<br/>
    ${profile.student.id}
  `;
  profileImage.style.backgroundImage = `url('${profile.account.profile_pict}')`;
};

// update course data
let courseData;
let myScoreCourseButtons = {};
let selectedYearIndex = -1,
  selectedCourseIndex = -1;
const scoreItemList = document.getElementById("score-item-list");
const setCurrentCourse = (yearIndex, courseIndex) => {
  // hide old outline
  if (selectedCourseIndex >= 0) {
    myScoreCourseButtons[selectedYearIndex][selectedCourseIndex].style.outlineWidth =
      "0";
  }
  myScoreCourseButtons[yearIndex][courseIndex].style.outlineWidth = "2px";

  scoreItemList.innerHTML = ""; // clear children
  for (let item of courseData[yearIndex].courses[courseIndex].item_list) {
    const scoreItem = document.createElement("div");
    scoreItem.classList.add("flex-row", "score-item");
    scoreItem.innerHTML = `
      ${item.name}
      <div class="flex-row score-item-input">
        <input type="number" />
        / ${item.max_score} as ${item.percent}%
      </div>
  `;
    scoreItemList.appendChild(scoreItem);
  }
  selectedYearIndex = yearIndex;
  selectedCourseIndex = courseIndex;
};

const setCourseData = (courses) => {
  courseData = courses;
  for (let i = 0; i < courses.length; i++) {
    // for my score
    const year = document.createElement("div");
    year.textContent = "Year " + courses[i].year;
    year.classList.add("year-display");
    myScoreCourseSelector.appendChild(year);

    // for total score
    const year2 = document.createElement("div");
    year2.textContent = "Year " + courses[i].year;
    year2.classList.add("year-display");
    totalScoreCourseSelector.appendChild(year2);

    for (let j = 0; j < courses[i].courses.length; j++) {
      let course = courses[i].courses[j];
      // for my score
      const courseButton = document.createElement("button");
      courseButton.classList.add("flex-row", "course-button");
      courseButton.style.outlineWidth = "0";
      courseButton.innerHTML = `
            <div class="flex-row course-button-left">
              <img src="images/globe_icon.png" alt="icon" />
              ${course.name}
            </div>
      `;
      courseButton.onclick = () => setCurrentCourse(i, j);
      if (!myScoreCourseButtons[i]) myScoreCourseButtons[i] = {};
      myScoreCourseButtons[i][j] = courseButton;
      console.log(myScoreCourseButtons)
      myScoreCourseSelector.appendChild(courseButton);

      // for total score
      const courseButton2 = document.createElement("button");
      courseButton2.classList.add("flex-row", "course-button");
      courseButton2.style.outlineWidth = "0";
      courseButton2.innerHTML = `
            <div class="flex-row course-button-left">
              <img src="images/globe_icon.png" alt="icon" />
              ${course.name}
            </div>
      `;
      totalScoreCourseSelector.appendChild(courseButton2);
    }
  }

  console.log(myScoreCourseButtons);
  setCurrentCourse(0, 0);
};

// initialize everything
const initialize = async () => {
  showLoadingScreen(true);

  setView(MY_SCORE_VIEW);

  const profile = await getProfile();
  setIsLoggedIn(profile.is_login);
  if (profile.is_login) {
    setProfile(profile);

    const courses = await getCourse(profile.student.id);
    setCourseData(courses);
  }

  console.log(profile);

  showLoadingScreen(false);
};
initialize();
