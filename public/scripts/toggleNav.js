function toggleNav() {
      var x = document.getElementById("ul-menu");
      if (x.style.display === "block" && window.innerWidth < 768) {
          x.style.display = "none";
      } else {
          x.style.display = "block";
      }
  }

document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = Array.from(document.querySelectorAll('.carousel-item'));
    const scrollUpButton = document.getElementById('scroll-up');
    const scrollDownButton = document.getElementById('scroll-down');

    let currentIndex = 0;
    const maxVisibleItems = 4;

    updateCarousel();

    scrollUpButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    scrollDownButton.addEventListener('click', () => {
        if (currentIndex < carouselItems.length - maxVisibleItems) {
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const offset = currentIndex * (carouselItems[0].offsetHeight + 20);
        carouselTrack.style.transform = `translateY(-${offset}px)`;
    }
});