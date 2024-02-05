/* Set rates + misc */
var taxRate = 0.05;
var shippingRate = 15.00; 
var fadeTime = 300;

/* Assign actions */
$('.product-quantity input').on('input', function() { // Listen for input event
  updateQuantity(this);
});

$('.product-removal button').click( function() {
  removeItem(this);
});

/* Recalculate cart */
function recalculateCart() {
  var subtotal = 0;

  /* Sum up row totals */
  $('.product').each(function () {
      var linePrice = parseFloat($(this).find('.product-line-price').text().replace('₹', ''));
      subtotal += linePrice;
  });

  /* Calculate totals */
  var tax = subtotal * taxRate;
  var shipping = (subtotal > 0 ? shippingRate : 0);
  var total = subtotal + tax + shipping;

  /* Update totals display */
  $('#cart-subtotal').html(subtotal.toFixed(2));
  $('#cart-tax').html(tax.toFixed(2));
  $('#cart-shipping').html(shipping.toFixed(2));
  $('#cart-total').html(total.toFixed(2));
  if (total == 0) {
      $('.checkout').fadeOut(fadeTime);
  } else {
      $('.checkout').fadeIn(fadeTime);
  }
}

/* Update quantity */
function updateQuantity(quantityInput) {
  /* Calculate line price */
  var productRow = $(quantityInput).closest('.product');
  var price = parseFloat(productRow.find('.product-price').text().replace('₹', ''));
  var quantity = parseInt($(quantityInput).val());
  var linePrice = price * quantity;

  /* Update line price display and recalc cart totals */
  productRow.find('.product-line-price').html('₹' + linePrice.toFixed(2));
  recalculateCart();
}

/* Remove item from cart */
function removeItem(removeButton) {
  /* Remove row from DOM and recalc cart total */
  var productRow = $(removeButton).parent().parent();
  productRow.slideUp(fadeTime, function() {
    productRow.remove();
    recalculateCart();
  });
}
