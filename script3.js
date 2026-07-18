


// ---------history--------reports---------settings-------search-----filter-------charts---------













const topSpending = document.getElementById("topSpending");

if (topSpending) {

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    topSpending.innerHTML = "";

    expenses.forEach(expense => {

        topSpending.innerHTML += `
        <li>
            <span>${expense.category}</span>
            <strong>₹${expense.amount}</strong>
        </li>
        `;

    });

}

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
// HISTORY MODULE
// =========================

function loadHistory() {

    const tbody = document.getElementById("historyTableBody");

    if (!tbody) return;

    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let transactions = [];

    incomes.forEach(item => {

        transactions.push({

            type: "Income",

            name: item.source,

            category: "Income",

            amount: item.amount,

            date: item.date,

            description: item.description

        });

    });

    expenses.forEach(item => {

        transactions.push({

            type: "Expense",

            name: item.name,

            category: item.category,

            amount: item.amount,

            date: item.date,

            description: item.description

        });

    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = "";

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach((item) => {

        if (item.type === "Income") {

            totalIncome += item.amount;

        } else {

            totalExpense += item.amount;

        }

        tbody.innerHTML += `

<tr>

<td>${item.type}</td>

<td>${item.name}</td>

<td>${item.category}</td>

<td>₹${item.amount}</td>

<td>${formatDate(item.date)}</td>

<td>${item.description}</td>



</tr>

`;

    });

    document.getElementById("historyIncome").innerText = "₹" + totalIncome;

    document.getElementById("historyExpense").innerText = "₹" + totalExpense;

    document.getElementById("historyBalance").innerText =
        "₹" + (totalIncome - totalExpense);

    document.getElementById("totalTransactions").innerText =
        transactions.length;

}

if (document.getElementById("historyTableBody")) {
    loadHistory();
}

const historySearch = document.getElementById("historySearch");

if (historySearch) {

    historySearch.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("#historyTableBody tr");

        rows.forEach(row => {

            const text = row.textContent.toLowerCase();

            row.style.display = text.includes(value) ? "" : "none";

        });

    });

}

const historyCategory = document.getElementById("historyCategory");

if (historyCategory) {

    historyCategory.addEventListener("change", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("#historyTableBody tr");

        rows.forEach(row => {

            if (value === "all") {

                row.style.display = "";

                return;

            }

            const category = row.cells[2].textContent.toLowerCase();

            row.style.display = category === value ? "" : "none";

        });

    });

}

const historyDate = document.getElementById("historyDate");

if (historyDate) {

    historyDate.addEventListener("change", function () {

        const selectedDate = this.value;

        const rows = document.querySelectorAll("#historyTableBody tr");

        rows.forEach(row => {

            const rowDate = row.cells[4].textContent;

            row.style.display = rowDate === selectedDate ? "" : "none";

        });

        if (selectedDate === "") {

            rows.forEach(row => {

                row.style.display = "";

            });

        }

    });

}

//===========================
// REPORT MODULE
//===========================

function loadReport() {

    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryData = {};

    incomes.forEach(item => {
        totalIncome += item.amount;
    });

    expenses.forEach(item => {

        totalExpense += item.amount;

        if (categoryData[item.category]) {
            categoryData[item.category] += item.amount;
        } else {
            categoryData[item.category] = item.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    const saving = totalIncome === 0
        ? 0
        : Math.round((balance / totalIncome) * 100);

    document.getElementById("reportIncome").innerText = "₹" + totalIncome;
    document.getElementById("reportExpense").innerText = "₹" + totalExpense;
    document.getElementById("reportBalance").innerText = "₹" + balance;
    document.getElementById("reportSaving").innerText = saving + "%";

    document.getElementById("goalFill").style.width = saving + "%";
    document.getElementById("goalText").innerText = saving + "% Completed";

    // Pie Chart

    new Chart(document.getElementById("expenseChart"), {

        type: "pie",

        data: {

            labels: Object.keys(categoryData),

            datasets: [{

                data: Object.values(categoryData)

            }]

        }

    });

    // Bar Chart

    new Chart(document.getElementById("incomeChart"), {

        type: "bar",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                label: "Amount",

                data: [totalIncome, totalExpense]

            }]

        }

    });

}

if (document.getElementById("reportIncome")) {
    loadReport();
}


//======================
// SETTINGS MODULE
//======================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
if (profileName && profileEmail && currentUser) {

    profileName.value = currentUser.name;

    profileEmail.value = currentUser.email;

}



const updateProfile = document.getElementById("updateProfile");

if (updateProfile) {

    updateProfile.addEventListener("click", function () {

        const newName = profileName.value.trim();

        if (!newName) {

            alert("Enter your name");

            return;

        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users.forEach(user => {

            if (user.email === currentUser.email) {

                user.name = newName;

            }

        });

        currentUser.name = newName;

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Profile Updated Successfully");
window.location.href = "dashboard.html";
    });

}

const updatePassword = document.getElementById("updatePassword");

if (updatePassword) {

    updatePassword.addEventListener("click", function () {

        const current = document.getElementById("currentPassword").value;

        const newPass = document.getElementById("newPassword").value;

        const confirm = document.getElementById("confirmPassword").value;

        if (current !== currentUser.password) {

            alert("Current Password is Incorrect");

            return;

        }

        if (newPass !== confirm) {

            alert("Passwords do not match");

            return;

        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users.forEach(user => {

            if (user.email === currentUser.email) {

                user.password = newPass;

            }

        });

        currentUser.password = newPass;

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Password Updated Successfully");

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