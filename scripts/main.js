
const cartModal = document.getElementById("cartModal");
const cartIcon = document.getElementById("cartImg");
const closeBtn = document.getElementById("close-cart");

cartIcon.addEventListener("click", () => {
    cartModal.style.display = "flex";
});

console.log(cartIcon);
console.log(cartModal);
console.log(closeBtn);

const renderCart = () => {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>$${item.price}</td>

            <td>
                <button class="qty-btn" onclick="decreaseQty(${index})">-</button>

                ${item.quantity}

                <button class="qty-btn" onclick="increaseQty(${index})">+</button>
            </td>

            <td>
                <button class="remove-btn"
                    onclick="removeItem(${index})">
                    Remove
                </button>
            </td>
        `;

        cartItems.appendChild(row);
    });

    cartTotal.textContent = total;

    updateCartCount();
}
const removeItem = (index) => {

    cart.splice(index, 1);

    renderCart();
}
