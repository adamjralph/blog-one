let prevScrollpos = window.scrollY;
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById('main-nav').style.top = 0;
  } else {
    document.getElementById('main-nav').style.top = '-100px';
  }
  prevScrollpos = currentScrollPos;
};
