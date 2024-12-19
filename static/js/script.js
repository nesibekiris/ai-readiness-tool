// Function to calculate scores and update the radar chart
function generateRadarMap() {
    // Select all sections
    const sections = document.querySelectorAll('.section');
    const scores = {};
    const maxScores = {};

    sections.forEach(section => {
        // Get the section name
        const sectionName = section.querySelector('h2').innerText;

        // Get all questions (checkboxes) in the section
        const questions = section.querySelectorAll('.question');

        // Calculate the score for the section
        let score = 0;
        questions.forEach(question => {
            if (question.checked) score++;
        });

        // Store the score and max possible score
        scores[sectionName] = score;
        maxScores[sectionName] = questions.length;
    });

    // Log the scores for debugging
    console.log('Scores:', scores);
    console.log('Max Scores:', maxScores);

    // Generate the radar chart
    displayRadarMap(scores, maxScores);

    // Store the data for enhancement
    document.getElementById('enhancement-data').value = JSON.stringify(scores);
}

// Function to display the radar chart
function displayRadarMap(scores, maxScores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    const maxValues = Object.values(maxScores);

    const ctx = document.getElementById('radar-chart').getContext('2d');

    // Clear existing chart if any
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    // Create a new radar chart
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
                        color: 'white', // White text for the dark background
                    },
                },
            },
            scales: {
                r: {
                    ticks: {
                        beginAtZero: true,
                        color: 'white', // White tick marks
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.5)', // Light white angle lines
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)', // Grid lines
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
