loadPolarAreaChart();

function loadPolarAreaChart() {
    var detoxData = [407, 413, 428, 415, 466, 345, 385, 429, 473, 374];
    var nonDetoxData = [232, 211, 245, 180, 209, 215, 299, 254, 337, 195];

    // Sample data for menstrual cycle phases (color coding)
    var menstrualPhases = {
        "Luteal": "rgba(255, 165, 0, 0.6)",
        "Period": "rgba(255, 0, 0, 0.6)",
        "Follicular": "rgba(255, 255, 0, 0.6)",
        "Ovulation": "rgba(255, 192, 203, 0.6)"
    };
    var menstrualDetox = ["Period", "Period", "Period", "Follicular", "Follicular", "Follicular", "Follicular", "Follicular", "Follicular", "Follicular"];
    var menstrualNonDetox = ["Luteal", "Luteal", "Luteal", "Luteal", "Luteal", "Luteal", "Luteal", "Period", "Period", "Period"];

    // Labels for the days
    var labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"];

    // Create the polar area chart
    var ctx = document.getElementById('polarChart').getContext('2d');
    var polarChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Detox Period',
                    data: detoxData,
                    backgroundColor: menstrualDetox.map(phase => menstrualPhases[phase]),
                },
                {
                    label: 'Non-Detox Period',
                    data: nonDetoxData,
                    backgroundColor: menstrualNonDetox.map(phase => menstrualPhases[phase]),
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            }
        }
    });
    // Generate custom legend
    var legend = document.getElementById('customLegend');
    var legendTitle = document.createElement('div');
    legendTitle.classList.add('legend-title');
    legendTitle.textContent = 'Menstrual Cycle Phases';
    legendTitle.style.marginRight = '10px';
    legend.appendChild(legendTitle);


    Object.keys(menstrualPhases).forEach(function (phase) {
        var item = document.createElement('div');
        item.classList.add('legend-item');
        item.style.backgroundColor = menstrualPhases[phase];
        var phaseName = document.createElement('span');
        phaseName.textContent = phase;
        item.appendChild(phaseName);
        legend.appendChild(item);
    });

}
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });

    function activateTab(tabId) {
        const allTabs = document.querySelectorAll('.tab-button');
        const allTabContents = document.querySelectorAll('.tab-content');

        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        allTabContents.forEach(content => {
            content.classList.add('hidden');
        });

        const selectedTab = document.querySelector(`[data-tab='${tabId}']`);
        const selectedTabContent = document.getElementById(tabId);

        selectedTab.classList.add('active');
        selectedTabContent.classList.remove('hidden');
        if (tabId === 'tab3') {
            populateTableFromCSV();
        }
    }



    function populateTableFromCSV() {
        fetch('data/dataset.csv')
            .then(response => response.text())
            .then(data => {
                const tableContainer = document.getElementById('data-table-container');
                const table = document.createElement('table');
                table.classList.add('data-table');

                data.trim().split('\n').forEach((row, index) => {
                    const rowData = row.split(',');
                    const tableRow = document.createElement('tr');

                    rowData.forEach(cellData => {
                        const cell = index === 0 ? 'th' : 'td';
                        const cellElement = document.createElement(cell);
                        cellElement.textContent = cellData;
                        tableRow.appendChild(cellElement);
                    });

                    table.appendChild(tableRow);
                });

                tableContainer.innerHTML = ''; // Clear existing content
                tableContainer.appendChild(table);
            })
            .catch(error => console.log('Error fetching CSV file:', error));
    }
});