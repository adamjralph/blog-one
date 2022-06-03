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

let input = document.getElementById('input-title')
// let result = document.getElementById('input-slug')
let result = document.getElementById('input-slug')

input.addEventListener('change', function () {
  let rawInput = this.value
  let slug = rawInput.split(' ').join('-')
  result.textContent = slug
  console.log(slug)
  // e.preventDefault()
})

// const input = document.querySelector('#input-title')
// const result = document.querySelector('#input-slug')

// const eventInput = new CustomEvent('inputTitle', {
//   bubbles: true,
//   datail: { text: () => result.value },
// })

// input.addEventListener('inputTitle', (e) => console.log(e.detail.text()))

// result.addEventListener('input', (e) => e.target.dispatchEvent(inputTitle))
