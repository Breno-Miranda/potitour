// loading icon component
fetch('helps/icons.html')
    .then(response => response.text())  // Converte resposta para texto
    .then(data => {
        document.getElementById('icons').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar icons:', error));

// function base fetch
function getFetchData(url) {
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
