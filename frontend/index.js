let myScoreButton = document.getElementById("my-score-button");
let totalScoreButton = document.getElementById("total-score-button");
let myScoreView = document.getElementById("my-score-view");
let totalScoreView = document.getElementById("total-score-view");

// handle navigating between two views
const MY_SCORE_VIEW = "MY_SCORE";
const TOTAL_SCORE_VIEW = "TOTAL_SCORE";
const setView = (view) => {
  if (view === MY_SCORE_VIEW) {
    myScoreView.classList.remove("hidden");
    totalScoreView.classList.add("hidden");
  } else if (view === TOTAL_SCORE_VIEW) {
    myScoreView.classList.add("hidden");
    totalScoreView.classList.remove("hidden");
  } else {
    throw Error("Unknown view: " + view);
  }
};
myScoreButton.onclick = () => setView(MY_SCORE_VIEW);
totalScoreButton.onclick = () => setView(TOTAL_SCORE_VIEW);
