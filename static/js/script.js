// Function to calculate scores and update the radar chart
function generateRadarMap() {
    const sections = document.querySelectorAll('.section');
    const scores = {};
    const maxScores = {};

    sections.forEach(section => {
        const sectionName = section.querySelector('h2').innerText;
        const questions = section.querySelectorAll('.question');
        let score = 0;

        questions.forEach(question => {
            if (question.checked) score++;
        });

        scores[sectionName] = score;
        maxScores[sectionName] = questions.length;
    });

    console.log('Scores:', scores);
    console.log('Max Scores:', maxScores);

    displayRadarMap(scores, maxScores);
    document.getElementById('enhancement-data').value = JSON.stringify(scores);
}

// Function to display the radar chart
function displayRadarMap(scores, maxScores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    const maxValues = Object.values(maxScores);

    const ctx = document.getElementById('radar-chart').getContext('2d');

    if (window.radarChart) {
        window.radarChart.destroy(); // Clear existing chart if any
    }

    // Create the radar chart
    window.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Achieved Scores',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.4)', // Light Blue
                    borderColor: 'rgba(54, 162, 235, 1)', // Blue Border
                    borderWidth: 2,
                },
                {
                    label: 'Max Possible Scores',
                    data: maxValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light Red
                    borderColor: 'rgba(255, 99, 132, 1)', // Red Border
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'black', // Adjust text color
                    },
                },
            },
            scales: {
                r: {
                    ticks: {
                        beginAtZero: true,
                        color: 'black', // Adjust tick color
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)', // Adjust gridline color
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)', // Adjust grid color
                    },
                },
            },
        },
    });
}

// Function to submit data to GPT for recommendations
async function submitToGPT() {
    const data = document.getElementById('enhancement-data').value;

    // Make the API call
    const response = await fetch('/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
    });

    // Display the GPT response
    const result = await response.json();
    document.getElementById('gpt-response').innerText = result.message || 'Error fetching recommendations.';
}
