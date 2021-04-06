'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
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
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
const options2 = {
  style: 'currency',
  currency: 'USD',
};
const locale = navigator.language;
/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const day = `${date.getDate() + 1}`.padStart(2, 0);
  const month = `${date.getMonth()}`.padStart(2, 0);
  const year = date.getFullYear();
  const today = new Date();
  const dayspassed = calcDaysPassed(today, date);
  let dayspassedstr = ``;
  if (dayspassed === 0) {
    dayspassedstr = `Today`;
  } else if (dayspassed === 1) {
    dayspassedstr = `Yesterday`;
  } else if (dayspassed < 7) {
    dayspassedstr = `${dayspassed} days ago`;
  } else if (dayspassed >= 7 && dayspassed < 30) {
    dayspassedstr = `${Math.round(dayspassed / 7)} weeks ago`;
  } else if (dayspassed >= 30 && dayspassed < 365) {
    dayspassedstr = `${Math.round(dayspassed / 30)} months ago`;
  } else if (dayspassed >= 365) {
    dayspassedstr = `${Math.round(dayspassed / 365)} year ago`;
  }
  return `${day}/${month}/${year} - ${dayspassedstr}`;
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

let sort = false;
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  console.log(account.movements);
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    let date = new Date(account.movementsDates[i]);

    let formattedMov = formatCur(mov, locale, `USD`);
    const displayDate = formatMovementDate(date);

    const html = `  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    // console.log(html);
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
btnSort.addEventListener('click', function () {
  sort = sort ? false : true;
  displayMovements(currentAccount, sort);
});
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, cur) {
    return acc + cur;
  });
  labelBalance.textContent = `${formatCur(account.balance, locale, `USD`)} `;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${formatCur(incomes, locale, `USD`)}`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(out, locale, `USD`)}`;

  // labelSumIn.textContent = `${+incomes.toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatCur(interest, locale, `USD`)} `;
};

// const user = 'Steven Thomas Williams';
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
    // console.log(acc.username);
  });
};

createUsernames(accounts);
let currentAccount, timer;

////Fake always logged in
const startLogOutTimer = function () {
  // set the time to 5 mins
  let time = 100;
  const tick = function () {
    let minutes = Math.trunc(time / 60);
    let seconds = String(time % 60).padStart(0, 2);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to Get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  // call the timer evert seconds
  timer = setInterval(tick, 1000);
  // When timer 0 the user is log out

  return timer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(inputLoginUsername.value);
  currentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // console.log(`Login`);
    containerApp.style.opacity = 100;
    const now = new Date();

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    console.log(timer);
    if (timer) {
      clearInterval(timer);
      timer = startLogOutTimer();
    } else {
      timer = startLogOutTimer();
    }
    console.log(timer);
    updateUi(currentAccount);

    inputLoginPin.value = '';
    inputLoginUsername.value = '';
  }
});
function updateUi(currentAccount) {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  calcDisplayBalance(currentAccount);
}
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username != currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add Transaction date
    let TransactionDate = new Date();
    currentAccount.movementsDates.push(TransactionDate.toISOString());
    receiverAcc.movementsDates.push(TransactionDate.toISOString());

    //Update UI
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`Delete`);
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    currentAccount;
    console.log(`ARE YOU SURE YOU WANT TO DELETE ACCOUNT`);
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => mov >= 0.1 * loanAmount)) {
    //Dooing the loan
    console.log(`loan is approved`);
    currentAccount.movements.push(loanAmount);

    //adding Transaction date
    let TransactionDate = new Date();
    currentAccount.movementsDates.push(TransactionDate.toISOString());

    //updateUI
    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* console.log(23 === 23.0);

// base 10 - 0 to 9

//binary base 2 -0 1;

console.log(0.1 + 0.2);

//Conversion
console.log(Number(23));
console.log(+'23');

//Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

console.log(Number.isNaN(+20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Checking if value is number
console.log(Number.isFinite(+20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(20));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
 */
/////////////////////////////////////
// Math and rounding
/* console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.9));

//Rounding decimals

console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
 */

//////////////////////////////////
// The remainder operator

/* console.log(5 % 2);
console.log(5 / 2);

console.log(8 % 3);
console.log(8 / 3);

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orange';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 5);
console.log(5465745679852416547878465487845487n);
console.log(BigInt(4567821));

//operations

console.log(10000n + 10000n);
console.log(4564567842345467845345674874487878n + 74754574n);

const huge = 1234578563418741457454545n;
const num = 23;
console.log(huge * BigInt(num));

//exeptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is really big!!!');

// Dvisions

console.log(10n / 3n);
 */

/////////////////////////////////////
// Creating dates
/* 
const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24,2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142228180000));
console.log(Date.now());

future.setFullYear(2040);
console.log(future);
 */

/* const future = new Date(2037, 10, 19, 15, 23);

console.log(+future);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));

console.log(days1);
 */

/* const num = 3884764.23;

/* const options2 = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
}; 
console.log('US', new Intl.NumberFormat('en-US', options2).format(num));
console.log('Germmany', new Intl.NumberFormat('de-DE', options2).format(num));
console.log('Syria', new Intl.NumberFormat('sy-SY', options2).format(num));
 */
/* const ingrdients = [`olives`, ``];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingrdients
);
console.log(`waiting`);

if (ingrdients.includes('spinach')) clearTimeout(pizzaTimer);

setInterval(() => {
  const now = new Date();
  console.log(now);
}, 1000);
 */
