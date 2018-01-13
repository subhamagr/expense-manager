(function() {

  function showAccountBalances(accounts) {
    const accountsTableBody = document.querySelector(".charts__accounts tbody");
    accountsTableBody.innerHTML = "";

    Object.keys(accounts).sort().forEach(account => {
      accountsTableBody.appendChild(
        window.expenseManager.utils.createTR([
          { value: account, className: "mdl-data-table__cell--non-numeric" },
          { value: accounts[account] }
        ])
      )
    })
  }

  function getMonthlyExpense(expenses, category) {
    const today = new Date();
    const data = {
      labels: [],
      expense: [],
    };
    const indexDate = new Date();
    indexDate.setMonth(today.getMonth() - 11);

    for (let i = 0; i < 12; i++) {
      let monthlyExpense = 0;
      const indexMonth = indexDate.getMonth();
      const indexYear = indexDate.getFullYear();
      expenses.forEach(expense => {
        const expenseDate = expense[0];
        const expenseCategory = expense[3];
        const isTransfer = expense[6];
        const amount = expense[4];
        if (!isTransfer) {
          const expenseMonth = expenseDate.getMonth();
          const expenseYear = expenseDate.getFullYear();

          if (expenseMonth === indexMonth && expenseYear === indexYear) {
            if (category) {
              if (expenseCategory === category) {
                monthlyExpense += amount;
              }
            } else {
              monthlyExpense += amount;
            }
          }
        }
      })

      if (monthlyExpense) {
        data.labels.push(`${indexMonth + 1} - ${indexYear}`);
        data.expense.push(monthlyExpense.toFixed(2));
      }

      indexDate.setMonth(indexDate.getMonth() + 1);
    }

    return data;
  }

  function ployMontlyExpenseChart(categories, allExpenses) {
    const ctx = document.querySelector(".charts__overview canvas").getContext('2d');
    const data = getMonthlyExpense(allExpenses);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.expense,
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false,
        }
      }
    });

  }

  function init(accounts, categories, allExpenses) {
    showAccountBalances(accounts);
    ployMontlyExpenseChart(categories, allExpenses);
  }

  window.expenseManager.plotHighlevelCharts = {
    init
  }
})();