const cart = [];

const cartModal = document.getElementById("cartModal");
const cartIcon = document.getElementById("cartImg");
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const continueShoping = document.getElementById("continueShopping");
const checkOut = document.getElementById("checkout");

const products = [{
        index: 1,
        id: 'p1',
        name: 'Samsung TV',
        price: 500000,
        image: "images/product1.png"
    },
    {
        index: 2,
        id: 'p2',
        name: 'Pixel 4a',
        price: 250000,
        image: "images/product2.png"
    },
    {
        index: 3,
        id: 'p3',
        name: 'PS 5',
        price: 300000,
        image: "images/product3.png"
    },
    {
        index: 4,
        id: 'p4',
        name: 'MacBook Air',
        price: 800000,
        image: "images/product4.png"
    },
    {
        index: 5,
        id: 'p5',
        name: 'Apple Watch',
        price: 95000,
        image: "images/product5.png"
    },
    {
        index: 6,
        id: 'p6',
        name: 'Air Pods',
        price: 75000,
        image: "images/product6.png"
    },

]
products.forEach(product => {
    
    const card = document.createElement("div");

    card.classList.add("product-card");

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}"
        >
        ADD TO CART
        </button>
    `;
    productGrid.appendChild(card);
});

const buttons = document.querySelectorAll(".add-to-cart");

cartIcon.addEventListener("click", () => {
    cartModal.style.display = "flex";
});


continueShoping.addEventListener("click", () => {
    cartModal.style.display = "none";
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const productName = button.dataset.name;
        const productPrice = Number(button.dataset.price);
        
        addToCart(productName, productPrice);
    });
});

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
};
const removeItem = (index) => {

    cart.splice(index, 1);

    renderCart();
};
const confirmBeforeremoveItem = (index) => {

    const confirmed = confirm(
        "Remove this item from the cart?"
    );

    if (confirmed) {
        cart.splice(index, 1);
        renderCart();
    }
};
const addToCart = (name, price) => {

    const existingItem = cart.find(item => item.name === name);

    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({name, price, quantity: 1});
    }
    renderCart();
};
const updateCartCount = () => {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 
        0
    );

    document.getElementById("cart-count").textContent = count;
};
const increaseQty = (index) => {

    cart[index].quantity++;

    renderCart();
};
const decreaseQty = (index) => {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        removeItem(index);

        return;
    }

    renderCart();
};

const customerForm = document.getElementById("customerForm");
customerForm.addEventListener("submit", checkout);

const checkout = (event) => {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }
    
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const order = {
        customer: {
            name: name,
            email: email,
            phone: phone
        },
        items: [...cart],
        total,
        orderDate: new Date().toLocaleDateString()
    };
    localStorage.setItem(
        "latestOrder", 
        JSON.stringify(order)
    );
    alert(
        `Thank you ${name}!\n\nYour order total is $${total}`
    );

    renderCart();
    customerForm.reset();
    cartModal.style.display = "none";

}; 