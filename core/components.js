function loadComponent() {

    function loadSwiper() {
        (function ($) {

            "use strict";

            var initPreloader = function () {
                $(document).ready(function ($) {
                    var Body = $('body');
                    Body.addClass('preloader-site');
                });
                $(window).load(function () {
                    $('.preloader-wrapper').fadeOut();
                    $('body').removeClass('preloader-site');
                });
            }

            // init Chocolat light box
            var initChocolat = function () {
                Chocolat(document.querySelectorAll('.image-link'), {
                    imageSize: 'contain',
                    loop: true,
                })
            }

            var initSwiper = function () {

                var swiper = new Swiper(".main-swiper", {
                    speed: 500,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                });

                var category_swiper = new Swiper(".category-carousel", {
                    slidesPerView: 8,
                    spaceBetween: 30,
                    speed: 500,
                    navigation: {
                        nextEl: ".category-carousel-next",
                        prevEl: ".category-carousel-prev",
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        991: {
                            slidesPerView: 5,
                        },
                        1500: {
                            slidesPerView: 8,
                        },
                    }
                });

                $(".products-carousel").each(function () {
                    var $el_id = $(this).attr('id');

                    var products_swiper = new Swiper("#" + $el_id + " .swiper", {
                        slidesPerView: 5,
                        spaceBetween: 30,
                        speed: 500,
                        navigation: {
                            nextEl: "#" + $el_id + " .products-carousel-next",
                            prevEl: "#" + $el_id + " .products-carousel-prev",
                        },
                        breakpoints: {
                            0: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            991: {
                                slidesPerView: 4,
                            },
                            1500: {
                                slidesPerView: 5,
                            },
                        }
                    });

                });


                // product single page
                var thumb_slider = new Swiper(".product-thumbnail-slider", {
                    slidesPerView: 5,
                    spaceBetween: 20,
                    // autoplay: true,
                    direction: "vertical",
                    breakpoints: {
                        0: {
                            direction: "horizontal"
                        },
                        992: {
                            direction: "vertical"
                        },
                    },
                });

                var large_slider = new Swiper(".product-large-slider", {
                    slidesPerView: 1,
                    // autoplay: true,
                    spaceBetween: 0,
                    effect: 'fade',
                    thumbs: {
                        swiper: thumb_slider,
                    },
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                });
            }

            // input spinner
            var initProductQty = function () {

                $('.product-qty').each(function () {

                    var $el_product = $(this);
                    var quantity = 0;

                    $el_product.find('.quantity-right-plus').click(function (e) {
                        e.preventDefault();
                        quantity = parseInt($el_product.find('#quantity').val());
                        $el_product.find('#quantity').val(quantity + 1);
                    });

                    $el_product.find('.quantity-left-minus').click(function (e) {
                        e.preventDefault();
                        quantity = parseInt($el_product.find('#quantity').val());
                        if (quantity > 0) {
                            $el_product.find('#quantity').val(quantity - 1);
                        }
                    });

                });

            }

            // init jarallax parallax
            var initJarallax = function () {
                jarallax(document.querySelectorAll(".jarallax"));

                jarallax(document.querySelectorAll(".jarallax-keep-img"), {
                    keepImg: true,
                });
            }

            // document ready
            $(document).ready(function () {

                initPreloader();
                initSwiper();
                initProductQty();
                initJarallax();
                initChocolat();

            }); // End of a document

        })(jQuery);

    }

    function init() {
        // loading steps component
        fetch('components/steps.html')
            .then(response => response.text())  // Converte resposta para texto
            .then(data => {
                document.getElementById('steps').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar steps:', error));

        // loading packages component
        fetch('components/packages.html')
            .then(response => response.text())  // Converte resposta para texto
            .then(data => {
                document.getElementById('packages').innerHTML = data;
                // Agora inicializa o Swiper
                loadSwiper();
            })
            .catch(error => console.error('Erro ao carregar packages:', error));

        // loading products component
        fetch('components/products.html')
            .then(response => response.text())  // Converte resposta para texto
            .then(data => {
                document.getElementById('products').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar products:', error));

        // loading hghlight component
        fetch('components/hghlight.html')
            .then(response => response.text())  // Converte resposta para texto
            .then(data => {
                document.getElementById('hghlight').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar hghlight:', error));

    }

    function baseFetch(url) {
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
    }

    function loadFetch() {

        function packages() {
            // function packages
            url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?gid=752621485&single=true&output=csv"
            baseFetch(url).then(data => {
                console.log('packages (getFetchData)', data)
                const containerPackage = document.getElementById('package-item');
                data.map((package, index) => {
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
        }

        function products() {
            // function products
            url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhopJhhHEe_UW5sWWz6cmuFHPIrKFZP7vSzGwfvsP1MZa_5uZPtiBuWnhdVip9jywh7PHyv4iNJ5PU/pub?output=csv";
            baseFetch(url).then((data) => {
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
                                <a href="javascript:void(0)" 
                                title="${product.nome_do_servico}" 
                                onclick="openModalDetailsProduct(event, '${encodeURIComponent(JSON.stringify(product))}')">
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
                                            onclick="openModalDetailsProduct(event, '${encodeURIComponent(JSON.stringify(product))}')">
                                                Reservar
                                            </a>
                                        </div>
                                        <div class="col-2">
                                            <a href="javascript:void(0)" 
                                            class="btn btn-outline rounded-1 p-2 fs-6" 
                                            onclick="addToFavorites(event, '${encodeURIComponent(JSON.stringify(product))}')">
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

        }

        function search() {
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

        }

        return [
            packages(),
            products(),
            search(),
        ]
    }

    return async function () {
        console.time('**** loadComponent ****');
        await Promise.allSettled([
            init(),
            loadFetch(),
        ]);
        console.timeEnd('**** loadComponent ****');
    };

}

const load = loadComponent();
load();