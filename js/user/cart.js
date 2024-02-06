/* Set rates + misc */
var taxRate = 0.05;
var shippingRate = 15.00; 
var fadeTime = 300;

// Function to calculate cart totals based on rendered data
function recalculateCart() {
    var subtotal = 0;
    
    /* Sum up row totals */
    $('.product').each(function () {
        var quantity = parseInt($(this).find('.product-quantity input').val());
        var price = parseFloat($(this).find('.product-price').text().replace('₹', ''));
        var linePrice = price * quantity;
        subtotal += linePrice;
        
        // Update product-line-price with calculated line price
        $(this).find('.product-line-price').text('₹' + linePrice.toFixed(2));
    });

    /* Calculate totals */
    var tax = subtotal * taxRate;
    var shipping = (subtotal > 0 ? shippingRate : 0);
    var total = subtotal + tax + shipping;

    /* Update totals display */
    $('#cart-subtotal').text('₹' + subtotal.toFixed(2));
    $('#cart-tax').text('₹' + tax.toFixed(2));
    $('#cart-shipping').text('₹' + shipping.toFixed(2));
    $('#cart-total').text('₹' + total.toFixed(2));
    if (total == 0) {
        $('.checkout').fadeOut(fadeTime);
    } else {
        $('.checkout').fadeIn(fadeTime);
    }
}

// Call recalculateCart() when the page loads
$(document).ready(function() {
    recalculateCart();
});

// Assign action to input change event
$('.product-quantity input').on('input', function() {
    recalculateCart();
});
