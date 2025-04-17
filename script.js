// Constants for account distribution
const ACCOUNT_DISTRIBUTION = {
    ACCOUNT_1: 0.75, // 75%
    ACCOUNT_2: 0.15, // 15%
    ACCOUNT_3: 0.10  // 10%
};

// Default rates
const DEFAULT_EMPLOYEE_RATE = 11;
const DEFAULT_EMPLOYER_RATE = 13;

// Initialize chart variable
let distributionChart = null;

// Load saved values from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedSalary = localStorage.getItem('salary');
    if (savedSalary) {
        document.getElementById('salary').value = savedSalary;
    }

    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Calculate button click
    document.getElementById('calculateBtn').addEventListener('click', handleCalculate);

    // Custom rate toggle
    document.getElementById('customRate').addEventListener('change', (e) => {
        document.getElementById('rateInputs').classList.toggle('hidden', !e.target.checked);
        updateRateDisplay();
    });

    // Rate input changes
    document.getElementById('employeeRate').addEventListener('input', updateRateDisplay);
    document.getElementById('employerRate').addEventListener('input', updateRateDisplay);

    // Months slider
    const monthsSlider = document.getElementById('monthsSlider');
    monthsSlider.addEventListener('input', (e) => {
        document.getElementById('monthsValue').textContent = `${e.target.value} months`;
        if (!document.getElementById('results').classList.contains('hidden')) {
            calculateAndDisplay();
        }
    });
}

function updateRateDisplay() {
    const isCustomRate = document.getElementById('customRate').checked;
    const employeeRate = isCustomRate ? 
        document.getElementById('employeeRate').value : 
        DEFAULT_EMPLOYEE_RATE;
    const employerRate = isCustomRate ? 
        document.getElementById('employerRate').value : 
        DEFAULT_EMPLOYER_RATE;
    
    document.getElementById('rateDisplay').value = `${employeeRate}% + ${employerRate}%`;
}

function handleCalculate() {
    calculateAndDisplay();
}

function calculateAndDisplay() {
    // Get input values
    const salary = parseFloat(document.getElementById('salary').value);
    const isCustomRate = document.getElementById('customRate').checked;
    const employeeRate = isCustomRate ? 
        parseFloat(document.getElementById('employeeRate').value) : 
        DEFAULT_EMPLOYEE_RATE;
    const employerRate = isCustomRate ? 
        parseFloat(document.getElementById('employerRate').value) : 
        DEFAULT_EMPLOYER_RATE;

    // Validate input
    if (!salary || salary <= 0) {
        alert('Please enter a valid salary amount');
        return;
    }

    // Save to localStorage
    localStorage.setItem('salary', salary);

    // Calculate contributions
    const employeeContribution = (salary * employeeRate) / 100;
    const employerContribution = (salary * employerRate) / 100;
    const totalContribution = employeeContribution + employerContribution;

    // Calculate account distributions
    const account1Amount = totalContribution * ACCOUNT_DISTRIBUTION.ACCOUNT_1;
    const account2Amount = totalContribution * ACCOUNT_DISTRIBUTION.ACCOUNT_2;
    const account3Amount = totalContribution * ACCOUNT_DISTRIBUTION.ACCOUNT_3;

    // Display overall total
    document.getElementById('overallTotal').textContent = `RM ${totalContribution.toFixed(2)}`;

    // Display results
    displayAccountBreakdown(account1Amount, account2Amount, account3Amount, totalContribution);
    updateChart(account1Amount, account2Amount, account3Amount);
    displayProjections(totalContribution);

    // Show results section
    document.getElementById('results').classList.remove('hidden');
}

function displayAccountBreakdown(acc1, acc2, acc3, total) {
    const breakdown = document.getElementById('accountBreakdown');
    breakdown.innerHTML = `
        <div class="mb-4">
            <div class="text-lg font-medium">Total Contribution</div>
            <div class="text-2xl font-bold">RM ${total.toFixed(2)}</div>
        </div>
        <div class="space-y-2">
            <div class="flex justify-between">
                <span>Account 1</span>
                <span class="font-medium">RM ${acc1.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>Account 2</span>
                <span class="font-medium">RM ${acc2.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>Account 3</span>
                <span class="font-medium">RM ${acc3.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function displayAccountBreakdown(acc1, acc2, acc3) {
    const breakdown = document.getElementById('accountBreakdown');
    breakdown.innerHTML = `
        <div class="flex justify-between">
            <span>Account 1 (75%):</span>
            <span class="font-medium">RM ${acc1.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span>Account 2 (15%):</span>
            <span class="font-medium">RM ${acc2.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span>Account 3 (10%):</span>
            <span class="font-medium">RM ${acc3.toFixed(2)}</span>
        </div>
    `;
}

function updateChart(acc1, acc2, acc3) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (distributionChart) {
        distributionChart.destroy();
    }

    distributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Account 1', 'Account 2', 'Account 3'],
            datasets: [{
                data: [acc1, acc2, acc3],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw.toFixed(2);
                            return `RM ${value}`;
                        }
                    }
                }
            }
        }
    });
}

function displayProjections(monthlyTotal) {
    const months = parseInt(document.getElementById('monthsSlider').value);
    const projectionResults = document.getElementById('projectionResults');
    
    const account1Total = monthlyTotal * months * ACCOUNT_DISTRIBUTION.ACCOUNT_1;
    const account2Total = monthlyTotal * months * ACCOUNT_DISTRIBUTION.ACCOUNT_2;
    const account3Total = monthlyTotal * months * ACCOUNT_DISTRIBUTION.ACCOUNT_3;
    const grandTotal = monthlyTotal * months;

    projectionResults.innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between">
                <span>Account 1 Total:</span>
                <span class="font-medium">RM ${account1Total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>Account 2 Total:</span>
                <span class="font-medium">RM ${account2Total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>Account 3 Total:</span>
                <span class="font-medium">RM ${account3Total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-blue-600 font-medium pt-2 border-t">
                <span>Total Projected Contribution:</span>
                <span>RM ${grandTotal.toFixed(2)}</span>
            </div>
        </div>
    `;
} 