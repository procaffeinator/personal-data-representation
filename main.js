loadPolarAreaChart();
function loadPolarAreaChart() {
    var menstrualPhases = {
        "Luteal": "rgba(255, 165, 0, 0.6)",
        "Period": "rgba(255, 0, 0, 0.6)",
        "Follicular": "rgba(255, 255, 0, 0.6)",
        "Ovulation": "rgba(255, 192, 203, 0.6)"
    };
    var nonDetoxApps = [];
    var detoxApps = [];
    var detoxData = [];
    var nonDetoxData = [];
    var labels = [];
    var menstrualDetox = [];
    var menstrualNonDetox = [];
    // Create the polar area chart
    fetch('data/dataset.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            lines.slice(1).forEach(row => { // Skip the header line
                const rowData = row.split(';');
                const apps = rowData[5] // Split the apps by comma and space

                labels.push('Day ' + rowData[1]);
                if (rowData[4] === 'Non-Detox') {
                    nonDetoxApps.push(apps);
                    nonDetoxData.push(rowData[2]);
                    menstrualNonDetox.push(rowData[3]);
                } else if (rowData[4] === 'Detox') {
                    detoxApps.push(apps);
                    detoxData.push(rowData[2]);
                    menstrualDetox.push(rowData[3]);
                }

            });
            var ctx = document.getElementById('polarChart').getContext('2d');

            // Now, initialize the Chart object with the annotations included
            var polarChart = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: labels,
                    datasets: [{
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
                        r: { // Change 'yAxis' to 'r'
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Screen Time (mins)' // Your y-axis label
                            }
                        },
                        x: { // Change 'x' to 'xAxis'

                            title: {
                                display: true,
                                text: 'Days' // Your x-axis label
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                afterLabel: function (context) {
                                    const datasetIndex = context.datasetIndex;
                                    const dataIndex = context.dataIndex;
                                    var appData = datasetIndex === 0 ? detoxApps[dataIndex] : nonDetoxApps[dataIndex];
                                    return 'Top 3 apps: ' + appData;
                                }
                            }
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
        })
        .catch(error => console.log('Error fetching CSV file:', error));

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
                    const rowData = row.split(';');
                    const tableRow = document.createElement('tr');

                    rowData.forEach((cellData, cellIndex) => {
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