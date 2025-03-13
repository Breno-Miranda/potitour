
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
  new google.translate.TranslateElement({
    pageLanguage: String(lang),
    includedLanguages: 'en,pt,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
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
  modelDefaultInstance;

  // constructor
  constructor() { }

  loadPage = () => {
    console.log('A página foi carregada!');
    // Aqui você pode adicionar o código que deseja executar quando a página for carregada

    // Obtém a URL atual
    const url = new URL(window.location.href);

    // Obtém o valor do parâmetro 'page'
    const pageName = url.searchParams.get('page');

    if (pageName)
      fetch(`page/${pageName}.html`)
        .then((res) => res.text())
        .then((data) => {
          const element = document.getElementById("body");
          if (element) {
            element.innerHTML = data;
          }
        })
        .catch((err) => {
          console.error(`Erro ao carregar ${pageName}:`, err);
          throw err;  // Se ocorrer um erro, rejeita a promise
        });

    console.log('Nome da página:', pageName);
  }

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
    this.modalDefaultContent = document.getElementById('modal-default-content');

    this.modalDefaultContent.style.minWidth = "50%";
    this.modalDefaultContent.style.maxWidth = "100%";

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
        const container = document.getElementById('product-container');
        const containerBlocks = document.getElementById('banner-blocks-item');

        if (container && containerBlocks) {
          url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?output=csv";
          this.loadData().baseFetch(url).then((data) => {
            console.log('products (getFetchData)', data)
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
                            <div class="col p-3 product-item shadow-sm rounded border hover-shadow" id="${product.hash}">
                              <div class="position-relative">
                                  <!-- Badge de desconto flutuante -->
                                  <div class="position-absolute top-0 end-0 m-2">
                                      <span class="badge bg-danger fw-bold px-2 py-1 fs-6">
                                          ${product.desconto}% OFF
                                      </span>
                                  </div>
                                  <!-- Imagem com proporção fixa e efeito hover -->
                                  <figure class="mb-2 overflow-hidden rounded">
                                      <a href="javascript:void(0)" 
                                        title="${product.nome_do_servico}" 
                                        onclick="instance.reservation().openModal(event, '${encodeURIComponent(JSON.stringify(product))}', 'lg')">
                                          <img 
                                              src="${product.thumbnail}" 
                                              alt="${product.nome_do_servico}" 
                                              class="tab-image img-fluid transition-zoom"
                                              style="aspect-ratio: 16/9; object-fit: cover; width: 100%;">
                                      </a>
                                  </figure>
                              </div>
                              
                              <div class="d-flex flex-column">
                                  <!-- Nome do serviço com limite de altura -->
                                  <h3 class="fs-5 fw-medium text-start mb-2" style="height: 48px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                      ${product.nome_do_servico}
                                  </h3>
                                  
                                  <!-- Avaliações com estrelas e número -->
                                  <div class="d-flex align-items-center mb-2">
                                      <div class="rating me-2">
                                          <svg width="16" height="16" class="text-warning">
                                              <use xlink:href="#star-full"></use>
                                          </svg>
                                          <svg width="16" height="16" class="text-warning">
                                              <use xlink:href="#star-full"></use>
                                          </svg>
                                          <svg width="16" height="16" class="text-warning">
                                              <use xlink:href="#star-full"></use>
                                          </svg>
                                          <svg width="16" height="16" class="text-warning">
                                              <use xlink:href="#star-full"></use>
                                          </svg>
                                          <svg width="16" height="16" class="text-warning">
                                              <use xlink:href="#star-half"></use>
                                          </svg>
                                      </div>
                                      <span class="text-muted fs-7">(${product.avaliacoes} avaliações)</span>
                                  </div>
                                  
                                  <!-- Preço e desconto -->
                                  <div class="d-flex align-items-end gap-2 mb-3">
                                      <span class="text-dark fw-bold fs-4">${product.valor_com_desconto}</span>
                                      <del class="text-muted fs-6">${product.valor_do_servico}</del>
                                  </div>
                                  
                                  <!-- Botões de ação -->
                                  <div class="d-flex gap-2">
                                      <button 
                                          class="btn btn-primary flex-grow-1 rounded-pill py-2 fw-medium" 
                                          onclick="instance.reservation().openModal(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                          <svg width="16" height="16" class="me-1">
                                              <use xlink:href="#calendar"></use>
                                          </svg>
                                          Reservar agora
                                      </button>
                                    <button 
                                        class="btn btn-danger rounded-circle p-2" 
                                        style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                                        onclick="instance.favorite().addToFavorites(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                        <svg width="20" height="20" style="fill: white;">
                                            <use xlink:href="#heart"></use>
                                        </svg>
                                    </button>
                                  </div>
                              </div>
                          </div>
                `;

              container.insertAdjacentHTML('beforeend', textHTMLProduct);
            });
          }).catch(error => console.error("Erro ao buscar os dados:", error));
        }

      },
      search: () => {
        const containerSearch = document.getElementById('search-item');
        const conatinerSerachList = document.getElementById('search-list');
        if (containerSearch && conatinerSerachList) {
          url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=456867245&single=true&output=csv"
          this.loadData().baseFetch(url).then(data => {
            console.log('search (getFetchData)', data)
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
        }


      },
      run: () => {
        // this.loadData().packages();
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
          // { id: "packages", file: "packages.html", callback: this.loadScripts().swiper() },
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

        // set height of modal
        this.modalBody.style.height = "500px";

        // Decode the encoded product data
        data = JSON.parse(decodeURIComponent(encodedData))

        // clear all divs
        this.modalLabel.innerHTML = `Detalhes da Passeio`;
        this.modalBody.innerHTML = '';
        this.modalFooter.innerHTML = '';

        // adicionando o nome do produto no modal
        var textoComQuebrasDeLinha = data.descricao_do_servico.replace(/(\r\n|\n|\r)/gm, '<br>');

        //  adding html default
        let textHTML = this.textHTML;

        // adicionando details product modal
        textHTML = `
            <div class="row g-4">
                  <!-- Coluna de Imagens (Lado Esquerdo) -->
                  <div class="col-lg-6 mb-4 mb-lg-0">
                    <h4 class="mb-3 fw-bold">${data.nome_do_servico}</h4>
                    
                    <!-- Imagem Principal -->
                    <div class="position-relative mb-3">
                      <img 
                        id="productImage" 
                        src="${data.thumbnail}" 
                        class="img-fluid w-100 rounded shadow-sm object-fit-cover" 
                        alt="${data.nome_do_servico}"
                        style="height: 400px">
                      <span class="badge bg-danger position-absolute top-0 end-0 m-2 fs-6 px-2 py-1">-${data.desconto}%</span>
                    </div>
                    
                    <!-- Galeria de Miniaturas -->
                    <div class="row g-2 mt-2">
                      ${[data.thumbnail, data.foto_1, data.foto_2, data.foto_3, data.foto_4, data.foto_5,
          data.foto_6, data.foto_7, data.foto_8, data.foto_9, data.foto_10]
            .filter(img => img)
            .map((img, index) => `
                          <div class="col-3 col-sm-2 mb-2">
                            <img 
                              src="${img}" 
                              class="img-fluid rounded border ${index === 0 ? 'border-primary' : ''}" 
                              style="height: 70px; width: 100%; object-fit: cover; cursor: pointer; transition: all 0.2s ease;"
                              onclick="
                                document.getElementById('productImage').src = this.src;
                                document.querySelectorAll('.col-3 img, .col-sm-2 img').forEach(img => img.classList.remove('border-primary'));
                                this.classList.add('border-primary');
                              "
                              alt="Miniatura ${index + 1}">
                          </div>
                        `).join('')}
                    </div>
                  </div>
                  
                  <!-- Coluna de Detalhes (Lado Direito) -->
                  <div class="col-lg-6">
                    <div class="sticky-top pt-2" style="top: 20px; z-index: 100;">
                      <!-- Preço -->
                      <div class="d-flex align-items-center mb-4 p-3 bg-light rounded">
                        <div>
                          <span class="h3 text-primary fw-bold mb-0 d-block">${data.valor_com_desconto}</span>
                          <del class="text-muted">${data.valor_do_servico}</del>
                        </div>
                        <div class="ms-auto">
                          <button class="btn btn-primary rounded-pill px-4 py-2">
                            <svg width="16" height="16" class="me-2">
                              <use xlink:href="#calendar"></use>
                            </svg>
                            Reservar
                          </button>
                        </div>
                      </div>
                      
                      <!-- Descrição com Título -->
                      <div class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3">Descrição do Serviço</h5>
                        <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
                          <p class="text-secondary lh-lg">${textoComQuebrasDeLinha}</p>
                        </div>
                      </div>
                      
                      <!-- Informações Adicionais -->
                      <div class="bg-light rounded p-3 mb-3">
                        <h5 class="mb-3">Informações Adicionais</h5>
                        <div class="row g-2">
                          <div class="col-6">
                            <div class="d-flex align-items-center">
                              <svg width="18" height="18" class="text-primary me-2">
                                <use xlink:href="#star-full"></use>
                              </svg>
                              <span>${data.avaliacoes} avaliações</span>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="d-flex align-items-center">
                              <svg width="18" height="18" class="text-primary me-2">
                                <use xlink:href="#clock"></use>
                              </svg>
                              <span>Duração: ${data.duration}</span>
                            </div>
                          </div>
                        </div>
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
              <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 py-3">
              <div class="cart-total-wrapper  text-sm-start w-100">
                <span class="text-muted fs-5">Total:</span>
                <span id="cart-total" class="ms-2 fs-4 fw-bold text-success">R$ 0,00</span>
              </div>
              
              <button class="btn btn-primary btn-lg w-100 w-sm-auto">
                Finalizar Reserva
                <svg width="16" height="16" class="ms-2">
                  <use xlink:href="#arrow-right"></use>
                </svg>
              </button>
            </div>
          `;
      },
      openModal: () => {
        //set heitht of modal
        this.modalBody.style.height = "300px";

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
        let textHTML = this.textHTML;

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
        // set height of modal
        this.modalBody.style.height = "250px";

        // structure the data
        this.favorite().bodyHTMl(favorite);

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

        // structure the data
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
      this.loadPage(),
      this.loadData().run(),
      this.pingPong().ping(),
      this.loadModal()
    ]);

    console.timeEnd('**** core ****');
  };
}

const instance = new CoreLoader();
instance.run();