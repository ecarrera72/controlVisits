document.addEventListener( 'DOMContentLoaded', () => {
    const buttonCart = document.getElementById('divArticles');

    buttonCart.addEventListener( 'click', event => {
        if (event.target.tagName == 'BUTTON') {
            let data = {
                product_id: event.target.dataset.id,
                amount: 1,
                unit_price: event.target.dataset.price,
                total_price: event.target.dataset.price
            }

            let http = new XMLHttpRequest();
            http.open('POST', '/shop/shoppingCart', true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.send( JSON.stringify(data) );
        }

    });
});