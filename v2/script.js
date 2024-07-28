document.addEventListener('DOMContentLoaded', () => {
    const billForm = document.getElementById('bill-form');
    const addItemButton = document.getElementById('add-item');
    const billItemsContainer = document.getElementById('bill-items');
    const billOutput = document.getElementById('bill-output');
    const savePdfButton = document.getElementById('save-pdf');
    const currencyForm = document.getElementById('currency-form');
    const conversionResult = document.getElementById('conversion-result');

    const updateSavePdfButtonState = () => {
        savePdfButton.disabled = !billOutput.innerHTML.trim();
    };

    addItemButton.addEventListener('click', () => {
        const billItem = document.createElement('div');
        billItem.classList.add('bill-item');
        billItem.innerHTML = `
            <input type="text" name="item-description" placeholder="Description" required>
            <input type="number" name="item-quantity" placeholder="Quantity" required>
            <input type="number" name="item-price" placeholder="Price" required>
            <button type="button" class="remove-item">Remove</button>
        `;
        billItemsContainer.appendChild(billItem);

        billItem.querySelector('.remove-item').addEventListener('click', () => {
            billItem.remove();
        });

        updateSavePdfButtonState();
    });

    billForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const clientName = document.getElementById('client-name').value;
        const clientAddress = document.getElementById('client-address').value;
        const clientEmail = document.getElementById('client-email').value;
        const billDate = document.getElementById('bill-date').value;
        const dueDate = document.getElementById('due-date').value;
        const notes = document.getElementById('notes').value;
        const currency = document.getElementById('currency').value;
        const billItems = Array.from(document.querySelectorAll('#bill-items .bill-item')).map(item => ({
            description: item.querySelector('input[name="item-description"]').value,
            quantity: item.querySelector('input[name="item-quantity"]').value,
            price: item.querySelector('input[name="item-price"]').value
        }));

        let totalAmount = 0;
        const billHtml = `
            <h2>Bill</h2>
            <p><strong>Client Name:</strong> ${clientName}</p>
            <p><strong>Client Address:</strong> ${clientAddress}</p>
            <p><strong>Client Email:</strong> ${clientEmail}</p>
            <p><strong>Bill Date:</strong> ${billDate}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Currency:</strong> ${currency}</p>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${billItems.map(item => {
                        const total = item.quantity * item.price;
                        totalAmount += total;
                        return `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price}</td>
                                <td>${total.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">Total Amount</td>
                        <td>${totalAmount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        `;

        billOutput.innerHTML = billHtml;
        updateSavePdfButtonState();
    });

    savePdfButton.addEventListener('click', () => {
        const element = document.getElementById('bill-output');
        html2pdf().from(element).save();
    });

    currencyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;

        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);

            conversionResult.innerHTML = `<p>${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}</p>`;
        } catch (error) {
            conversionResult.innerHTML = `<p>Error: Unable to fetch conversion rate.</p>`;
        }
    });
});
