// ===== dark node =====
(function () {
  const html = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    html.setAttribute("data-theme", "dark");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    updateIcon();

    btn.addEventListener("click", () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      updateIcon();
    });

    function updateIcon() {
      btn.textContent = html.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
    }
  });
})();


function choose(sound){

let result=document.getElementById("result");


if(sound=="bass"){

result.innerHTML=
"You prefer: Bass ";

}


else if(sound=="balanced"){

result.innerHTML=
"You prefer: Balanced  ";

}


else{

result.innerHTML=
"You prefer: Clarity ";

}


}