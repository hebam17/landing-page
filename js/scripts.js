// GET ELEMENTS

const carousel = document.getElementsByClassName("carousel")[0];
const carouselItems = carousel.getElementsByClassName("carousel-item");

const carouselDots = document.getElementsByClassName("carousel-dots")[0];

const mobileNav = document.getElementsByClassName("mobile-nav")[0];

const deskNav = document.getElementsByClassName("desk-nav")[0];

const navOpen = document.getElementsByClassName("menu-bar")[0];

const navClose = document.getElementsByClassName("menu-close")[0];

const sections = document.getElementsByClassName("section");

const toTopBtn = document.getElementsByClassName("toTop")[0];

// create links function
((e) => {
  //  create a fragment and ul for mobile navbar
  const mobileFragment = document.createDocumentFragment();
  const mobileLinksContainer = document.createElement("ul");
  mobileLinksContainer.classList.add("mobile-nav-container");

  //  create a fragment and ul for desktop navbar
  const deskFragment = document.createDocumentFragment();
  const deskLinksContainer = document.createElement("ul");
  deskLinksContainer.classList.add("desk-nav-container");

  // create the links dynamically and append it to the ul created above and then add it to the fragment and push the fragment to the nav element in the html

  // for mobile
  for (let section of sections) {
    mobileLinksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class='mobile-nav-item text-xbig '>
    <a href='#${section.id}'>${section.dataset.nav}</a>
  </li>`
    );
    mobileFragment.appendChild(mobileLinksContainer);
    mobileNav.appendChild(mobileFragment);
  }

  // for desktop
  for (let section of sections) {
    deskLinksContainer.insertAdjacentHTML(
      "beforeend",
      `<li class='desk-nav-item text-xbig '>
    <a href='#${section.id}'>${section.dataset.nav}</a>
  </li>`
    );
    deskFragment.appendChild(deskLinksContainer);
    deskNav.appendChild(deskFragment);
  }
})();

// get this after creating them
const deskLinks = document.getElementsByClassName("desk-nav-item");
const mobileLinks = document.getElementsByClassName("mobile-nav-item");

const mobileNavContainer = document.getElementsByClassName(
  "mobile-nav-container"
)[0];

const deskNavContainer =
  document.getElementsByClassName("desk-nav-container")[0];

// CREATE THE slides
let interval;
// handle the automatic header by change the active carousel item / dot repeatedly
const takeTurns = () => {
  for (item of carouselItems) {
    if (!item.classList.contains("image-wait")) {
      item.classList.add("image-wait");
    } else {
      item.classList.remove("image-wait");
    }
  }
  for (dot of carouselDots.children) {
    dot.classList.contains("dot-active")
      ? dot.classList.remove("dot-active")
      : dot.classList.add("dot-active");
  }
};

// the click handler which change the active carousel item / dot by clickin dots
const slide = (e) => {
  // a dot was clicked
  clearInterval(interval);
  let imageData = e.target.dataset.image;
  for (item of carouselItems) {
    if (item.id === imageData && !item.classList.contains("image-wait")) {
      item.classList.add("image-wait");
    } else if (item.id !== imageData && item.classList.contains("image-wait")) {
      item.classList.remove("image-wait");
    }
  }
  for (dot of carouselDots.children) {
    dot === e.target
      ? dot.classList.add("dot-active")
      : dot.classList.remove("dot-active");
  }

  // the function run without interaption
  interval = setInterval(() => {
    takeTurns();
  }, 4000);
};

// start the slider
interval = setInterval(() => {
  takeTurns();
}, 4000);

// scrollnav handle function
const scrollNav = () => {
  let scroll = window.scrollY;
  if (scroll > 0) {
    deskNav.classList.add("scrolled-nav");
    navOpen.querySelector("div img").src = "./images/bars-solid-black.svg";
  } else {
    deskNav.classList.remove("scrolled-nav");
    navOpen.querySelector("div img").src = "./images/bars-solid.svg";
  }
};

const toTopBtnHandler = () => {
  // to make the to top button appear after scroll more than viewport height
  if (window.scrollY > 300) {
    toTopBtn.style.display = "inline-block";
  } else {
    toTopBtn.style.display = "none";
  }
};

const activeSectionsAndLinks = () => {
  // holds all sections that passed the views screen, put empty placeholder to pass the empty check below
  let current = [""];
  for (let section of sections) {
    const rect = section.getBoundingClientRect();
    if (
      rect.top < window.innerHeight * 0.75 ||
      rect.bottom < window.innerHeight
    ) {
      current.push(section.id);
    }
  }

  // the current active section id
  let currentActive = current[current.length - 1];

  // add the active class to the current active section
  for (let section of sections) {
    if (section.id === currentActive) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  }

  // search throught the desk/mobile links to add active class to the one that corresponse to the current viewd section
  if (current.length > 0) {
    if (mobileNav.classList.contains("open-mobile-nav")) {
      for (mobLink of mobileLinks) {
        if (mobLink.firstElementChild.hash === `#${currentActive}`) {
          mobLink.classList.add("active-nav-item");
        } else {
          mobLink.classList.remove("active-nav-item");
        }
      }
    }
    for (let deskLink of deskLinks) {
      if (deskLink.firstElementChild.hash === `#${currentActive}`) {
        deskLink.classList.add("active-nav-item");
      } else {
        deskLink.classList.remove("active-nav-item");
      }
    }
  }
};

// make the navbar disappear when not scroll for 5 second
let disappear;
const hideNav = () => {
  clearTimeout(disappear);
  deskNav.style.transform = "translateY(0)";

  disappear = setTimeout(() => {
    if (!mobileNav.classList.contains("open-mobile-nav")) {
      deskNav.style.transform = "translateY(-6rem)";
    }
  }, 5000);
};

// handle the chandes that happen when scrolling
const handleScroll = (e) => {
  // to change the desk navbar when scrooling
  scrollNav();

  // to top button handler
  // to make the to top button appear after scroll more than viewport height
  toTopBtnHandler();

  // handle the links and sections activation
  activeSectionsAndLinks();

  // make the navbar disappear when not scroll for 5 second
  hideNav();
};

// scroll to section when clicking the corresponding link
const scrollToSection = (e) => {
  if (e.target.nodeName === "A") {
    e.preventDefault();
    for (section of sections) {
      if (`#${section.id}` === e.target.hash) {
        section.scrollIntoView();
      }
    }
  }
};

// open side nav
const openSideNav = () => {
  mobileNav.classList.add("open-mobile-nav");
};

// close the side nam
const closeSideNav = () => {
  mobileNav.classList.remove("open-mobile-nav");
};

// ////////// EVENT LISTENERS ///////////
// window.addEventListener("load", createLinks);

//  Add click listeners to the dots
carouselDots.addEventListener("click", slide);

// open and close the mobile nav
navOpen.addEventListener("click", openSideNav);

navClose.addEventListener("click", closeSideNav);

// add a class to the nav when scrooling

window.addEventListener("scroll", handleScroll);

deskNavContainer.addEventListener("click", scrollToSection);
