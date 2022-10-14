let searchBar = document.querySelector("#search-bar");

searchBar.addEventListener("focus", (event) => {
  document.querySelector(".search-bar").style.border = "1px solid #2E65F3";
});

searchBar.addEventListener("blur", (event) => {
  document.querySelector(".search-bar").style.border = "1px solid #e0e2e7";
});
