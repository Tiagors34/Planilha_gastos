document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseTable = document.getElementById("expenseTable");
    const totalValueElement = document.getElementById("totalValue");
    const incomeInput = document.getElementById("monthlyIncome");
    const incomeDisplay = document.getElementById("incomeDisplay");
    const balanceDisplay = document.getElementById("balanceDisplay");
    const clearExpensesBtn = document.getElementById("clearExpenses"); // Botão opcional para limpar tudo

    loadIncome();
    loadExpenses();

    incomeInput.addEventListener("change", () => {
        let income = parseFloat(incomeInput.value) || 0;
        if (income < 0) {
            alert("A renda não pode ser negativa!");
            income = 0;
            incomeInput.value = 0;
        }
        localStorage.setItem("monthlyIncome", income);
        updateBalance();
    });

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;
        const amount = Number(parseFloat(document.getElementById("amount").value.replace(",", ".")));
        const payment = document.getElementById("payment").value;
        const category = document.getElementById("category").value;

        if (!date || !description || isNaN(amount) || amount <= 0 || !payment || !category) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        const expense = { id: Date.now(), date, description, amount, category, payment };
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        refreshTable();
        expenseForm.reset();
    });

    function loadIncome() {
        const income = parseFloat(localStorage.getItem("monthlyIncome")) || 0;
        incomeInput.value = income;
        updateBalance();
    }

    function loadExpenses() {
        refreshTable();
    }

    function refreshTable() {
        expenseTable.innerHTML = "";
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        expenses.forEach(expense => appendRow(expense));
        updateTotal();
    }

    function appendRow(expense) {
        const row = document.createElement("tr");
        row.classList.add("border-b");

        row.innerHTML = `
            <td class="p-3">${expense.date}</td>
            <td class="p-3">${expense.description}</td>
            <td class="p-3 text-red-600">${formatCurrency(expense.amount)}</td>
            <td class="p-3">${expense.category}</td>
            <td class="p-3">${expense.payment}</td>
            <td class="p-3 flex gap-2">
                <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">
                    Excluir
                </button>
            </td>
        `;

        row.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Tem certeza que deseja excluir este gasto?")) {
                deleteExpense(expense.id);
                row.classList.add("scale-0", "transition", "duration-300");
                setTimeout(() => row.remove(), 300);
            }
        });

        expenseTable.appendChild(row);
    }

    function deleteExpense(id) {
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses = expenses.filter(e => e.id !== id);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateTotal();
    }

    function updateTotal() {
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2);
        totalValueElement.textContent = formatCurrency(total);
        updateBalance();
    }

    function updateBalance() {
        const income = parseFloat(localStorage.getItem("monthlyIncome")) || 0;
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        const balance = income - totalExpenses;

        incomeDisplay.textContent = formatCurrency(income);
        balanceDisplay.textContent = formatCurrency(balance);
        balanceDisplay.classList.toggle("text-green-600", balance >= 0);
        balanceDisplay.classList.toggle("text-red-600", balance < 0);
    }
    function appendRow(expense) {
        const row = document.createElement("tr");
        row.classList.add("border-b");
    
        row.innerHTML = `
            <td class="p-3">${expense.date}</td>
            <td class="p-3">${expense.description}</td>
            <td class="p-3 text-red-600">${formatCurrency(expense.amount)}</td>
            <td class="p-3">${expense.category}</td>
            <td class="p-3">${expense.payment}</td>
            <td class="p-3 flex gap-2">
                <button class="edit-btn bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">
                    Editar
                </button>
                <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">
                    Excluir
                </button>
            </td>
        `;
    
        // Evento para deletar a despesa
        row.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Tem certeza que deseja excluir este gasto?")) {
                deleteExpense(expense.id);
                row.classList.add("scale-0", "transition", "duration-300");
                setTimeout(() => row.remove(), 300);
            }
        });
    
        // Evento para editar a despesa
        row.querySelector(".edit-btn").addEventListener("click", () => {
            editExpense(expense);
        });
    
        expenseTable.appendChild(row);
    }
    
    // Função para editar um gasto
    function editExpense(expense) {
        // Preencher os campos do formulário com os dados existentes
        document.getElementById("date").value = expense.date;
        document.getElementById("description").value = expense.description;
        document.getElementById("amount").value = expense.amount;
        document.getElementById("payment").value = expense.payment;
        document.getElementById("category").value = expense.category;
    
        // Remover o gasto antigo do localStorage
        deleteExpense(expense.id);
    
        // Ao enviar o formulário novamente, ele salvará como um novo item atualizado
    }
    

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }    

    // Botão para limpar todas as despesas
    if (clearExpensesBtn) {
        clearExpensesBtn.addEventListener("click", () => {
            if (confirm("Deseja realmente apagar todos os gastos?")) {
                localStorage.removeItem("expenses");
                refreshTable();
            }
        });
    }
});



