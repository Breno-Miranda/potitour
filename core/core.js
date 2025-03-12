
let url = null;
let data = null;

// function google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt',
    includedLanguages: 'en,pt,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Função para alterar o idioma
function changeLanguage(lang) {
  var select = document.querySelector("select.goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
}

class CoreLoader {

  // variables
  data;

  textHTML = `
    <div class="container-lg skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `;

  // modal
  modalLabel;
  modalBody;
  modalFooter;
  modelDefault;
  modalDefaultBody;
  modalDefaultContent;
  modelDefaultInstance;

  // constructor
  constructor() { }

  loadScripts = () => {
    return {
      swiper: () => {
        window.addEventListener("load", function () {
          let script = document.createElement("script");
          script.src = "js/script.js";
          script.type = "text/javascript";
          script.async = true; // Evita bloqueio na execução
          document.body.appendChild(script);
          script.onload = () => console.log("script JS carregado!");
        });
      }
    }
  }

  loadModal = () => {
    this.modelDefault = document.getElementById('modal-default');
    this.modalDefaultBody = document.getElementById('modal-default-body');
    this.modalDefaultContent = document.getElementById('modal-default-content');

    this.modalDefaultContent.style.maxWidth = "80%";
    this.modalDefaultContent.style.minWidth = "96%";

    // Verificar se o modal existe no DOM antes de criar a instância
    if (this.modelDefault) {
      this.modelDefaultInstance = new bootstrap.Modal(this.modelDefault);
    } else {
      console.warn("Elemento #modal-section não encontrado no DOM.");
    }

    // elementIds
    this.modalLabel = document.getElementById('modal-label');
    this.modalBody = document.getElementById('modal-body');
    this.modalFooter = document.getElementById('modal-footer');
  }

  loadData = () => {
    return {
      baseFetch: (url) => {
        return fetch(url)
          .then(response => response.text())
          .then(csvData => {
            // Parseia o CSV para um array de objetos
            const parsedData = Papa.parse(csvData, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
              transformHeader: header => header.trim().replace(/\s+/g, '_')
            });

            return parsedData.data
          })
          .catch(error => console.error("Erro ao buscar os dados:", error));
      },
      packages: () => {
        url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=752621485&single=true&output=csv"
        this.loadData().baseFetch(url)
          .then(data => {
            console.log('packages (getFetchData)', data);

            const containerPackage = document.getElementById('package-item');

            let textHTML = this.textHTML;

            // Verifica se o container existe e se data é válido
            if (containerPackage && Array.isArray(data)) {
              textHTML = data.map(pkg => `
                <div class="swiper-slide">
                  <a href="${pkg.to}" class="nav-link swiper-slide text-center">
                    <img style="width: 120px; height: 120px" src="${pkg.image}" class="rounded-circle" alt="${pkg.label}">
                    <h4 class="fs-6 mt-3 fw-normal category-title">${pkg.label}</h4>
                  </a>
                </div>
              `).join(""); // Junta os elementos HTML em uma única string

              containerPackage.insertAdjacentHTML('beforeend', textHTML);
            } else {
              console.error('Erro: containerPackage não encontrado ou data não é um array válido.');
            }

          }).catch(error => console.error("Erro ao buscar os dados:", error));
      },
      products: () => {
        // function products
        url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?output=csv";
        this.loadData().baseFetch(url).then((data) => {
          console.log('products (getFetchData)', data)
          const container = document.getElementById('product-container');
          const containerBlocks = document.getElementById('banner-blocks-item');

          let textHTMLBlocks = this.textHTML;
          let textHTMLProduct = this.textHTML;

          data.map((product, index) => {

           textHTMLBlocks = `  
                    <div class="col-12 col-md-4 mb-3" style="height: 300px;">
                        <div class="h-100" style="background: url('${product.thumbnail}') no-repeat center; background-size: cover;">
                            <div class="banner-content ${index === 0 ? '' : 'align-items-center'} p-3 h-100">
                                <div class="content-wrapper text-light">
                                    <h4 class="banner-title text-light">${product.nome_do_servico}</h4>
                                    <p>Desconto de até ${product.desconto}%</p>
                                    <a href="javascript:void(0)" 
                                        class="btn-link text-white" 
                                        onclick="instance.reservation().openModal(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                        Saiba Mais
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

            containerBlocks.insertAdjacentHTML('beforeend', textHTMLBlocks);


            textHTMLProduct = `
                        <div class="col p-2 product-item" id="${product.hash}">
                            <figure>
                                <a href="javascript:void(0)" 
                                title="${product.nome_do_servico}" 
                                onclick="instance.reservation().openModal(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                    <img width="200" height="200" 
                                        src="${product.thumbnail}" 
                                        alt="${product.nome_do_servico}" 
                                        class="tab-image">
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
                                    <span class="badge border border-dark-subtle fw-normal px-1 fs-7 lh-1 text-body-tertiary">
                                        ${product.desconto}% OFF
                                    </span>
                                </div>
                                <div class="p-3 pt-0">
                                    <div class="row g-1 mt-2">
                                        <div class="col">
                                            <a href="javascript:void(0)" 
                                            class="btn w-100 btn-primary rounded-1 p-2 fs-7 btn-cart" 
                                            onclick="instance.reservation().openModal(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                              Reservar
                                            </a>
                                        </div>
                                        <div class="col-2">
                                            <a href="javascript:void(0)" 
                                            class="btn btn-danger rounded-1 p-1 fs-6" 
                                            onclick="instance.favorite().addToFavorites(event, '${encodeURIComponent(JSON.stringify(product))}')">
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
            container.insertAdjacentHTML('beforeend', textHTMLProduct);
          });


        }).catch(error => console.error("Erro ao buscar os dados:", error));
      },
      search: () => {
        url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=456867245&single=true&output=csv"
        this.loadData().baseFetch(url).then(data => {
          console.log('search (getFetchData)', data)
          const containerSearch = document.getElementById('search-item');
          const conatinerSerachList = document.getElementById('search-list');

          let textSearchListHTML = this.textHTML;
          let textSearchHTML = this.textHTML;

          data.map(search => {

            textSearchListHTML = `
                    <li class="menu-item">
                        <a href="${search.to}" class="nav-link">${search.label}</a>
                    </li>
                    `
            conatinerSerachList.insertAdjacentHTML('beforeend', textSearchListHTML);

            textSearchHTML = `
                        <a href="${search.to}" class="btn btn-warning me-2 mb-2">${search.label}</a>
                        `
            containerSearch.insertAdjacentHTML('beforeend', textSearchHTML);
          })
        }).catch(error => console.error("Erro ao buscar os dados:", error));
      },
      run: () => {
        this.loadData().packages();
        this.loadData().products();
        this.loadData().search();
      }
    }
  }

  init = () => {
    return new Promise((resolve, reject) => {
      document.addEventListener("DOMContentLoaded", () => {
        const components = [
          { id: "steps", file: "steps.html" },
          { id: "packages", file: "packages.html", callback: this.loadScripts().swiper() },
          { id: "products", file: "products.html" },
          { id: "hghlight", file: "hghlight.html" },
          { id: "contact", file: "contact.html" },
          { id: "search-section", file: "search.html" },
          { id: "modal-section", file: "modal.html" },
        ];

        // Crie um array de Promises para cada fetch
        const componentPromises = components.map(({ id, file, callback }) => {
          return fetch(`components/${file}`)
            .then((res) => res.text())
            .then((data) => {
              const element = document.getElementById(id);
              if (element) {
                element.innerHTML = data;
                if (callback) callback();
              }
            })
            .catch((err) => {
              console.error(`Erro ao carregar ${file}:`, err);
              throw err;  // Se ocorrer um erro, rejeita a promise
            });
        });

        // Espera que todos os componentes sejam carregados
        Promise.all(componentPromises)
          .then(() => {
            console.log("Todos os componentes foram carregados.");
            resolve(); // Resolve a Promise quando todos os componentes forem carregados
          })
          .catch((err) => {
            reject("Erro no carregamento de componentes.");
          });
      });
    });
  }

  reservation = () => {
    // return the products
    return {
      openModal: (event, encodedData) => {
        event.preventDefault();

        // Decode the encoded product data
        data = JSON.parse(decodeURIComponent(encodedData))

        // clear all divs
        this.modalLabel.innerHTML = `Reservar para ${data?.nome_do_servico}`;
        this.modalBody.innerHTML = '';
        this.modalFooter.innerHTML = '';

        // adicionando o nome do produto no modal
        var textoComQuebrasDeLinha = data.descricao_do_servico.replace(/(\r\n|\n|\r)/gm, '<br>');

        //  adding html default
        let textHTML = this.textHTML;

        // adicionando details product modal
        textHTML = `
              <div class="row g-4">
              <!-- Image Gallery Column -->
              <div class="col-md-6">
                <!-- Main Product Image -->
                <div class="position-relative mb-3">
                  <img id="productImage" src="${data.thumbnail}" class="img-fluid w-100 h-50 rounded shadow-sm" alt="Product Image">
                  <span class="badge bg-danger position-absolute top-0 end-0 m-2">-${data.desconto}%</span>
                </div>
                <!-- Thumbnail Gallery -->
                <div class="row row-cols-5 g-2">
                  ${[data.thumbnail, data.foto_1, data.foto_2, data.foto_3, data.foto_4, data.foto_5,
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
                  <div class="mb-4" style="height: 500px; overflow-y: auto;">
                    <p class="text-secondary lh-lg">${textoComQuebrasDeLinha}</p>
                  </div>
                </div>
              </div>
            </div>
          `
        this.modalBody.innerHTML = textHTML

        this.modalFooter.innerHTML = `  
            <div class="cart-total-wrapper">
              <span class="text-muted fs-5">Total:</span>
              <span class="ms-2 fs-4 fw-bold text-success">${data.valor_com_desconto}</span>
            </div>

            <button class="btn btn-primary btn-lg" onclick="instance.cart().addToCart(event)">
              Adicionar ao carrinho
              <svg width="16" height="16" class="ms-2">
                <use xlink:href="#arrow-right"></use>
              </svg>
            </button>
        `;

        this.modelDefaultInstance.show();
      },
    }
  }

  cart = () => {
    // get the cart items from local storage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    this.modalLabel.innerHTML = 'Checkout de Resevas';
    this.modalBody.innerHTML = '';
    this.modalFooter.innerHTML = '';

    return {
      bodyHTMl: (cart) => {
        let textHTML = this.textHTML;

        if (cart.length > 0)
          cart.map(item => {
            textHTML = `
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
                <!--- <div class="text-muted">
                        Subtotal: R$ ${(parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div> --!>
              </div>
            </div>
    
            <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="instance.cart().removeFromCart(event, '${item.id}')">
              <svg width="18" height="18">
                <use xlink:href="#trash"></use>
              </svg>
            </button>
          </div>
          `;
            this.modalBody.insertAdjacentHTML('beforeend', textHTML);
          });

        if (cart.length > 0)
          this.modalFooter.innerHTML = `  
              <div class="cart-total-wrapper">
                <span class="text-muted fs-5">Total:</span>
                <span id="cart-total"  class="ms-2 fs-4 fw-bold text-success">R$ 0,00</span>
              </div>

              <button class="btn btn-primary btn-lg">
                Finalizar Reserva
                <svg width="16" height="16" class="ms-2">
                  <use xlink:href="#arrow-right"></use>
                </svg>
              </button>
          `;
      },
      openModal: () => {
        // update the favorite items in the modal
        let textHTML = '';

        // update the cart items in the modal
        this.cart().bodyHTMl(cart);

        this.modelDefaultInstance.show();
      },
      addToCart: (event) => {
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

        this.modelDefaultInstance.hide();
      },
      updateCart: () => {
        // get the cart items from local storage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        this.cart().bodyHTMl(cart);
      },
      removeFromCart: function (event, id) {
        event.preventDefault()

        // Remove the item from the cart
        const updatedCart = cart.filter(c => c.id !== Number(id));
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        this.updateCart();
      }
    }
  }

  favorite = () => {
    // get the favorite items from local storage
    const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

    // clear all divs
    this.modalLabel.innerHTML = 'Meus Passeios Favoritos';
    this.modalBody.innerHTML = '';
    this.modalFooter.innerHTML = '';

    return {
      bodyHTMl: (favorite) => {
        let textHTML = '';

        // update the favorite items in the modal
        favorite.forEach(item => {
          let textHTML = `
            <div class="d-flex align-items-center gap-3 mb-3">
              <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
              <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
              </div>
  
              <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="instance.favorite().removeFromFavorite(event,'${item.id}')">
                <svg width="18" height="18">
                  <use xlink:href="#trash"></use>
                </svg>
              </button>
            </div>
          `;
          this.modalBody.insertAdjacentHTML('beforeend', textHTML);
        });

      },
      openModal: () => {
        // update the favorite items in the modal
        let textHTML = this.textHTML;;

        favorite.forEach(item => {
          textHTML = `
             <div class="d-flex align-items-center gap-3 mb-3">
              <img src="${item.thumbnail}" width="100" alt="${item.name}" class="img-fluid rounded">
              <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
              </div>
      
               <button class="btn btn-outline-danger btn-sm" data-id="${item.id}" onclick="instance.favorite().removeFromFavorite(event, '${item.id}')">
                <svg width="18" height="18">
                  <use xlink:href="#trash"></use>
                </svg>
              </button>
            </div>
          `;
          this.modalBody.insertAdjacentHTML('beforeend', textHTML);
        });

        this.modelDefaultInstance.show();
      },
      addToFavorites: (event, encodedData) => {
        event.preventDefault()

        // tratar encoded
        data = JSON.parse(decodeURIComponent(encodedData));

        const favoriteItem = {
          id: data.id || Date.now(),
          name: data.nome_do_servico,
          thumbnail: data.thumbnail
        }

        favorite.push(favoriteItem)
        localStorage.setItem('favorite', JSON.stringify(favorite))
      },
      updateFavorite: () => {
        // get the favorite items from local storage
        const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

        this.favorite().bodyHTMl(favorite);
      },
      removeFromFavorite: (event, id) => {
        event.preventDefault();

        // Remove the item from the favorite
        const updatedfavorite = favorite.filter(c => c.id !== Number(id));
        localStorage.setItem('favorite', JSON.stringify(updatedfavorite));

        // Chama 'updateFavorite' no contexto correto
        this.favorite().updateFavorite();
      },
    };
  };

  pingPong = () => {
    let isPing = true;
    return {
      pingCart: function (cart) {
        let total = 0;
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        cart.forEach(item => {
          const price = parseFloat(item.price
            .replace('R$', '')
            .replace('.', '')
            .replace(',', '.')
            .trim());
          total += price * item.quantity;
        });

        if (cartCount)
          cartCount.textContent = cart.length;

        if (cartTotal)
          cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`;
      },

      pingFavorite: function (favorite) {
        const favoriteCount = document.getElementById('favorite-count');
        if (favoriteCount)
          favoriteCount.textContent = favorite.length;
      },

      ping: function () {
        setInterval(() => {
          if (isPing) {
            // Comum
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const favorite = JSON.parse(localStorage.getItem('favorite') || '[]');

            // Pings
            this.pingCart(cart);
            this.pingFavorite(favorite);

            isPing = false;
          } else {
            // Pong
            isPing = true;
          }
        }, 500);
      }
    };
  }

  run = async () => {
    console.time('**** core ****');

    // Aguarde 'init' primeiro
    await this.init();

    // Após 'init', execute as outras promessas
    await Promise.allSettled([
      this.loadData().run(),
      this.pingPong().ping(),
      this.loadModal()
    ]);

    console.timeEnd('**** core ****');
  };
}

const instance = new CoreLoader();
instance.run();