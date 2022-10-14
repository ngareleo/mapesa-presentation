/*
    Check the data first
*/

let usernameInput = document.getElementById('username-field')
let usernameInfo = document.getElementById('username-field-info')

let passwordInput = document.getElementById('password-field')
let passwordInfo = document.getElementById('password-field-info')

let udClean = false,
  pdClean = false

usernameInput.addEventListener('input', (el) => {
  //remove all handlers
  usernameInfo.classList.remove('empty')
  usernameInfo.classList.remove('error')
  usernameInfo.classList.remove('clean')
  udClean = false
  let uName = el.target.value

  if (uName.length == 0) {
    usernameInfo.classList.add('empty')
  } else if (uName.length < 4) {
    usernameInfo.classList.add('error')
  } else {
    usernameInfo.classList.add('clean')
    udClean = true
  }
  checkLoginButton()
})

passwordInput.addEventListener('input', (el) => {
  //remove all handlers
  passwordInfo.classList.remove('empty')
  passwordInfo.classList.remove('error')
  passwordInfo.classList.remove('clean')
  pdClean = false

  let uName = el.target.value

  if (uName.length == 0) {
    passwordInfo.classList.add('empty')
  } else if (uName.length < 4) {
    passwordInfo.classList.add('error')
  } else {
    passwordInfo.classList.add('clean')
    pdClean = true
  }
  checkLoginButton()
})

let checkLoginButton = () => {
  if (pdClean === true && udClean === true) {
    document.getElementById('login-button').disabled = false
  }
}
