// Function to generate radar chart
function generateRadarMap() {
    const sections = document.querySelectorAll('.section');
    const scores = {};
    const maxScores = {};

    // Collect scores from each section
    sections.forEach((section) => {
        const sectionName = section.querySelector('h2').innerText;
        const questions = section.querySelectorAll('.question');
        let score = 0;

        questions.forEach((question) => {
            if (question.checked) score++;
        });

        scores[sectionName] = score;
        maxScores[sectionName] = questions.length;
    });

    displayRadarMap(scores, maxScores);
}

// Function to render radar chart
function displayRadarMap(scores, maxScores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    const maxData = Object.values(maxScores);

    const ctx = document.getElementById('radar-chart').getContext('2d');

    // Destroy existing chart instance if any
    if (window.myRadarChart) {
        window.myRadarChart.destroy();
    }

    // Create a new radar chart
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Your Scores',
                    data: data,
                    backgroundColor: 'rgba(241, 196, 15, 0.3)', // Gold (translucent)
                    borderColor: '#f1c40f', // Gold
                    borderWidth: 2,
                    pointBackgroundColor: '#f1c40f',
                },
                {
                    label: 'Maximum Scores',
                    data: maxData,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)', // Light Blue (translucent)
                    borderColor: '#36A2EB', // Light Blue
                    borderWidth: 2,
                    pointBackgroundColor: '#36A2EB',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { color: '#fff' } },
            },
            scales: {
                r: {
                    grid: { color: '#fff' },
                    angleLines: { color: '#fff' },
                    ticks: { color: '#fff', beginAtZero: true },
                    pointLabels: { color: '#fff', font: { size: 14 } },
                },
            },
        },
    });
}

// Chat functionality
async function askChatGPT() {
    const query = document.getElementById('user-query').value;
    if (!query) {
        alert('Please enter a question.');
        return;
    }

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query }),
        });

        const result = await response.json();
        document.getElementById('chat-response').innerText = result.message || 'Error fetching response.';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('chat-response').innerText = 'Error fetching response. Please try again later.';
    }
}
