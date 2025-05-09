const questionnaire = [
    {
        qlabel: "Quelle était ma dernière destination ?",
        qid: 1,
        reponses: [
            { rlabel: "Italie", rid: 1 },
            { rlabel: "Tunisie", rid: 2 }
        ],
        correct: 2 // La bonne réponse est "Tunisie"
    },
    {
        qlabel: "Quelle est ma prochaine destination de rêve ?",
        qid: 2,
        reponses: [
            { rlabel: "Corée du sud", rid: 1 },
            { rlabel: "Thaïlande", rid: 2 }
        ],
        correct: 2 // La bonne réponse est "Thaïlande"
    }
];

let currentQuestionIndex = 0;
let reponses = "A"; // Préfixe des réponses

// Fonction pour afficher la question
function afficherQuestion() {
    const container = document.getElementById("question-container");
    container.innerHTML = "";

    // Si toutes les questions ont été posées, vérifier la page
    if (currentQuestionIndex >= questionnaire.length) {
        verifierPage();
        return;
    }

    const question = questionnaire[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.classList.add("mb-4");

    questionElement.innerHTML = `
        <h3 class="text-xl font-semibold mb-4">${question.qlabel}</h3>
        <div class="flex flex-col items-center space-y-2">
            ${question.reponses.map(rep => `
                <button class="btn btn-primary" onclick="repondre(${question.qid}, ${rep.rid})">
                    ${rep.rlabel}
                </button>
            `).join("")}
        </div>
    `;

    container.appendChild(questionElement);
}


// Fonction pour afficher la question
function afficherQuestion() {
    const container = document.getElementById("question-container");
    container.innerHTML = "";

    // Si toutes les questions ont été posées, vérifier la page
    if (currentQuestionIndex >= questionnaire.length) {
        verifierPage();
        return;
    }

    const question = questionnaire[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.classList.add("mb-4");

    questionElement.innerHTML = `
        <h3 class="text-xl font-semibold mb-4">${question.qlabel}</h3>
        <div class="flex flex-col items-center space-y-2">
            ${question.reponses.map(rep => `
                <button class="btn btn-primary" onclick="repondre(${question.qid}, ${rep.rid})">
                    ${rep.rlabel}
                </button>
            `).join("")}
        </div>
    `;

    container.appendChild(questionElement);
}

// Fonction pour répondre à la question
function repondre(qid, rid) {
    reponses += `${qid}_${rid}`; // Ajouter la réponse donnée au résultat

    // Si la réponse est incorrecte, afficher un message et arrêter
    const question = questionnaire[currentQuestionIndex];

    // Si la réponse est incorrecte, afficher un message et arrêter
    if (rid !== question.correct) {
        document.getElementById("question-container").innerHTML = `
            <p class="text-red-500 font-bold">Suite à vos réponses, vous ne souhaitez pas être contacté.</p>
        `;
        return;
    }

    // Si la réponse est correcte, passer à la question suivante
    currentQuestionIndex++;
    afficherQuestion();
}
// Vérifier si la page existe en fonction des réponses et rediriger
function verifierPage() {
    const page = `${reponses}.html`;

    // Log pour vérifier la page calculée
    console.log(`Page calculée : ${page}`);

    // Directement rediriger vers la page calculée (sans fetch)
    window.location.href = page;
}

// Démarrer le questionnaire lorsque le DOM est prêt
document.addEventListener("DOMContentLoaded", afficherQuestion);

// Fonction brute force pour tester toutes les combinaisons possibles
async function bruteForce() {
    const allCombinations = generateCombinations();

    // Tester chaque combinaison
    for (const comb of allCombinations) {
        reponses = "A"; // Réinitialiser les réponses

        // Ajouter chaque réponse dans l'ordre
        comb.forEach(({ qid, rid }) => {
            reponses += `${qid}_${rid}`;
        });

        // Vérifier si la page existe avec fetch
        await verifierPageAvecFetch();
    }
}

// Fonction pour générer toutes les combinaisons possibles de réponses
function generateCombinations() {
    const combinations = [];

    // Créer un tableau de toutes les réponses possibles
    const possibleAnswers = questionnaire.map(q => q.reponses.map(r => ({ qid: q.qid, rid: r.rid })));

    // Fonction pour générer toutes les combinaisons de réponses possibles
    function generate(currentComb, index) {
        if (index === questionnaire.length) {
            combinations.push(currentComb);
            return;
        }

        possibleAnswers[index].forEach(answer => {
            generate([...currentComb, answer], index + 1);
        });
    }

    // Lancer la génération des combinaisons
    generate([], 0);
    return combinations;
}

// Vérifier si la page existe avec un fetch
async function verifierPageAvecFetch() {
    const page = `${reponses}.html`;

    // Log pour vérifier la page calculée
    console.log(`Vérification de la page : ${page}`);

    try {
        const response = await fetch(page, { method: 'HEAD' }); // Effectuer un HEAD request pour vérifier l'existence de la page
        if (response.ok) {
            console.log(`Page trouvée : ${page}`);
            window.location.href = page; // Rediriger vers la page si elle existe
        } else {
            console.log(`Page non trouvée : ${page}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la vérification de la page ${page}:`, error);
    }
}

// Démarrer le questionnaire lorsque le DOM est prêt
document.addEventListener("DOMContentLoaded", afficherQuestion);
