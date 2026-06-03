// Configuração das moedas, incluindo a Libra Esterlina (GBP)
const currencyConfig = {
    BRL: {
        name: "Real",
        flag: "https://flagcdn.com/w80/br.png",
        locale: "pt-BR",
        currencyCode: "BRL",
        defaultSymbol: "R$ 0,00"
    },
    USD: {
        name: "Dólar Americano",
        flag: "https://flagcdn.com/w80/us.png",
        locale: "en-US",
        currencyCode: "USD",
        defaultSymbol: "US$ 0,00"
    },
    EUR: {
        name: "Euro",
        flag: "https://flagcdn.com/w80/eu.png",
        locale: "de-DE",
        currencyCode: "EUR",
        defaultSymbol: "€ 0,00"
    },
    GBP: {
        name: "Libra Esterlina",
        flag: "https://flagcdn.com/w80/gb.png", // Bandeira do Reino Unido
        locale: "en-GB",
        currencyCode: "GBP",
        defaultSymbol: "£ 0,00"
    }
};

// Elementos do DOM
const convertButton = document.getElementById("convert-button");
const currencyFromSelect = document.getElementById("currency-from");
const currencyToSelect = document.getElementById("currency-to");
const amountInput = document.getElementById("amount");

// Elementos visuais
const flagFrom = document.getElementById("flag-from");
const nameFrom = document.getElementById("name-from");
const valueFrom = document.getElementById("value-from");

const flagTo = document.getElementById("flag-to");
const nameTo = document.getElementById("name-to");
const valueTo = document.getElementById("value-to");

// MUDANÇA EM TEMPO REAL: Atualiza a bandeira e nome assim que o select muda
function updateCurrencyInterface() {
    const fromSelected = currencyFromSelect.value;
    const toSelected = currencyToSelect.value;

    // Atualiza lado de Origem (DE)
    flagFrom.src = currencyConfig[fromSelected].flag;
    nameFrom.innerText = currencyConfig[fromSelected].name;
    valueFrom.innerText = currencyConfig[fromSelected].defaultSymbol; // Reseta o valor visual para evitar confusão antes de converter
    
    // Atualiza lado de Destino (PARA)
    flagTo.src = currencyConfig[toSelected].flag;
    nameTo.innerText = currencyConfig[toSelected].name;
    valueTo.innerText = currencyConfig[toSelected].defaultSymbol;
}

// Função de Conversão principal acionada pelo botão
async function convertValues() {
    const fromValue = currencyFromSelect.value;
    const toValue = currencyToSelect.value;
    const inputValue = parseFloat(amountInput.value);

    if (isNaN(inputValue) || inputValue <= 0) {
        alert("Por favor, insira um valor válido maior que zero.");
        return;
    }

    if (fromValue === toValue) {
        formatAndDisplay(inputValue, inputValue, fromValue, toValue);
        return;
    }

    try {
        // Busca cotação em tempo real na API pública
        const response = await fetch(`https://economia.awesomeapi.com.br/last/${fromValue}-${toValue}`);
        
        if (!response.ok) {
            throw new Error("Par de conversão não disponível no momento.");
        }

        const data = await response.json();
        const key = `${fromValue}${toValue}`;
        const exchangeRate = parseFloat(data[key].bid);

        const convertedValue = inputValue * exchangeRate;

        formatAndDisplay(inputValue, convertedValue, fromValue, toValue);

    } catch (error) {
        console.error("Erro na conversão:", error);
        alert("Não foi possível conectar à API de moedas. Verifique sua conexão.");
    }
}

// Formatação do texto final em formato de moeda local
function formatAndDisplay(inputVal, convertedVal, fromKey, toKey) {
    const configFrom = currencyConfig[fromKey];
    const configTo = currencyConfig[toKey];

    valueFrom.innerText = inputVal.toLocaleString(configFrom.locale, {
        style: "currency",
        currency: configFrom.currencyCode
    });

    valueTo.innerText = convertedVal.toLocaleString(configTo.locale, {
        style: "currency",
        currency: configTo.currencyCode
    });
}

// Ouvintes de eventos para mudança em TEMPO REAL
currencyFromSelect.addEventListener("change", updateCurrencyInterface);
currencyToSelect.addEventListener("change", updateCurrencyInterface);

// Ouvinte de evento para o BOTÃO de conversão
convertButton.addEventListener("click", convertValues);

// Inicializa as bandeiras corretas assim que a página abre
updateCurrencyInterface();