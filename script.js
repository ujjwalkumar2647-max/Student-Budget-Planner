




// -------login ------ signup--------income module-------logout--------session check------





function formatDate(date) {

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// =========================
// SIGNUP
// =========================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      alert("Email already registered.");
      return;
    }

    const newUser = {
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");

    window.location.href = "index.html";
  });
}

// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((user) => {
      return user.email === email && user.password === password;
    });

    if (!user) {
      alert("Invalid Email or Password");

      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    

    window.location.href = "dashboard.html";
  });
}

// =========================
// SESSION CHECK
// =========================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const currentPage = window.location.pathname;

if (currentUser) {
  if (
    currentPage.includes("index.html") ||
    currentPage.includes("signup.html")
  ) {
    window.location.href = "dashboard.html";
  }
}

// =========================
// LOGOUT
// =========================

const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
  });
}

// =========================
// INCOME MODULE
// =========================

const incomeForm = document.getElementById("incomeForm");

if (incomeForm) {
  showIncome();

  incomeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const source = document.getElementById("incomeSource").value.trim();
    const amount = Number(document.getElementById("incomeAmount").value);
    const date = document.getElementById("incomeDate").value;
    const description = document
      .getElementById("incomeDescription")
      .value.trim();

    if (!source || !amount || !date) {
      alert("Please fill all required fields");
      return;
    }

    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];

    incomes.push({
      source,
      amount,
      date,
      description,
    });

    localStorage.setItem("incomes", JSON.stringify(incomes));
    addNotification("Income Added Successfully 💰");
    incomeForm.reset();

    showIncome();
  });
}

function showIncome() {
  const tbody = document.getElementById("incomeTableBody");

  const totalIncome = document.getElementById("totalIncome");

  let incomes = JSON.parse(localStorage.getItem("incomes")) || [];

  tbody.innerHTML = "";

  let total = 0;

  incomes.forEach((income, index) => {
    total += income.amount;

    tbody.innerHTML += `

        <tr>

            <td>${income.source}</td>

            <td>₹${income.amount}</td>

            <td>${formatDate(income.date)}</td>
            <td>${income.description}</td>

          

<td>

<i class="ri-edit-line edit-icon"
onclick="editIncome(${index})"></i>

<i class="ri-delete-bin-6-line delete-icon"
onclick="deleteIncome(${index})"></i>

</td>
        </tr>

        `;
  });

  totalIncome.innerText = "₹" + total;
}

function deleteIncome(index) {
    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];

    incomes.splice(index, 1);

    localStorage.setItem("incomes", JSON.stringify(incomes));
    showIncome();
}




function editIncome(index){

let incomes=JSON.parse(localStorage.getItem("incomes"))||[];

document.getElementById("incomeSource").value=incomes[index].source;

document.getElementById("incomeAmount").value=incomes[index].amount;

document.getElementById("incomeDate").value=incomes[index].date;

document.getElementById("incomeDescription").value=incomes[index].description;

incomes.splice(index,1);

localStorage.setItem("incomes",JSON.stringify(incomes));

showIncome();

}


//----------
// for search in income
//----------


const searchIncome = document.getElementById("searchIncome");

if (searchIncome) {

    searchIncome.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("#incomeTableBody tr");

        rows.forEach(row => {

            const text = row.textContent.toLowerCase();

            if (text.includes(value)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

        });

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
