
let url = null;
let data = null;

// function google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,pt,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // Aguarda um pequeno tempo e traduz automaticamente
  setTimeout(function () {
    changeLanguage('pt'); // Altere para 'es' se quiser Espanhol
  }, 1000);
}

// Função para alterar o idioma
function changeLanguage(lang) {
  var select = document.querySelector("select.goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
}

// Função para incrementar a quantidade
function incrementQuantity() {
  const quantityInput = document.getElementById('quantity');
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

// função para decrementar a quantidade
function decrementQuantity() {
  const quantityInput = document.getElementById('quantity');
  if (parseInt(quantityInput.value) > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}

// ping pong
document.addEventListener('DOMContentLoaded', function () {
  // adicionando tecnica de ping pong para atualizar a quantidade de itens no carrinho
  let isPing = true;
  setInterval(function () {

    if (isPing) {
      // ping

      // commom
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // cart
      const cartCount = document.getElementById('cart-count');
      cartCount.textContent = cart.length;

      // favorite
      const favorite = JSON.parse(localStorage.getItem('favorite') || '[]')
      const favoriteCount = document.getElementById('favorite-count');
      favoriteCount.textContent = favorite.length;

      // atualizando o valor total do carrinho
      const cartTotal = document.getElementById('cart-total');
      let total = 0;

      cart.forEach(item => {
        const price = parseFloat(item.price
          .replace('R$', '')
          .replace('.', '')
          .replace(',', '.')
          .trim());
        total += price * item.quantity;
      });

      cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;


      isPing = false;
    } else {
      // pong
      isPing = true;
    }
  }, 500);
});


// função para adicionar items ao favoritos no localhistory
function addToFavorites(event, encodedData) {
  event.preventDefault()

  // tratar encoded
  data = JSON.parse(decodeURIComponent(encodedData));

  const favorite = JSON.parse(localStorage.getItem('favorite') || '[]')

  const favoriteItem = {
    id: data.id || Date.now(),
    name: data.nome_do_servico,
    thumbnail: data.thumbnail
  }

  favorite.push(favoriteItem)
  localStorage.setItem('favorite', JSON.stringify(favorite))
}

// função para abrir modal do favoritos
function openFavoritesModal(event) {
  event.preventDefault()

  const favoritesModal = document.getElementById('favorite-modal');
  const favoritesModalInstance = new bootstrap.Modal(favoritesModal);

  // get the cart items from local storage
  const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

  // clear all divs
  document.getElementById('favorite-items').innerHTML = '';

  // update the favorite items in the modal
  favorite.map(item => {
    cartItemHTML = `
       <div class="d-flex align-items-center gap-3 mb-3">
        <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
        </div>

         <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="removeFromFavorite(event, '${encodeURIComponent(JSON.stringify(item))}')">
          <svg width="18" height="18">
            <use xlink:href="#trash"></use>
          </svg>
        </button>
      </div>
      `;
    document.getElementById('favorite-items').insertAdjacentHTML('beforeend', cartItemHTML);

  });
  favoritesModalInstance.show();
}

// função para remover item do favoritos
function removeFromFavorite(event, encodedItem) {
  event.preventDefault()
  // Decode the encoded item data
  item = JSON.parse(decodeURIComponent(encodedItem));

  // Get the favorite from local storage
  const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

  // Remove the item from the favorite
  const updatedfavorite = favorite.filter(c => c.id !== item.id);
  localStorage.setItem('favorite', JSON.stringify(updatedfavorite));

  updateFavorites();
}

// função para atualizar o favoritos
function updateFavorites() {

  // get the favorite items from local storage
  const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

  // clear all divs
  document.getElementById('favorite-items').innerHTML = '';

  // update the favorite items in the modal
  favorite.map(item => {
    cartItemHTML = `
       <div class="d-flex align-items-center gap-3 mb-3">
        <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
        </div>

         <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="removeFromFavorite(event, '${encodeURIComponent(JSON.stringify(item))}')">
          <svg width="18" height="18">
            <use xlink:href="#trash"></use>
          </svg>
        </button>
      </div>
      `;
    document.getElementById('favorite-items').insertAdjacentHTML('beforeend', cartItemHTML);
  });
}

// função para abrir modla do carrinho
function openCartModal() {
  const cartModal = document.getElementById('cart-modal');
  const cartModalInstance = new bootstrap.Modal(cartModal);

  // get the cart items from local storage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // clear all divs
  document.getElementById('cart-items').innerHTML = '';

  // update the cart items in the modal
  cart.map(item => {
    cartItemHTML = `
       <div class="d-flex align-items-center gap-3 mb-3">
        <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
        
       <div class="flex-grow-1">
        <h6 class="fw-bold mb-2">${item.name}</h6>
        <div class="d-flex align-items-center gap-3">
          <div class="text-success fw-bold fs-5">
            ${item.price}
          </div>
          <div class="badge bg-primary">
            Qtd: ${item.quantity}
          </div>
          <div class="text-muted">
            Subtotal: R$ ${(parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>


        <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="removeFromCart(event, '${encodeURIComponent(JSON.stringify(item))}')">
          <svg width="18" height="18">
            <use xlink:href="#trash"></use>
          </svg>
        </button>
      </div>

      `;
    document.getElementById('cart-items').insertAdjacentHTML('beforeend', cartItemHTML);

  });

  cartModalInstance.show();
}

// function para atualizar lista do carrinho ao deletar item
function updateCart() {
  // get the cart items from local storage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // clear all divs
  document.getElementById('cart-items').innerHTML = '';

  // update the cart items in the modal
  cart.map(item => {
    cartItemHTML = `
       <div class="d-flex align-items-center gap-3 mb-3">
        <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
        
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <div class="text-primary fw-bold">${item.price}</div>
        </div>

        <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="removeFromCart(event, '${encodeURIComponent(JSON.stringify(item))}')">
          <svg width="18" height="18">
            <use xlink:href="#trash"></use>
          </svg>
        </button>
      </div>

      `;
    document.getElementById('cart-items').insertAdjacentHTML('beforeend', cartItemHTML);

  });
}

// Add this function to handle the click
function addToCart(event) {
  event.preventDefault()

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')

  const cartItem = {
    id: data.id || Date.now(),
    name: data.nome_do_servico,
    price: data.valor_com_desconto,
    quantity: parseInt(document.getElementById('quantity').value),
    thumbnail: data.thumbnail
  }

  cart.push(cartItem)
  localStorage.setItem('cart', JSON.stringify(cart))
}

// função para remover item do carrinho
function removeFromCart(event, encodedItem) {
  event.preventDefault()

  // Decode the encoded item data
  item = JSON.parse(decodeURIComponent(encodedItem));

  // Get the cart from local storage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Remove the item from the cart
  const updatedCart = cart.filter(c => c.id !== item.id);
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  updateCart();
}

// function this open modal details product
function openModalDetailsProduct(event, encodedProduct) {
  event.preventDefault();

  // Decode the encoded product data
  data = JSON.parse(decodeURIComponent(encodedProduct));

  // adicionando o nome do produto no modal
  var textoComQuebrasDeLinha = data.descricao_do_servico.replace(/(\r\n|\n|\r)/gm, '<br>');

  // adicionando details product modal
  const containerDetail = document.getElementById('product-details');
  const detailHTML = `
        <div class="row g-4">
      <!-- Image Gallery Column -->
      <div class="col-md-6">
        <!-- Main Product Image -->
        <div class="position-relative mb-3">
          <img id="productImage" src="${data.thumbnail}" class="img-fluid rounded shadow-sm" alt="Product Image">
          <span class="badge bg-danger position-absolute top-0 end-0 m-2">-${data.desconto}%</span>
        </div>
        
        <!-- Thumbnail Gallery -->
        <div class="row row-cols-5 g-2">
          ${[data.foto_1, data.foto_2, data.foto_3, data.foto_4, data.foto_5,
    data.foto_6, data.foto_7, data.foto_8, data.foto_9, data.foto_10]
      .filter(img => img)
      .map(img => `
              <div class="col">
                <img src="${img}" class="img-fluid rounded cursor-pointer hover-opacity" 
                    onclick="document.getElementById('productImage').src = this.src"
                    alt="Product thumbnail">
              </div>
            `).join('')}
        </div>
      </div>

      <!-- Product Details Column -->
      <div class="col-md-6">
        <div class="sticky-md-top pt-3">
          <h3 id="productName" class="fw-bold mb-3"></h3>
          
          <!-- Price Section -->
          <div class="mb-4">
            <span class="h4 text-primary fw-bold">${data.valor_com_desconto}</span>
            <del class="text-muted ms-2">${data.valor_do_servico}</del>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <p class="text-secondary lh-lg">${textoComQuebrasDeLinha}</p>
          </div>

         
        </div>
      </div>
    </div>

    <style>
    .cursor-pointer { cursor: pointer; }
    .hover-opacity:hover { opacity: 0.8; transition: opacity 0.2s; }
    </style>

    `
  containerDetail.innerHTML = detailHTML


  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  modal.show();
}

// // function base fetch
// function getFetchData(url) {
//     return fetch(url)
//         .then(response => response.text())
//         .then(csvData => {
//             // Parseia o CSV para um array de objetos
//             const parsedData = Papa.parse(csvData, {
//                 header: true,
//                 dynamicTyping: true,
//                 skipEmptyLines: true,
//                 transformHeader: header => header.trim().replace(/\s+/g, '_')
//             });

//             return parsedData.data
//         })
//         .catch(error => console.error("Erro ao buscar os dados:", error));
// }

// function products
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?output=csv";
getFetchData(url).then((data) => {
  console.log('products (getFetchData)', data)
  const container = document.getElementById('product-container');
  const containerBlocks = document.getElementById('banner-blocks-item');

  data.map((product, index) => {

    const bannerBlocksHTML = `  
        <div class="col-12 col-md-4 mb-3" style="height: 300px;">
        <div class="h-100" style="background: url('${product.thumbnail}') no-repeat center; background-size: cover;">
          <div class="banner-content ${index === 0 ? '' : 'align-items-center'} p-3 h-100">
            <div class="content-wrapper text-light">
              <h4 class="banner-title text-light">${product.nome_do_servico}</h4>
              <p>Desconto de até ${product.desconto}%</p>
              <a href="javascript:void(0)" 
                class="btn-link text-white" 
                onclick="openModalDetailsProduct(event, '${encodeURIComponent(JSON.stringify(product))}')">
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </div>
      `;

    containerBlocks.insertAdjacentHTML('beforeend', bannerBlocksHTML);

    const productHTML = `
                      <div class="col p-2 product-item">
                          <figure>
                              <a href="javascript:void(0)" title="${product.nome_do_servico}" onclick="openModalDetailsProduct(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                  <img width="200" height="200" src="${product.thumbnail}" alt="${product.nome_do_servico}" class="tab-image">
                              </a>
                          </figure>
                          <div class="d-flex flex-column text-center">
                              <h3 class="fs-6 fw-normal">${product.nome_do_servico}</h3>
                              <div>
                               <span class="rating">
                                  <svg width="18" height="18" class="text-warning">
                                    <use xlink:href="#star-full"></use>
                                  </svg>
                                  <svg width="18" height="18" class="text-warning">
                                    <use xlink:href="#star-full"></use>
                                  </svg>
                                  <svg width="18" height="18" class="text-warning">
                                    <use xlink:href="#star-full"></use>
                                  </svg>
                                  <svg width="18" height="18" class="text-warning">
                                    <use xlink:href="#star-full"></use>
                                  </svg>
                                  <svg width="18" height="18" class="text-warning">
                                    <use xlink:href="#star-half"></use>
                                  </svg>
                                </span>
                                  <span>(${product.avaliacoes})</span>
                              </div>
                              <div class="d-flex justify-content-center align-items-center gap-2">
                                  <del>${product.valor_do_servico}</del>
                                  <span class="text-dark fw-semibold">${product.valor_com_desconto}</span>
                                  <span class="badge border border-dark-subtle 5 fw-normal px-1 fs-7 lh-1 text-body-tertiary">${product.desconto}% OFF</span>
                              </div>
                              <div class=" p-3 pt-0">
                                  <div class="row g-1 mt-2">
                                      <div class="col">
                                          <a href="javascript:void(0)" class="btn w-100 btn-primary rounded-1 p-2 fs-7 btn-cart" 
                                            onclick="openModalDetailsProduct(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                            Reservar
                                          </a>
                                      </div>
                                      <div class="col-2">
                                          <a href="javascript:void(0)" class="btn btn-outline rounded-1 p-2 fs-6" onclick="addToFavorites(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                              <svg width="18" height="18">
                                                  <use xlink:href="#heart"></use>
                                              </svg>
                                          </a>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
              `;
    container.insertAdjacentHTML('beforeend', productHTML);
  });
}).catch(error => console.error("Erro ao buscar os dados:", error));

// function search
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=456867245&single=true&output=csv"
getFetchData(url).then(data => {
  console.log('search (getFetchData)', data)
  const containerSearch = document.getElementById('search-item');
  const conatinerSerachList = document.getElementById('search-list');
  data.map(search => {

    const searchListHTML = `
         <li class="menu-item">
            <a href="${search.to}" class="nav-link">${search.label}</a>
          </li>
        `
    conatinerSerachList.insertAdjacentHTML('beforeend', searchListHTML);

    const searchHTML = `
         <a href="${search.to}" class="btn btn-warning me-2 mb-2">${search.label}</a>
        `
    containerSearch.insertAdjacentHTML('beforeend', searchHTML);
  })
}).catch(error => console.error("Erro ao buscar os dados:", error));

// function packages
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=752621485&single=true&output=csv"
getFetchData(url).then(data => {
  console.log('packages (getFetchData)', data)
  const containerPackage = document.getElementById('package-item');
  data.map(package => {
    const packageHTML = `
      <div class="swiper-slide">
        <a href="${package.to}" class="nav-link swiper-slide text-center">
          <img style="width: 120px; height: 120px" src="${package.image}" class="rounded-circle" alt="${package.label}">
          <h4 class="fs-6 mt-3 fw-normal category-title">${package.label}</h4>
        </a>
      </div>
      `
    containerPackage.insertAdjacentHTML('beforeend', packageHTML);
  })
}).catch(error => console.error("Erro ao buscar os dados:", error));

