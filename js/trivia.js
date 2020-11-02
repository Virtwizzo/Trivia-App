const question = document.getElementById('question');
const answers = Array.from(document.getElementsByClassName('answer-content'));
const questionCounterText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

//Access Tandem trivia questions through fetch and map them to a usable array
fetch("./data/Apprentice_TandemFor400_Data.json")
    .then((results) => {
        return results.json();
    })
    .then((loadedQuestions) => {
        console.log(loadedQuestions);
        questions = loadedQuestions.results.map((loadedIndividual) => {
            const readyQuestion = {
                question: loadedIndividual.question
            };
            
            const answerChoices = [...loadedIndividual.incorrect];
            readyQuestion.answer = Math.floor(Math.random()*4) + 1;
            answerChoices.splice(readyQuestion.answer - 1, 0, readyQuestion.correct);

            answerChoices.forEach((choice, index) => {
                readyQuestion["choice" + (index + 1)] = choice;
            });

            return readyQuestion;
        });
        startGame();
    });

    

//CONSTANTS
const CORRECT_POINTS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    questionCounterText.innerText = '${questionCounter}/${MAX_QUESTIONS}';

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    answers.forEach((answer) => {
        const number = answer.dataset['number'];
        answer.innerText = currentQuestion['answer' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

answers.forEach((answer) => {
    answer.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = "incorrect";
            if (selectedAnswer == "incorrect"){
                classToApply = "correct";
            }

            if(classToApply == "correct") {
                changeScore(CORRECT_POINTS);
            }
        
        
        console.log(classToApply);
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

changeScore = num => {
    score += num;
    scoreText.innerText = score;
}

