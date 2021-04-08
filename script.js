let studentInfo = JSON.parse(localStorage.getItem("INFO"));
if (!studentInfo) {
  localStorage.setItem("INFO", JSON.stringify([]));
  studentInfo = [];
}

const questions = [
  {
    title: "JavaScript is the same as Java?",
    options: ["true", "false"],
    right: ["false"],
    type: "single",
    point: 2,
    required: true,
  },
  {
    title: "The 'function' and  'var' are known as",
    options: ["Keywords", "Data types", "Declaration statements", "Prototypes"],
    right: ["Declaration statements"],
    type: "single",
    point: 2,
    required: true,
  },
  {
    title:
      "Which built-in method adds one or more elements to the end of an array and returns the new length of the array?",
    options: ["last()", "put()", "push()", "None of the above"],
    right: ["push()"],
    type: "single",
    point: 2,
    required: true,
  },
  {
    title: "Javascript array methods?",
    options: ["concat()", "every()", "push()", "map()"],
    right: ["concat()", "every()", "push()", "map()"],
    type: "multi",
    point: 2,
    required: false,
  },
  {
    title: "....... operator is used to concatenate two strings?",
    options: ["Dot", "Arrow", "Comma", "Plus"],
    right: ["plus"],
    type: "single",
    point: 2,
    required: true,
  },
];

//####################
const infoSubmit = document.getElementById("info-submit");
const infoDiv = document.getElementById("student-info");
const name = document.getElementById("name");
const id = document.getElementById("id-number");
const def = document.getElementById("def");

infoSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const id = document.getElementById("id-number").value;
  const def = document.getElementById("def").value;
  if (name == "" || id == "" || def == "") {
    alert("Name, ID  and Department are required???");
    return false;
  } else {
    let dataNeedToSave = { myName: name, myID: id, myDef: def };
    studentInfo.push(dataNeedToSave);

    localStorage.setItem("INFO", JSON.stringify(studentInfo));
    infoDiv.style.display = "none";
    quizForm.style.display = "block";
  }
});

//####################

// Question random
questions.sort(() => Math.random() - 0.5);
// Question options random
questions.map((question) => question.options.sort(() => Math.random() - 0.5));

const quizForm = document.getElementById("form");
const selectedAnswers = {};
let results = [];
let pointCount = [];

// Process Answer
const processAnswer = (e) => {
  e.preventDefault();

  // catch selected ans values
  let catchAnswer = Object.values(selectedAnswers).map((item) =>
    item.toString()
  );
  console.log(catchAnswer);

  // Check required true
  let requiredTrue = questions.filter((question) => question.required === true);
  console.log("Required True", requiredTrue);
  // Check required true answer
  let requiredAnsCheck = requiredTrue.map((item, index) =>
    item.options.includes(catchAnswer[index])
  );

  console.log("Required Answer", requiredAnsCheck);
  let point = questions.map((question) => question.point);
  console.log(point);
  let allPoints = point.reduce((a, b) => a + b);

  // check required true than process next
  if (requiredAnsCheck.every((item) => item == true)) {
    results = questions.map((question, i) =>
      question.right.every(
        (right) =>
          question.right.length === selectedAnswers?.[i]?.length &&
          selectedAnswers[i].includes(right)
      )
    );

    pointCount = questions.filter((question, i) =>
      question.right.every(
        (right) =>
          question.right.length === selectedAnswers?.[i]?.length &&
          selectedAnswers[i].includes(right)
      )
    );
    // catch points
    score = pointCount.map((i) => i.point);
    console.log(score);

    //console.log(score.reduce((a, b) => a + b));

    renderQestions();

    quizForm.removeEventListener("submit", processAnswer);

    quizForm.insertAdjacentHTML(
      "afterbegin",
      `<h2>Score</h2>
      <div class="result">
      <h4>Name: ${studentInfo.map((item) => item.myName).join("")}</h4>
            <h5>ID: ${studentInfo.map((item) => item.myID).join("")}</h5>
                  <h5>Department: ${studentInfo
                    .map((item) => item.myDef)
                    .join("")}</h5>


       <h4>Your score is : ${
         score.length == 0 ? "0" : score.reduce((a, b) => a + b)
       }/${allPoints} </h4>    
      </div>`
    );
  } else {
    alert("Please fill up the quis form???");
  }
};

const handleAnswer = (value, indx, type, checked) => {
  if (!selectedAnswers[indx]) selectedAnswers[indx] = [];

  if (checked) {
    if (type === "multi") selectedAnswers[indx].push(value);
    else selectedAnswers[indx] = [value];
  } else {
    if (type === "multi")
      selectedAnswers[indx].splice(selectedAnswers[indx].indexOf(value), 1);
  }
};

const renderQestions = () => {
  const quizHTML = questions
    .map(
      (question, i) => `
    <div class="main-div ${results.length && (results[i] ? "right" : "wrong")}">
        <label style="border: none;" class="${
          results.length && (results[i] ? "right" : "wrong")
        }">${i + 1}. ${question.title}<span class="point">${
        results[i] ? question.point : 0
      }/${question.point}</span></label>
        <br>
        <br>
        ${question.options
          .map(
            (option) => `
            <input ${
              selectedAnswers?.[i]?.includes(option) && "checked"
            }  onchange="handleAnswer(event.target.value, ${i}, '${
              question.type
            }', event.target.checked)" type="${
              question.type === "single" ? "radio" : "checkbox"
            }" name="${i}" value="${option}"> <span>${option}</span>
        `
          )
          .join("")}
        <br>
        ${
          results.length
            ? !results[i]
              ? `<p class="correct-ans">Correct Answer: <span class='ans-value'>${question.right.map(
                  (right) => right
                )}</span></p>`
              : ""
            : ""
        }
    </div>
    `
    )
    .join("");

  quizForm.innerHTML = quizHTML;
  quizForm.insertAdjacentHTML("afterbegin", `<h4>Quiz Form!!!</h4>`);

  quizForm.insertAdjacentHTML("beforeend", `<input type="submit">`);

  quizForm.addEventListener("submit", processAnswer);
};
window.addEventListener("DOMContentLoaded", renderQestions);
