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
    <div class="image-container">
        <img src="${product.image}" alt="${product.name}">
        <p class="price">
            <span>Price:</span><br><br>
            GH₵ ${product.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}
        </p>
    </div>
    <h3>${product.name}</h3>
    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">
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
            <td>GH${item.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>

            <td>
                <button class="qty-btn" 
                style="background-color: #ff7a00; 
                color: white;
                border: none;
                border-radius: 4px;" 
                onclick="decreaseQty(${index})">-</button>

                ${item.quantity}

                <button class="qty-btn" 
                style="background-color: #ff7a00; 
                color: white;
                border: none;
                border-radius: 4px;"" 
                onclick="increaseQty(${index})">+</button>
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

    cartTotal.textContent = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

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
customerForm.addEventListener("submit", payWithPaystack);

const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const formatReceiptItems = () => {
    return cart.map(item => {
        const lineTotal = item.price * item.quantity;

        return {
            display_name: `${item.name} (Qty: ${item.quantity})`,
            variable_name: `item_${item.name.toLowerCase()}`,
            value: `${item.quantity} x GHS ${item.price.toLocaleString()} = GHS ${lineTotal.toLocaleString()}`
        };
    });
};

const resetCart = () => {
    cart.length = 0;
    cartItems.innerHTML = "";
    cartTotal.textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
};

function payWithPaystack(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerEmail = document.getElementById("customerEmail").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();


  if (!customerName || !customerEmail || !customerPhone) {
    alert("Please fill in all customer details before checkout.");
    return;
  }
    
  const totalAmount = getCartTotal();
  const receiptItems = formatReceiptItems();

  const handler = PaystackPop.setup({
    key: 'pk_test_6e3d2fe7483dd85f858e167dfadb0fc087f97534',
    email: customerEmail,
    amount: totalAmount * 100,
    currency: 'GHS',
    ref: 'EXE_ECOMMERCE_' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: customerName
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: customerPhone
        },
        {
          display_name: "Items Purchased",
          variable_name: "items_purchased",
          value: cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
        },
        {
          display_name: "Order Total",
          variable_name: "order_total",
          value: `GHS ${totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        },
        ...receiptItems
      ]
    },
    callback: function(response) {
      console.log('Payment successful. Reference: ' + response.reference);
      resetCart();
      customerForm.reset();
      cartModal.style.display = "none";
      alert('Payment successful! Reference: ' + response.reference + '\nThank you for your purchase, ' + customerName + '!' + '\n' + receiptItems.map(item => item.value).join('\n'));
    },
    onClose: function() {
      alert('Payment window closed by user.');
    }
  });

  handler.openIframe();
};