///////////////////////
// NOTES & TAKEAWAYS //
///////////////////////

// 1. remember that maniulating your data and changing your UI should be treated as different things that commmunicate

// 2. always consider DRY principle by consolodating data and finding ways to not repeat functions

// 3. create 'DOM string' object so we only have to change the class or ID once if the UI html changes for any reason

//  4. when the user will be creating objects that display on the UI, create a template in the JS, and have it injected into the UI with input data as needed. //#endregion

// 5. -1 = not defined. 

// 6. good practice to make functions for each task no matter how small. 

// ---------------------------------------
// EXAMPLES OF METHODS AND FUNCTIONS USED: 
// ---------------------------------------
// Function Constructors ** 1 **
// creating new Objects ** 2 **
// forEach loop ** 3 **
// push data into an array ** 4 **
// array map 
// array indexOf 
// array splice 
// calculate Percentage 
// storing 'DOM strings' in an object 
// creating a data structure 
// storing input data in a function 
// DOM Manipulation: Inserting HTML 
// Replace method 
// DOM Manipulation: Remove Child 
// Slice method 
// Click EventListener  
// Keypress EventListener 
// Target & ParentNode 
// inIt function 
// used Callback function to loop list items 
// used ABS method to add decimals to a number
// used TOFIXED method to limit decimal point to 2 spaces
// used SUBSTR to capture parts of our string and arrange them around another part of the string.. in this case, we inserted ',' in the middle of numbers to format thousands
// use the DATE OBJECT constructor
// Class Toggle to add and remove class based on selection

/////////////////////////////
// BUDGET CONTROLLER
/////////////////////////////

var budgetController = (function() {

    // ** 1 ** //
    // FUNCTION CONSTRUCTOR that creates new Expense Object
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // Object prototype to apply this function to every instance of an expense and
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };

    // Object prototype returning percentage after calculated by calcPercentage 
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    // FUNCTION CONTRUCTOR that creates new Income Object
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // DATA STRUCTURE is our storage for all the input data we will need and be using
    var data = {

        // exp and inc will be stored as objects by ID number
        allItems: {
            exp: [],
            inc: []
        },

        // provides totals of all expenses and incomes
        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1

    };

    var calculateTotal = function(type) {

        // ** 2 ** //
        // FOR EACH is a method of looping arrays and repeating the same function to all items
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;

    };


    // *****
    // *****
    // *****
    return {

        // creates a new item with input using function constructors
        addItem: function(type, des, val) {

            var newItem, ID;

            // create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item
            if (type === 'exp') {
                // ** 2 ** //
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // ** 4 ** //
            // then add to data structure
            data.allItems[type].push(newItem);

            // return newly created item
            return newItem;
        },

        deleteItem: function(type, id) {

            var ids, index;

            // .map creates a new array with the results of calling a provided function on every element in the calling array. in this example, 'current' will automatically be each item in the arr 'data.allItems' 

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // indexOf give us an index number of a defined item in an array
            index = ids.indexOf(id);

            // SPLICE METHOD is used to remove elements from an array
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };

        },

        // Calculates all 
        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // CALCULATE the BUDGET: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // CALCULATE the PERCENTAGE of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },


        // **3** //
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(current) {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }

    };
})();

/////////////////////////////
// UI CONTROLLER
/////////////////////////////

var UIController = (function() {

    // dictates classes pulled from HTML and how they are called in script
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        deleteBtn: 'item__delete--btn',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLable: '.budget__title--month'
    };

    var formatNumber = function(num, type) {

        var numSplit, dec, int;

        /**
         * if a number is greater than 999, add ',' to format thousands
         * 
         * add + or - before income and expense items
         * 
         * show exactly two decimal points
         */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        type = (type === 'exp' ? sign = '-' : sign = '+');

        return type + ' $' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // *******
    // *******
    // *******
    return {

        // getInput function retrieves the user input and gives us a door to HTML values
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        // adds HTML item to UI list
        addListItem: function(obj, type) {

            var html, newHTML, element;

            // create HTML with placeholders

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">item__percentage</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholders with input data

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            // insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);

        },

        // updates budget display
        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalsInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalsExp, 'exp');

            if (obj.totalsInc > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function() {

            var now, year, month, months;

            now = new Date();

            months = ['January', 'February', 'Mar', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;

        },


        // Clears input fields after added to list
        clearFields: function() {
            var fields;

            // selects all fields we want to clear
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // turns the collected list of classes into an array
            fieldsArr = Array.prototype.slice.call(fields);

            // each item in the array will change value to ""
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            // Puts the user focus back on the description field
            fieldsArr[0].focus();

        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(curr) {
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },

        // gives other modules access to our class library called 'DOMstrings'
        getDOMstrings: function() {
            return DOMstrings;
        }

    };
})();

/////////////////////////////
// GLOBAL APP CONTROLLER
/////////////////////////////

var controller = (function(budgetCtrl, UICtrl) {

    // sets up listeners for UI actions
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    // calcs budget and updates UI budgeet display
    var updateBudget = function() {

        // calculate budget
        budgetCtrl.calculateBudget();

        // returns the budget
        var budget = budgetCtrl.getBudget();

        // update displayed budget
        UICtrl.displayBudget(budget);

    };

    // updates percentages in individual expenses
    var updatePercentages = function() {

        // calcuate percentages
        budgetCtrl.calculatePercentages();
        // read from budget controller
        var percentages = budgetCtrl.getPercentages();
        // update UI items
        UICtrl.displayPercentages(percentages);
    };

    // adds item to list
    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget module
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3 add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clears input fields
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentages();
        }
    };

    // Deletes list item from expense OR income

    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // inc-1   ___ need a way to split this up to target just the number
            // All strings have access to the 'split' method
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. remove item from UI list
            UICtrl.deleteListItem(itemID);
            // 3. update the budget?
            updateBudget();
            // 4. update percentages
            updatePercentages();
        }

        // console.log(itemID);
    };

    // *****
    // *****
    // *****
    // returns init function to run app
    return {
        init: function() {
            console.log('The App Is Running');
            UICtrl.displayBudget({
                budget: 0,
                totalsInc: 0,
                totalsExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    };

})(budgetController, UIController);


// initializes the application upon load through controller module return IIFE
controller.init();