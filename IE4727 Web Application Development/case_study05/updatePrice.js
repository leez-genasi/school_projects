document.getElementById('resetPrice').addEventListener('click', e => {
    location.reload();
})

document.getElementById('updatePrice').addEventListener('click', async() => {
    console.log("Update Price");
    var menu = document.querySelectorAll(".menu-item");
    price = []
    menu.forEach(item => {
        const singlePrice = item.querySelector(".singlePrice");
        const doublePrice = item.querySelector(".doublePrice");
        const menuPrice = item.querySelector(".menuPrice");
        price.push({
            id: item.dataset.id,
            singlePrice: singlePrice ? singlePrice.value : null,
            doublePrice: doublePrice ? doublePrice.value : null,
            menuPrice: menuPrice ? menuPrice.value : null
        })
    });

    const res = await fetch("update.php", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price })
    });
    const data = await res.json();
    alert(data.success ? "Prices Updated!" : "Error: " + data.error + "Prices not updated.")
})