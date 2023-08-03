document.addEventListener("DOMContentLoaded", function () {
  var carousels = document.querySelectorAll(".carousel");
  carousels.forEach(function (carousel) {
    var carouselInner = carousel.querySelector(".carousel-inner");
    var slides = carousel.querySelectorAll(".carousel-slide");
    var prevButton = carousel.querySelector(".carousel-prev");
    var nextButton = carousel.querySelector(".carousel-next");
    var totalSlides = slides.length;
    var slideWidth = carousel.offsetWidth;
    var currentSlide = 0;

    function updateNavigation() {
      prevButton.disabled = currentSlide === 0;
      nextButton.disabled = currentSlide === totalSlides - 1;
    }

    function goToSlide(slideIndex) {
      carouselInner.style.transform = "translateX(-" + slideIndex * slideWidth + "px)";
      currentSlide = slideIndex;
      updateNavigation();
    }

    function goToNextSlide() {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    }

    function goToPrevSlide() {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }

    prevButton.addEventListener("click", goToPrevSlide);
    nextButton.addEventListener("click", goToNextSlide);

    updateNavigation();
  });
  

  var cartIcon = document.querySelector(".cart-icon");
  var cartModal = document.querySelector(".cart-modal");
  var closeCartModal = document.querySelector(".close-cart-modal");

  cartIcon.addEventListener("click", () => {
    cartModal.style.display = "block";
  });
  
  closeCartModal.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  var cartContent = document.querySelector(".cart-content");
  var cartCount = document.querySelector(".cart-count");
  var cartItems = {};

  function updateCartModal() {
    cartContent.innerHTML = "";
    let total = 0;

    for (const product in cartItems) {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
        ${product}: ${cartItems[product]}
        <button class="remove-from-cart" data-product="${product}">Eliminar</button>
        <br>
      `;
      cartContent.appendChild(cartItem);
    }

    // Agregar botón "Comprar Todo" y manejar el evento clic
    const buyAllButton = document.createElement("button");
    buyAllButton.textContent = "Comprar Todo";
    buyAllButton.classList.add("buy-all-button");
    cartContent.appendChild(buyAllButton);

    buyAllButton.addEventListener("click", () => {
      buyAllItems();
    });

    document.querySelectorAll(".remove-from-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const productToRemove = button.dataset.product;
        removeFromCart(productToRemove);
      });
    });
  }

  function buyAllItems() {
    // Mostrar Sweet Alert
    Swal.fire({
      title: "Confirmar Compra",
      text: "¿Desea comprar todos los productos en el carrito?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Comprar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Vaciar el carrito
        cartItems = {};
        updateCartModal();
        updateCartCount();

        // Mostrar Sweet Alert de compra exitosa
        Swal.fire({
          title: "¡Compra realizada!",
          text: "Se han comprado todos los productos en el carrito.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    });
  }
// Función para agregar un producto al carrito
function addToCart(product) {
  cartItems[product] = (cartItems[product] || 0) + 1;
  updateCartCount();
  updateCartModal();

  // Guardar carrito en Local Storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Función para eliminar un producto del carrito
function removeFromCart(product) {
  if (cartItems[product] > 1) {
    cartItems[product]--;
  } else {
    delete cartItems[product];
  }
  updateCartModal();
  updateCartCount();

  // Actualizar carrito en Local Storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


  var addToCartButtons = document.querySelectorAll(".add-to-cart");
  
 // Evento clic para los botones "Agregar al carrito"
 var addToCartButtons = document.querySelectorAll(".add-to-cart");
 addToCartButtons.forEach((button) => {
   button.addEventListener("click", () => {
     var product = button.closest(".carousel-caption").querySelector("h4").textContent;
     addToCart(product);
   });
 });

 // Obtener los productos del carrito almacenados en el Local Storage al cargar la página
 var storedCartItems = localStorage.getItem('cartItems');
 if (storedCartItems) {
   cartItems = JSON.parse(storedCartItems);
   updateCartCount();
   updateCartModal();
 }

  function updateCartCount() {
    var totalItems = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    cartCount.textContent = totalItems;
  }

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var emailInput = document.getElementById("correo");
      var email = emailInput.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor, ingresa un correo electrónico válido.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "¡Formulario enviado con éxito!",
          text: "Gracias por contactarnos. Te responderemos pronto.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            contactForm.reset();
          }
        });
      }
    });
  }
});
