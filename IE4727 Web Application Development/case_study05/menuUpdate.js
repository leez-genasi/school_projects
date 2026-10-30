let data;
async function getMenu() {
    try {
        const response = await fetch("get_menu.php");
        data = await response.json();
        return data
    } catch (error) {
        console.log(error);
    }
}
getMenu();

var menu = document.getElementById("menu");

menu.addEventListener("change", priceChange, false);

function priceChange(event) {
    var menu = event.target;
    var menuItem = menu.closest(".menu-item");
    console.log("Something Changed");
    var menu = event.target;
    if (menuShot != null) {
        menuShot = menuShot.value;
    }
    var menuChange = menuItem.querySelector(".menuPrice");
    var pos = /^[0-9]*$/.test(menu);

    var menuPrice = 0.00;
    if (pos!=0) {
        alert("Please enter a valid number.")
        menuChange.focus();
        return false;
    }
    switch (menuName) {
        case ("Just Java"):
            console.log("Price: ", data[0].price)
            menuPrice = data[0].price * menuQty;
        case ("Cafe au Lait"):
            if (menuShot == "single") {
                // console.log("Price: $2.00");
                menuPrice = data[1].single_price * menuQty;
            }
            else if (menuShot == "double") {
                // console.log("Price: $3.00");
                menuPrice = data[1].double_price * menuQty;
            } break;
        case ("Iced Cappuccino"):
            if (menuShot == "single") {
                // console.log("Price: $4.75");
                menuPrice = data[2].single_price * menuQty;
            }
            else if (menuShot == "double") {
                // console.log("Price: $5.75");
                menuPrice = data[2].double_price * menuQty;
            } break;
    }
    menuChange.textContent = "$"+parseFloat(menuPrice).toFixed(2);

    calcTotal();
}

function calcTotal() {
    const indivPrice = document.querySelectorAll(".menuPrice");
    var sum = 0.00;
    indivPrice.forEach((indivPrice, index) => {
        indivPriceNo = parseFloat(indivPrice.textContent.match(/[0-9]+(\.?[0-9]+)?/))
        console.log(indivPriceNo);
        if (!Number.isNaN(indivPriceNo)) sum+= indivPriceNo;
    })

    console.log(sum);
    document.getElementById("totalPrice").textContent = "$"+parseFloat(sum).toFixed(2);
}

document.getElementById('checkoutBtn').addEventListener("click", async() => {
    console.log("Check Out");
    const order = [];
    var menu = document.querySelectorAll(".menu-item");
    menu.forEach(item => {
        const qty = item.querySelector(".menuQty").value;
        if (qty < 1 || !qty ) { return; }
        const shot = item.querySelector("input[name='menuShot']:checked");
        const price = parseFloat(item.querySelector(".menuPrice").textContent.match(/[0-9]+(\.?[0-9]+)?/));
        order.push({
            id: item.dataset.id,
            shot: shot ? shot.value : null,
            qty: qty,
            price: price,
        })
    });
    if (order.length === 0) { alert("Please select at least one item."); }

    const res = await fetch("checkout.php", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order })
    })
    const data = await res.json();
    alert(data.success ? "Order placed!" : "Error: " + data.error + "Order not placed.")
})