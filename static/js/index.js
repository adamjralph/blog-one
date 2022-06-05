let prevScrollpos = window.scrollY
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset
  if (prevScrollpos > currentScrollPos) {
    document.getElementById('main-nav').style.top = 0
  } else {
    document.getElementById('main-nav').style.top = '-100px'
  }
  prevScrollpos = currentScrollPos
}

// let input = document.getElementById('input-title')
// let result = document.getElementById('input-slug')

// input.addEventListener('change', function () {
//   let rawInput = this.value
//   let slug = rawInput.split(' ').join('-')
//   result.textContent = slug
//   console.log(slug)
// })
