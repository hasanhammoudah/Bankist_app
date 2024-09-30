'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovmentDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);



}

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

};


const displayMovements = function (acc, sort = false) {
  //TODO what means innerHTML?
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovmentDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    //TODO what is different afterbegin and beforebegin?
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}



const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const formattedMov = formatCur(incomes, acc.locale, acc.currency);

  labelSumIn.textContent = `${formattedMov}`;
  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements.filter(mov => mov > 0).map
    (deposit => deposit * acc.interestRate / 100).
    filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    }).
    reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);



}
// console.log(containerMovements.innerHTML);
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name =>
      name[0]).join('');
  })

}

createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movments
  displayMovements(acc);

  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI

    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Descrese 1s
    time--;
  };

  // Set time to 5 minutes

  let time = 120;


  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;


}



//Event handler
let currentAccount, timer;
// Fake always LoggedIn
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API


btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  //console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);


    // console.log('LOGIN');

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, receiverAcc);
  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Reset timer

    clearInterval(timer);
    timer = startLogOutTimer();


  }

});


btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add Movment
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
      // Reset timer

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);


  };
  inputLoanAmount.value = '';


});



btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // Dlete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = '';


});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


const eurToUsd = 1.1;
const movementsUSD = movements.map(mov =>
  mov * eurToUsd
);

// console.log(movements);
// console.log(movementsUSD);

// const movmentsUSDFor = [];
// for (const mov of movements) {
//   movmentsUSDFor.push(mov * eurToUsd);
// }
// console.log(movmentsUSDFor);



// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// const despositeFor = [];
// for (const mov of movements) if (mov > 0) despositeFor.push(mov);
// console.log(despositeFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// const balance = movements.reduce((acc, cur,) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov)
//     return acc;
//   else
//     return mov;
// }, movements[0]);

// console.log(max);

// // const eurToUsd = 1.1;
// const totalDepositeUSD = movements.filter(mov => mov > 0).
//   map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUsd;
//   }).
//   // map(mov => mov * eurToUsd).
//   reduce((acc, mov) => acc + mov, 0,
//   );
// console.log(totalDepositeUSD);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
// console.log('---------------');

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);


// console.log(movements);
// //Equlaity
// console.log(movements.includes(-130));

// //Condition
// console.log(movements.some(mov => mov > 1500));


// const anyDeposites = movements.some(mov => mov > 0);
// console.log(anyDeposites);


// //Every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));


// //Separate callback
// const deposite = mov => mov > 0;
// console.log(movements.some(deposite));
// console.log(movements.every(deposite));
// console.log(movements.filter(deposite));


// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));






/////////////////////////////////////////////////
