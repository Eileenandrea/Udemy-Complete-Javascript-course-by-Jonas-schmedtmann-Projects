'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = [...document.querySelectorAll('.btn--show-modal')];
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/* const btnScrollTo = document.querySelector('.btn--scroll-to');
;

//Button Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll(X/Y)', window.pageXOffset, pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
}); */
//////////////////////////////////////////////
//Page Navigation

/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); */

//1. add Event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  let clickeddatatab = clicked.dataset.tab;
  tabContents.forEach(tabC =>
    tabC.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickeddatatab}`)
    .classList.add(`operations__content--active`);
});

//Menu fade animation
function handlehover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sibs => {
      if (sibs !== link) {
        sibs.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handlehover.bind(0.5));
nav.addEventListener('mouseout', handlehover.bind(1));

//Sticky Navigation
/* window.onscroll = function () {
  const initialCoord = section1.getBoundingClientRect();
  if (window.scrollY > initialCoord.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
 */
//Sticky naviation: Intersection Observer API

/* const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
    console.log(entry.isIntersecting);
    if (entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
};
const obsOptions = {
  root: null,
  threshold: [0.1, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);

observer.observe(section1);

 */
const stickyNav = function (entries, Observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});

headerObserver.observe(header);

//reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  else {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////
//Lazy loading images

const imgTarget = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, obserer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    lazyObserver.unobserve(entry.target);
  });
};
const lazyObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(function (lazyimage) {
  lazyObserver.observe(lazyimage);
});

//Slider

const slides = [...document.querySelectorAll('.slide')];
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
console.log(slider);

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDots = function (slide) {
  const allDots = document.querySelectorAll('.dots__dot');
  allDots.forEach(dot => dot.classList.remove('dots__dot--active'));
  console.log(slide);
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const gotoslide = function (slide) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
  activateDots(slide);
};
dotContainer.addEventListener('click', function (e) {
  console.log(e.target);
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    curSlide = Number(slide);
    gotoslide(curSlide);
  }
});

gotoslide(0);
let curSlide = 0;
const maxSlide = slides.length;

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  gotoslide(curSlide);
};
const prevSlide = function () {
  if (curSlide >= 0) {
    curSlide = 2;
  } else {
    curSlide--;
  }

  gotoslide(curSlide);
};
btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener(`click`, nextSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});
//Scrolling
/*   window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  ); */

/*   window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
/* console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });
 */
///////////////////////////////////////////////////////////////
// Styles,Atribute and Classes
//Creating and inserting elements
// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
/* 
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message); */
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);
/* 
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

message.style.backgroundColor = '#37383d';
message.style.width = `12%0`;

console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseInt(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');
 */
//Attributes
/* const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

//non standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');

console.log(link.href);

const link2 = document.querySelector('.nav__link--btn');
console.log(link2.href);
console.log(link2.getAttribute('href'));

//Data Attribute

console.log(logo.dataset.versionNumber);

//Classess

logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');
 */
//dont use
/* 
logo.className = 'jonas '*/
//////////////////////////////////////////////////////
//Event Propagation in Practice

/* const alertH1 = function (e) {
  alert('addEventListener:Great! You are reading the heading');
  h1.removeEventListener('mouseenter', alertH1);
};
const h1 = document.querySelector('h1');

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
h1.addEventListener('mouseenter', alertH1); */
/* h1.addEventListener('mouseenter', function (e) {
  alert('addEventListener:Great! You are reading the heading');
});
 */
/* h1.onmouseenter = function (e) {
  alert('addEventListener:Great! You are reading the heading');
}; */

/* const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log(`LINK`, e.target, e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log(`container`, e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log(`nav`, e.target, e.currentTarget);
});
 */
/////////////////////////////////////////////
// DOM Traversing
/* const h1 = document.querySelector('h1');

console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going Upwards: parents

console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways: siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
h1.nextElementSibling.style.background = 'white';

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
 */
