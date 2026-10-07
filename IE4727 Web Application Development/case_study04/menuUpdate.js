var menu = document.getElementById("menu");

menu.addEventListener("change", priceChange, false);

function priceChange(event) {
    console.log("Something Changed");
    var menu = event.target;
    var menuItem = menu.closest(".menu-item");
    var menuName = menuItem.querySelector(".menu-name h3").textContent;
    var menuQty = menuItem.querySelector("#menuQty").value;
    var menuShot = menuItem.querySelector("input[name='menuShot']:checked")
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
            console.log("Price: $2.00");
            menuPrice = 2.00 * menuQty;
        case ("Cafe au Lait"):
            if (menuShot == "single") {
                console.log("Price: $2.00");
                menuPrice = 2.00 * menuQty;
            }
            else if (menuShot == "double") {
                console.log("Price: $3.00");
                menuPrice = 3.00 * menuQty;
            } break;
        case ("Iced Cappuccino"):
            if (menuShot == "single") {
                console.log("Price: $4.75");
                menuPrice = 4.75 * menuQty;
            }
            else if (menuShot == "double") {
                console.log("Price: $5.75");
                menuPrice = 5.75 * menuQty;
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