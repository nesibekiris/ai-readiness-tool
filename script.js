
async function generateRadarMap() {
    const sections = document.querySelectorAll('.section');
    const scores = {};
    sections.forEach(section => {
        const sectionName = section.querySelector('h2').innerText;
        const questions = section.querySelectorAll('.question');
        let score = 0;
        questions.forEach(question => {
            if (question.checked) score++;
        });
        scores[sectionName] = score;
    });

    displayRadarMap(scores);
    document.getElementById('enhancement-data').value = JSON.stringify(scores);
}

function displayRadarMap(scores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);

    const ctx = document.getElementById('radar-chart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Readiness Scores',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scale: {
                ticks: { beginAtZero: true, max: 5 }
            }
        }
    });
}

async function submitToGPT() {
    const data = document.getElementById('enhancement-data').value;

    const response = await fetch('/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });

    const result = await response.json();
    document.getElementById('gpt-response').innerText = result.message;
}
