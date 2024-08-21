const sellerName = "HARVIN FASHION";
const sellerDetails = "Your Company Address, +91 9799117737";

let items = JSON.parse(localStorage.getItem('items')) || [];

function addItem() {
    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    if (!price) {
        alert('Please enter the price.');
        return;
    }

    const discountedPrice = price - (price * (discount / 100));
    const itemDetails = {
        item: item,
        price: price,
        discount: discount,
        discountedPrice: discountedPrice
    };

    items.push(itemDetails);
    localStorage.setItem('items', JSON.stringify(items));
    updateItemList();
    generateBill();  // Re-generate the bill every time an item is added
}

function updateItemList() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.item} - Price: ₹${item.price}, Discount: ${item.discount}%, Total: ₹${item.discountedPrice.toFixed(2)}`;
        itemList.appendChild(listItem);
    });
}

function generateBill() {
    const buyerName = document.getElementById('buyerName').value;
    const buyerContact = document.getElementById('buyerContact').value;


    const totalBill = items.reduce((sum, item) => sum + item.discountedPrice, 0).toFixed(2);

    let billDetails = `
        <table>
            <thead>
                <tr>
                    <th colspan="4">Billing System</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4">${sellerName}</td>
                </tr>
                <tr>
                    <td colspan="4">${sellerDetails}</td>
                </tr>
                <tr>
                    <td><strong>Buyer Name:</strong></td>
                    <td colspan="3">${buyerName}</td>
                </tr>
                ${buyerContact ? `<tr><td><strong>Buyer Contact Number:</strong></td><td colspan="3">${buyerContact}</td></tr>` : ''}
                <tr>
                    <th>Item</th>
                    <th>Price (₹)</th>
                    <th>Discount (%)</th>
                    <th>Total (₹)</th>
                </tr>
    `;

    items.forEach(item => {
        billDetails += `
            <tr>
                <td>${item.item}</td>
                <td>₹${item.price}</td>
                <td>${item.discount}%</td>
                <td>₹${item.discountedPrice.toFixed(2)}</td>
            </tr>
        `;
    });

    billDetails += `
                <tr>
                    <td colspan="3"><strong>Total Bill:</strong></td>
                    <td>₹${totalBill}</td>
                </tr>
            </tbody>
        </table>
    `;

    document.getElementById('billOutput').innerHTML = billDetails;
}

function exportBillAsImage() {
    const buyerName = document.getElementById('buyerName').value || 'bill';
    const billOutput = document.getElementById('billOutput');

    html2canvas(billOutput).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${buyerName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function clearBill() {
    // Clear the form inputs
    document.getElementById('buyerName').value = '';
    document.getElementById('buyerContact').value = '';
    document.getElementById('price').value = '';
    document.getElementById('discount').value = '';
    document.getElementById('item').value = 'Top';

    // Clear the item list
    items = [];
    localStorage.removeItem('items');
    updateItemList();

    // Clear the bill output
    document.getElementById('billOutput').innerHTML = '';
}

// Initialize the item list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateItemList();
});
