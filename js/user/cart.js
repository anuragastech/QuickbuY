 // Set rates + misc
  var taxRate = 0.05;
  var shippingRate = 15.00;
  var fadeTime = 300;

  // Function to calculate cart totals based only on selected items
  function recalculateSelectedCart() {
    var subtotal = 0;
    /* Sum up row totals for selected items only */
    $('.product input[type="checkbox"]:checked').each(function() {
      var productId = $(this).attr('id').replace('select-product-', '');
      var quantity = parseInt($('#quantity-' + productId).val());
      var price = parseFloat($('#quantity-' + productId).parent().siblings('.product-price').text().replace('₹', ''));
      var linePrice = price * quantity;
      subtotal += linePrice;
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
  // Call recalculateSelectedCart() when the page loads
  $(document).ready(function() {
    recalculateSelectedCart();
  });

  // Assign action to input change event
  $('.product-quantity input').on('input', function() {
    recalculateSelectedCart();
  });