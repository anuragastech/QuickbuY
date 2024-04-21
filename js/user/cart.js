  // Set rates + misc
  var taxRate = 0.05;
  var shippingRate = 15.00;
  var fadeTime = 300;

  // Function to calculate cart totals based on selected items only
  function recalculateSelectedCart() {
      var subtotal = 0;
      var atLeastOneSelected = false; // Flag to check if at least one product is selected

      /* Sum up row totals for selected items only */
      $('tbody .product input[type="number"]').each(function() {
          var productId = $(this).attr('id').replace('quantity-', '');
          var quantity = parseInt($(this).val());
          var price = parseFloat($(this).closest('tr').find('.product-price').text().replace('₹', ''));
          var linePrice = price * quantity;
          subtotal += linePrice;

          // Update the line total for this product
          $(this).closest('tr').find('.product-line-price').text('₹' + linePrice.toFixed(2));
          atLeastOneSelected = true; // Set flag to true as at least one product is selected
      });

      if (atLeastOneSelected) { // If at least one product is selected, show the subtotal and other totals
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
      } else { // If no product is selected, hide the subtotal and other totals
          $('#cart-subtotal').text('₹0.00');
          $('#cart-tax').text('₹0.00');
          $('#cart-shipping').text('₹0.00');
          $('#cart-total').text('₹0.00');
          $('.checkout').fadeOut(fadeTime);
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