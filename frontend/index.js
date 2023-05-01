const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

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
let totalScoreComponents = {};
let selectedYearIndex = -1,
  selectedCourseIndex = -1;
const scoreItemList = document.getElementById("score-item-list");
const gradeItemList = document.getElementById("grade-item-list");
const checkedScore = document.getElementById("checked-score");
const maxCheckedScore = document.getElementById("max-checked-score");
const checkedPercent = document.getElementById("checked-score-percent");
const uncheckedScore = document.getElementById("unchecked-score");
const unmaxCheckedScore = document.getElementById("max-unchecked-score");
const uncheckedPercent = document.getElementById("unchecked-score-percent");
const targetScoreInput = document.getElementById("target-score-input");
const neededUncheckedScore = document.getElementById("needed-unchecked-score");
const totalGrade = document.getElementById("total-grade");
// perform calculations every time target score changes
targetScoreInput.oninput = () => calculateMyScore();
const calculateScore = (yearIndex, courseIndex) => {
  let maxScore = 0,
    maxPercentScore = 0,
    checkedScoreVal = 0,
    checkedPercentVal = 0,
    uncheckedScoreVal = 0,
    uncheckedPercentVal = 0;
  for (
    let i = 0;
    i < courseData[yearIndex].courses[courseIndex].item_list.length;
    i++
  ) {
    const item = courseData[yearIndex].courses[courseIndex].item_list[i];
    maxScore += item.max_score;
    maxPercentScore += item.percent;
    if (item.score !== 0) {
      checkedScoreVal += item.score;
      checkedPercentVal += (item.score / item.max_score) * item.percent;
    } else {
      uncheckedScoreVal += item.max_score;
      uncheckedPercentVal += item.percent;
    }
  }
  return {
    maxScore,
    maxPercentScore,
    checkedScoreVal,
    checkedPercentVal,
    uncheckedScoreVal,
    uncheckedPercentVal,
  };
};

const calculateMyScore = () => {
  const {
    maxScore,
    checkedScoreVal,
    checkedPercentVal,
    uncheckedScoreVal,
    uncheckedPercentVal,
  } = calculateScore(selectedYearIndex, selectedCourseIndex);

  if (uncheckedPercentVal === 0) {
    neededUncheckedScore.textContent = "Infinity";
  } else {
    let target = parseFloat(targetScoreInput.value) ?? 0;
    target = Number.isNaN(target) ? 0 : target;
    const neededPercent =
      (Math.max(0, target - checkedPercentVal) / uncheckedPercentVal) * 100;
    neededUncheckedScore.textContent = round(neededPercent).toLocaleString();
  }

  checkedScore.textContent = round(checkedScoreVal).toLocaleString();
  maxCheckedScore.textContent = round(maxScore).toLocaleString();
  checkedPercent.textContent = round(checkedPercentVal).toLocaleString();
  uncheckedScore.textContent = round(uncheckedScoreVal).toLocaleString();
  unmaxCheckedScore.textContent = round(maxScore).toLocaleString();
  uncheckedPercent.textContent = round(uncheckedPercentVal).toLocaleString();
};

// for my score view
const setCurrentCourse = (yearIndex, courseIndex) => {
  // hide old outline
  if (selectedCourseIndex >= 0) {
    myScoreCourseButtons[selectedYearIndex][
      selectedCourseIndex
    ].style.outlineWidth = "0";
  }
  myScoreCourseButtons[yearIndex][courseIndex].style.outlineWidth = "2px";

  scoreItemList.innerHTML = ""; // clear children
  for (
    let i = 0;
    i < courseData[yearIndex].courses[courseIndex].item_list.length;
    i++
  ) {
    const item = courseData[yearIndex].courses[courseIndex].item_list[i];
    const scoreItem = document.createElement("div");
    scoreItem.classList.add("flex-row", "score-item");
    scoreItemList.appendChild(scoreItem);

    const text = document.createTextNode(item.name);
    scoreItem.appendChild(text);

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("flex-row", "score-item-input");
    scoreItem.appendChild(inputDiv);

    const input = document.createElement("input");
    input.type = "number";
    input.value = item.score;
    input.oninput = () => {
      let result = parseFloat(input.value) ?? 0;
      result = Number.isNaN(result) ? 0 : result;
      courseData[yearIndex].courses[courseIndex].item_list[i].score = result;
      calculateMyScore();
    };
    inputDiv.appendChild(input);

    const text2 = document.createTextNode(
      `/ ${item.max_score} as ${item.percent}%`
    );
    inputDiv.appendChild(text2);
  }
  selectedYearIndex = yearIndex;
  selectedCourseIndex = courseIndex;
  calculateMyScore();
};

const calculateGrade = () => {
  let sum = 0,
    sumCredit = 0;
  for (let i = 0; i < courseData.length; i++) {
    for (let j = 0; j < courseData[i].courses.length; j++) {
      const course = courseData[i].courses[j];
      if (course.is_selected) {
        sum += course.grade * course.credit;
        sumCredit += course.credit;
      }
    }
  }

  const grade = sumCredit === 0 ? 0 : sum / sumCredit;
  totalGrade.textContent = round(grade).toLocaleString();
};

// for total score view
const setSelectedCourse = (
  yearIndex,
  courseIndex,
  isSelected,
  forceSet = false
) => {
  if (
    !forceSet &&
    courseData[yearIndex].courses[courseIndex].is_selected === isSelected
  ) {
    return;
  }

  if (isSelected) {
    let item = courseData[yearIndex].courses[courseIndex];

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("flex-row", "grade-item");
    gradeItemList.appendChild(itemDiv);
    myScoreCourseButtons[yearIndex][courseIndex].item = itemDiv;

    const graphics = document.createElement("div");
    graphics.classList.add("flex-row", "grade-item-graphics");
    itemDiv.appendChild(graphics);

    const removeButton = document.createElement("button");
    removeButton.classList.add("grade-item-remove-button");
    removeButton.innerHTML = '<img alt="" src="images/uncheck.png" />';
    removeButton.onclick = () =>
      setSelectedCourse(yearIndex, courseIndex, false);
    graphics.appendChild(removeButton);

    const globe = document.createElement("img");
    globe.src = "images/globe_icon.png";
    globe.alt = "globe";
    graphics.appendChild(globe);

    graphics.append(item.name);

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("flex-row", "grade-item-input");
    itemDiv.appendChild(inputDiv);

    const { maxPercentScore, checkedPercentVal } = calculateScore(
      yearIndex,
      courseIndex
    );

    const percentScoreDiv = document.createElement("div");
    percentScoreDiv.classList.add("orange-text");
    percentScoreDiv.textContent = round(checkedPercentVal).toLocaleString();
    inputDiv.appendChild(percentScoreDiv);

    inputDiv.append("% / ");

    const maxPercentScoreDiv = document.createElement("div");
    maxPercentScoreDiv.classList.add("max-score-text");
    maxPercentScoreDiv.textContent = round(maxPercentScore).toLocaleString();
    inputDiv.appendChild(maxPercentScoreDiv);

    inputDiv.append("% Grade:");

    const gradeInput = document.createElement("input");
    gradeInput.type = "number";
    gradeInput.value = item.grade;
    gradeInput.oninput = () => {
      let result = parseFloat(gradeInput.value) ?? 0;
      result = Number.isNaN(result) ? 0 : result;
      courseData[yearIndex].courses[courseIndex].grade = result;
      calculateGrade();
    }
    inputDiv.appendChild(gradeInput);

    inputDiv.append("Credit:");

    const creditInput = document.createElement("input");
    creditInput.type = "number";
    creditInput.value = item.credit;
    creditInput.oninput = () => {
      let result = parseFloat(creditInput.value) ?? 0;
      result = Number.isNaN(result) ? 0 : result;
      courseData[yearIndex].courses[courseIndex].credit = result;
      calculateGrade();
    }
    inputDiv.appendChild(creditInput);
  } else {
    myScoreCourseButtons[yearIndex][courseIndex].item.remove();
  }
  courseData[yearIndex].courses[courseIndex].is_selected = isSelected;
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
      const course = courses[i].courses[j];
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
      courseButton2.onclick = () => setSelectedCourse(i, j, true);
      if (!totalScoreComponents[i]) totalScoreComponents[i] = {};
      if (!totalScoreComponents[i][j]) totalScoreComponents[i][j] = {};
      totalScoreComponents[i][j].button = courseButton2;
      if (courseData[i].courses[j].is_selected)
        setSelectedCourse(i, j, true, true);
      totalScoreCourseSelector.appendChild(courseButton2);
    }
  }

  console.log(myScoreCourseButtons);
  setCurrentCourse(0, 0);
  calculateMyScore();
  calculateGrade();
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
