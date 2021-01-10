//SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const expenseTotalEl = document.querySelector(".expense-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

//SELECT TABS
const expenseTab = document.querySelector(".tab1");
const incomeTab = document.querySelector(".tab2");
const allTab = document.querySelector(".tab3");

//INPUT BUTTON EXPENSE
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

//INPUT BUTTON INCOME
const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

//VARIABLES
let entry_List;
let balance = 0, income = 0, expense = 0;
const DELETE = "delete", EDIT = "edit";

//CHECK IF THERE IS ANY SAVED DATA IN LOCAL STORAGE OR NOT
entry_List = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUi();

//EVENT LISTENERS
//TOGGLING BETWEEN TABS
expenseTab.addEventListener("click", function(){
    show(expenseEl);
    hide([incomeEl, allEl]);
    activeEL(expenseTab);
    inactiveEl([incomeTab, allTab]);
});
incomeTab.addEventListener("click", function(){
    show(incomeEl);
    hide([expenseEl, allEl]);
    activeEL(incomeTab);
    inactiveEl([expenseTab, allTab]);
});
allTab.addEventListener("click", function(){
    show(allEl);
    hide([incomeEl, expenseEl]);
    activeEL(allTab);
    inactiveEl([incomeTab, expenseTab]);
});

addExpense.addEventListener("click", function(){
    //IF ONE OF THE INPUT IS EMPTY => EXIT
    if(!expenseTitle.value || !expenseAmount.value){
        return;
    }

    //SAVE THE ENTRY TO ENTRY LIST
    let expense = {
        type: "expense",
        title: expenseTitle.value,
        amount: parseInt(expenseAmount.value)
    }
    entry_List.push(expense);

    updateUi();
    clearInput([expenseTitle, expenseAmount]);
})

addIncome.addEventListener("click", function(){
    //IF ONE OF THE INPUT IS EMPTY => EXIT
    if(!incomeTitle.value || !incomeAmount.value){
        return;
    }

    //SAVE THE ENTRY TO ENTRY LIST
    let income = {
        type: "income",
        title: incomeTitle.value,
        amount: parseInt(incomeAmount.value)
    }
    entry_List.push(income);

    updateUi();
    clearInput([incomeTitle, incomeAmount]);
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

//FUNCTIONS
function show(element){
    element.classList.remove("hide");
}

function hide(elements){
    elements.forEach(element => {
        element.classList.add("hide");
    });
}

function activeEL(element){
    element.classList.add("active");
}

function inactiveEl(elements){
    elements.forEach(element => {
        element.classList.remove("active");
    });
}

function updateUi(){
    income = calculateTotal("income", entry_List);
    expense = calculateTotal("expense", entry_List);
    balance = Math.abs(calculateBalance(income, expense));

    //DETERMINE SIGN OF BALANCE
    let sign = (income >= expense) ? "$" : "-$"; 

    //
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    incomeTotalEl.innerHTML = `<small>${sign}</small>${income}`;
    expenseTotalEl.innerHTML = `<small>${sign}</small>${expense}`;

    clearElement([expenseList, incomeList, allList]);

    entry_List.forEach((entry, index) => {
        if(entry.type == "expense"){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index);
        }else if(entry.type == "income"){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index);
    });

    //UPDATE CHART AFTER NEW ENTRY
    updateChart(income, expense);

    //SAVE LIST DATA IN LOCAL STORAGE
    localStorage.setItem("entry_list", JSON.stringify(entry_List));
}

function showEntry(list, type, title, amount, id){
    const entry = `<li id = ${id} class = "${type}">
                        <div class = "entry">${title} : $${amount}</div>
                        <div id = "edit"></div>
                        <div id = "delete"></div>
    </li>`;

    
    //ADD EVERY NEW ITEM IN THE TOP OF THE LIST
    const position = "afterbegin";
    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach(element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach(entry => {
        if(entry.type == type){
            sum += entry.amount;
        }
    });
    return sum;
}

function calculateBalance(income, expense){
    return income - expense;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    });
}

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if(targetBtn.id == DELETE){
        deleteEntry(entry);
    }
    else if(targetBtn.id == EDIT){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    entry_List.splice(entry.id, 1);

    updateUi();
}

function editEntry(oldEntry){
    let newEntry = entry_List[oldEntry.id];

    if(newEntry.type == "income"){
        incomeAmount.value = newEntry.amount;
        incomeTitle.value = newEntry.title;
    }
    else if(newEntry.type == "expense"){
        expenseAmount.value = newEntry.amount;
        expenseTitle.value = newEntry.title;
    }
    
    deleteEntry(oldEntry);
}
