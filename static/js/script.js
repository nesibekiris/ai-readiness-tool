// Function to generate radar chart
function generateRadarMap() {
    const sections = document.querySelectorAll('.section');
    const scores = {};
    const maxScores = {};

    // Calculate scores for each section
    sections.forEach((section) => {
        const sectionName = section.querySelector('h2').innerText;
        const questions = section.querySelectorAll('.question');
        let score = 0;

        questions.forEach((question) => {
            if (question.checked) score++;
        });

        scores[sectionName] = score;
        maxScores[sectionName] = questions.length; // Max score for each section
    });

    // Debugging: Log radar data
    console.log("Radar data:", scores, maxScores);

    // Render radar chart
    displayRadarMap(scores, maxScores);
}

// Function to render radar chart
function displayRadarMap(scores, maxScores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    const maxData = Object.values(maxScores);

    const ctx = document.getElementById('radar-chart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (window.myRadarChart) {
        window.myRadarChart.destroy();
    }

    // Create a new radar chart instance
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Your Scores',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                },
                {
                    label: 'Maximum Scores',
                    data: maxData,
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 16,
                            family: 'Arial',
                        },
                        color: '#FFD700',
                    },
                },
                tooltip: {
                    backgroundColor: '#FFD700', // Yellow tooltips
                    titleFont: {
                        size: 14,
                        family: 'Arial',
                    },
                    bodyFont: {
                        size: 12,
                        family: 'Arial',
                    },
                    footerFont: {
                        size: 12,
                        family: 'Arial',
                    },
                },
            },
            scales: {
                r: {
                    angleLines: {
                        color: '#FFD700', // Yellow angle lines
                    },
                    grid: {
                        color: '#FFFFFF', // White grid
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        font: {
                            size: 14,
                            family: 'Arial',
                        },
                        color: '#FFFFFF',
                    },
                    pointLabels: {
                        font: {
                            size: 16,
                            family: 'Arial',
                        },
                        color: '#FFFFFF', // White point labels
                    },
                },
            },
        },
    });
}

// Function to submit checklist to GPT for suggestions
async function submitToGPT() {
    const sections = document.querySelectorAll('.section');
    const scores = {};

    sections.forEach((section) => {
        const sectionName = section.querySelector('h2').innerText;
        const questions = section.querySelectorAll('.question');
        let score = 0;

        questions.forEach((question) => {
            if (question.checked) score++;
        });

        scores[sectionName] = score;
    });

    try {
        const response = await fetch('/enhance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scores),
        });

        const result = await response.json();
        const responseDiv = document.getElementById('gpt-response');
        responseDiv.innerText = result.message || result.error || 'Error fetching recommendations.';
    } catch (error) {
        console.error('Error fetching GPT recommendations:', error);
        document.getElementById('gpt-response').innerText = 'Error fetching recommendations. Please try again later.';
    }
}
