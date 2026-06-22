/* =========================
   MENU HAMBURGUESA
========================= */

function menu(trigger){

  trigger.addEventListener("click", () => {

    const target = trigger.dataset.target
    const menu = document.querySelector(target)

    if(menu){
      menu.classList.toggle("active")
    }

  })

}


/* =========================
   MODAL
========================= */
function modal(trigger){

  trigger.addEventListener("click", () => {

    const target = trigger.dataset.target;
    const modal = document.querySelector(target);

    if(modal){
      modal.classList.add("show");
    }

  });

}


/* =========================
   COMPONENTES
========================= */

const components = {
  modal: modal,
  menu: menu
};


/* =========================
   CORE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const triggers = document.querySelectorAll("[data-toggle]");

  triggers.forEach(el => {

    const component = el.dataset.toggle;

    if(components[component]){
      components[component](el);
    }

  });

});


/* =========================
   CERRAR MODAL
========================= */

document.addEventListener("click", (e) => {

  if(e.target.classList.contains("modal-close")){
    e.target.closest(".modal").classList.remove("show");
  }

});

/* =========================
    SCROLL HEADER
========================= */

window.addEventListener("scroll", function ()  {
  const header = document.querySelector("nav");
  if(window.scrollY > 50){
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* =========================
    tOOLTIPS
========================= */
document.querySelectorAll("[data-tooltip]").forEach(el => {

  el.addEventListener("mouseenter", () => {

    const text = el.getAttribute("data-tooltip");

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-box";
    tooltip.innerText = text;

    document.body.appendChild(tooltip);

    const rect = el.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.top = rect.top - tooltipRect.height - 8 + window.scrollY + "px";

    tooltip.style.left =
      rect.left +
      rect.width / 2 -
      tooltipRect.width / 2 +
      window.scrollX +
      "px";

    setTimeout(() => tooltip.classList.add("tooltip-show"), 10);

    el.addEventListener("mouseleave", () => {
      tooltip.remove();
    }, { once: true });

  });

});


/* =========================
    DROPDOWN
========================= */

document.querySelectorAll(".dropdown").forEach(dropdown => {

  const toggle = dropdown.querySelector(".dropdown-toggle");

  if(toggle){
    toggle.addEventListener("click", () => {
      dropdown.classList.toggle("active");
    });
  }

});
/* =========================
    CAROUSEL
========================= */
document.querySelectorAll("[data-air-carousel]").forEach(carousel => {

  const inner = carousel.querySelector(".air-carousel-inner");
  const nextBtn = carousel.querySelector("[data-air-next]");
  const prevBtn = carousel.querySelector("[data-air-prev]");
  const indicatorsContainer = carousel.querySelector("[data-air-indicators]");

  let slides = carousel.querySelectorAll(".air-slide");

  // Ensure we have at least 2 slides for the infinite loop logic.
  // If not, avoid running carousel logic that assumes clones exist.
  if (slides.length < 2) {
    return;
  }

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  inner.appendChild(firstClone);
  inner.prepend(lastClone);

  slides = carousel.querySelectorAll(".air-slide");

  let index = 1;

  inner.style.transform = `translateX(-100%)`;

  function update(){
    inner.style.transition = "transform .5s ease";
    inner.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function nextSlide(){
    index++;
    update();
  }

  function prevSlide(){
    index--;
    update();
  }

  /* BOTONES */

  if(nextBtn){
    nextBtn.addEventListener("click", nextSlide);
  }

  if(prevBtn){
    prevBtn.addEventListener("click", prevSlide);
  }

  /* INDICADORES */

  if(indicatorsContainer){

    for(let i = 0; i < slides.length - 2; i++){

      const dot = document.createElement("button");
      dot.classList.add("air-dot");

      dot.addEventListener("click", () => {
        index = i + 1;
        update();
      });

      indicatorsContainer.appendChild(dot);
    }

  }

  function updateDots(){

    const dots = carousel.querySelectorAll(".air-dot");

    dots.forEach(dot => dot.classList.remove("active"));

    let activeIndex = index - 1;

    if(activeIndex >= dots.length){
      activeIndex = 0;
    }

    if(activeIndex < 0){
      activeIndex = dots.length - 1;
    }

    if(dots[activeIndex]){
      dots[activeIndex].classList.add("active");
    }

  }

  updateDots();

  /* AUTOPLAY */

  let autoplay = setInterval(nextSlide, 4000);

  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoplay);
  });

  carousel.addEventListener("mouseleave", () => {
    clearInterval(autoplay);
    autoplay = setInterval(nextSlide, 4000);
  });

  /* SWIPE MOVIL */

  let startX = 0;

  carousel.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", e => {

    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if(diff > 50){
      nextSlide();
    }

    if(diff < -50){
      prevSlide();
    }

  });

  /* LOOP INFINITO */

  inner.addEventListener("transitionend", () => {

    if(index === slides.length - 1){
      inner.style.transition = "none";
      inner.offsetHeight; // force reflow so the jump is immediate
      index = 1;
      inner.style.transform = `translateX(-100%)`;
    }

    if(index === 0){
      inner.style.transition = "none";
      inner.offsetHeight; // force reflow so the jump is immediate
      index = slides.length - 2;
      inner.style.transform = `translateX(-${index * 100}%)`;
    }

  });

});