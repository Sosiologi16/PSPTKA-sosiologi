let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let userSchool = "";
let userClass = "";

const loginContainer = document.getElementById("login-container");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

document.getElementById("start-quiz-btn").addEventListener("click", async () => {
  userName = document.getElementById("user-name").value;
  userSchool = document.getElementById("user-school").value;
  userClass = document.getElementById("user-class").value;

  if (!userName || !userSchool || !userClass) {
    alert("Lengkapi semua data diri terlebih dahulu!");
    return;
  }

  const res = await fetch("assets/questions.json");
  questions = await res.json();
  questions = shuffleArray(questions);
  startQuiz();
});

function startQuiz() {
  loginContainer.style.display = "none";
  quizContainer.style.display = "block";
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.classList.add("action-btn");
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, currentQuestion.answer));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

function selectAnswer(selectedIndex, correctIndex) {
  const buttons = Array.from(answerButtons.children);
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.style.backgroundColor = "#4CAF50";
    if (i === selectedIndex && selectedIndex !== correctIndex)
      btn.style.backgroundColor = "#E74C3C";
  });
  if (selectedIndex === correctIndex) score++;
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizContainer.style.display = "none";
  resultsContainer.style.display = "block";
  document.getElementById("results-title").textContent = `Hasil untuk ${userName}`;
  document.getElementById("score-text").textContent = `Skor Anda: ${score}/${questions.length}`;
}

document.getElementById("download-pdf-btn").addEventListener("click", () => {
  const doc = new jsPDF();
  doc.text(`Hasil Kuis Sosiologi`, 10, 10);
  doc.text(`Nama: ${userName}`, 10, 20);
  doc.text(`Sekolah: ${userSchool}`, 10, 30);
  doc.text(`Kelas: ${userClass}`, 10, 40);
  doc.text(`Skor: ${score}/${questions.length}`, 10, 50);
  doc.save(`hasil_kuis_${userName}.pdf`);
});

document.getElementById("restart-btn").addEventListener("click", () => {
  resultsContainer.style.display = "none";
  loginContainer.style.display = "block";
});

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
