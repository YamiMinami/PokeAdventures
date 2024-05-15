function toggleNav() {
      var x = document.getElementById("ul-menu");
      if (x.style.display === "block" && window.innerWidth < 768) {
          x.style.display = "none";
      } else {
          x.style.display = "block";
      }
  }