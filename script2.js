


// ----------- expense module------------dashboard---------------balance calculation------------ recent transactions--------





function addNotification(message) {

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({
        message: message,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));

}







function formatDate(date) {

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}
  

// =========================
// EXPENSE MODULE
// =========================


const expenseForm = document.getElementById("expenseForm");

if (expenseForm) {

    showExpense();

    expenseForm.addEventListener("submit", function (e) {
 
        e.preventDefault();

        const name = document.getElementById("expenseName").value.trim();

        const category = document.getElementById("expenseCategory").value;

        const amount = Number(document.getElementById("expenseAmount").value);

        const date = document.getElementById("expenseDate").value;

        const description = document.getElementById("expenseDescription").value.trim();

        if (!name || !amount || !date) {

            alert("Please fill all required fields");

            return;

        }

        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        expenses.push({
            

            name,

            category,

            amount,

            date,

            description

        });
        console.log(expenses);

       localStorage.setItem("expenses", JSON.stringify(expenses));

console.log("Reached before notification");

addNotification("Expense Added Successfully 💸");

console.log("Reached after notification");

        console.log(localStorage.getItem("expenses"));

        expenseForm.reset();

        showExpense();

    });

}


function deleteExpense(index){

let expenses=JSON.parse(localStorage.getItem("expenses"))||[];

expenses.splice(index,1);

localStorage.setItem("expenses",JSON.stringify(expenses));

showExpense();

}



function editExpense(index){

let expenses=JSON.parse(localStorage.getItem("expenses"))||[];

document.getElementById("expenseName").value=expenses[index].name;

document.getElementById("expenseCategory").value=expenses[index].category;

document.getElementById("expenseAmount").value=expenses[index].amount;

document.getElementById("expenseDate").value=expenses[index].date;

document.getElementById("expenseDescription").value=expenses[index].description;

expenses.splice(index,1);

localStorage.setItem("expenses",JSON.stringify(expenses));

showExpense();

}

function showExpense() {

    const tbody = document.getElementById("expenseTableBody");
    const totalExpense = document.getElementById("totalExpense");

    if (!tbody || !totalExpense) return;

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    tbody.innerHTML = "";

    let total = 0;

    expenses.forEach((expense, index) => {

        total += expense.amount;

        tbody.innerHTML += `
        <tr>
            <td>${expense.name}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>
                <i class="ri-edit-line edit-icon" onclick="editExpense(${index})"></i>
                <i class="ri-delete-bin-6-line delete-icon" onclick="deleteExpense(${index})"></i>
            </td>
        </tr>
        `;
    });

    totalExpense.innerText = "₹" + total;
}


const searchExpense=document.getElementById("searchExpense");

if(searchExpense){

searchExpense.addEventListener("input",function(){

const value=this.value.toLowerCase();

const rows=document.querySelectorAll("#expenseTableBody tr");

rows.forEach(row=>{

const text=row.textContent.toLowerCase();

row.style.display=text.includes(value)?"":"none";

});

});

}


// -------------dashboard----------

function updateDashboard() {

    const income = JSON.parse(localStorage.getItem("incomes")) || [];

    const expense = JSON.parse(localStorage.getItem("expenses")) || [];

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let totalIncome = 0;
    let totalExpense = 0;

    income.forEach(item => {

        totalIncome += item.amount;

    });

    expense.forEach(item => {

        totalExpense += item.amount;

    });

    const balance = totalIncome - totalExpense;
    let saving = totalIncome === 0
    ? 0
    : Math.round((balance / totalIncome) * 100);

if (saving < 0) saving = 0;

    const incomeCard = document.getElementById("dashboardIncome");

    const expenseCard = document.getElementById("dashboardExpense");

    const balanceCard = document.getElementById("dashboardBalance");

    const savingCard = document.getElementById("dashboardSavings");

    const welcome = document.getElementById("welcomeUser");

    if (incomeCard)
        incomeCard.innerText = "₹" + totalIncome;

    if (expenseCard)
        expenseCard.innerText = "₹" + totalExpense;

    if (balanceCard)
        balanceCard.innerText = "₹" + balance;

    if (savingCard)
        savingCard.innerText = saving + "%";

    if (welcome && currentUser)
        welcome.innerText = `Welcome Back, ${currentUser.name} 👋`;


    
const recentTransactions = document.getElementById("recentTransactions");

if (recentTransactions) {

    let transactions = [];

    income.forEach(item => {
        transactions.push({
            type: "Income",
            name: item.source,
            amount: item.amount,
            date: item.date
        });
    });

    expense.forEach(item => {
        transactions.push({
            type: "Expense",
            name: item.name,
            amount: item.amount,
            date: item.date
        });
    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    recentTransactions.innerHTML = "";

    if (transactions.length === 0) {

        recentTransactions.innerHTML = "<p>No Transactions Yet</p>";

    } else {

        transactions.slice(0, 5).forEach(item => {

            recentTransactions.innerHTML += `

<div class="transaction-item">

    <div>
        <strong>${item.name}</strong><br>
        <small>${item.type}</small>
    </div>

    <div>
        ₹${item.amount}
    </div>

</div>

`;

        });

    }

}



const progress = document.getElementById("dashboardProgress");
const progressText = document.getElementById("dashboardProgressText");

if (progress && progressText) {

    let used = totalIncome === 0
        ? 0
        : Math.round((totalExpense / totalIncome) * 100);

    if (used > 100) used = 100;

    progress.style.width = used + "%";

    progressText.innerText = used + "% Budget Used";

}

const chartCanvas = document.getElementById("dashboardChart");

if (chartCanvas) {

   if (window.dashboardChart instanceof Chart) {
    window.dashboardChart.destroy();
}
    window.dashboardChart = new Chart(chartCanvas, {

        type: "bar",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                label: "Amount",

                data: [totalIncome, totalExpense],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });

}

}

updateDashboard();

const addIncomeBtn = document.getElementById("addIncomeBtn");

if (addIncomeBtn) {
    addIncomeBtn.addEventListener("click", function () {
        window.location.href = "Income.html";
    });
}

const addExpenseBtn = document.getElementById("addExpenseBtn");

if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", function () {
        window.location.href = "expense.html";
    });
}

const viewReportBtn = document.getElementById("viewReportBtn");

if (viewReportBtn) {
    viewReportBtn.addEventListener("click", function () {
        window.location.href = "report.html";
    });
}

const historyBtn = document.getElementById("historyBtn");

if (historyBtn) {
    historyBtn.addEventListener("click", function () {
        window.location.href = "history.html";
    });
}
console.log("Profile JS Started");


const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");

if (profileIcon && profileDropdown) {

    profileIcon.addEventListener("click", function (e) {

        e.stopPropagation();
        profileDropdown.classList.toggle("show");

    });

    document.addEventListener("click", function () {

        profileDropdown.classList.remove("show");

    });

}

const profileLogoutBtn = document.getElementById("logoutBtn");

if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    });

}

const notificationIcon = document.getElementById("notificationIcon");
const notificationDropdown = document.getElementById("notificationDropdown");

if (notificationIcon && notificationDropdown) {

    notificationIcon.addEventListener("click", function (e) {

        e.stopPropagation();

        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

        notificationDropdown.innerHTML = "";

        if (notifications.length === 0) {

            notificationDropdown.innerHTML = "<p style='padding:15px'>No Notifications</p>";

        } else {

            notifications.forEach(item => {

                notificationDropdown.innerHTML += `
                    <div class="notification-item">
                        <p>${item.message}</p>
                        <small>${item.time}</small>
                    </div>
                `;

            });

        }

        notificationDropdown.classList.toggle("show");

    });

    document.addEventListener("click", function () {
        notificationDropdown.classList.remove("show");
    });

}