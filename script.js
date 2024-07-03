document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies();
    VanillaTilt.init(document.querySelector(".container"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });
    AOS.init();
});

const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$', SGD: 'S$', JPY: '¥', CNY: '¥',
};

async function fetchCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.text = `${currencySymbols[currency] || ''} ${currency}`;
        fromCurrency.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.text = `${currencySymbols[currency] || ''} ${currency}`;
        toCurrency.appendChild(option2);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
}

async function convert() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (amount === '' || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    const rate = data.rates[toCurrency];
    const result = amount * rate;

    document.getElementById('result').innerText = `${amount} ${currencySymbols[fromCurrency] || fromCurrency} = ${result.toFixed(2)} ${currencySymbols[toCurrency] || toCurrency}`;
}
