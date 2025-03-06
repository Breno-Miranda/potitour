
// loading head layout
fetch('layout/head.html')
    .then(response => response.text())  // Converte resposta para texto
    .then(data => {
        document.getElementById('head').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar head:', error));


// loading footer layout
fetch('layout/footer.html')
    .then(response => response.text())  // Converte resposta para texto
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar footer:', error));