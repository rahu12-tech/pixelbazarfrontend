# Add this line to your Django backend urls.py file:

# In your urlpatterns list, add:
path('coupons/apply/', views.apply_coupon, name='apply_coupon'),

# You also need to create the apply_coupon view function in your views.py:

"""
def apply_coupon(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            coupon_code = data.get('code')
            order_amount = data.get('orderAmount', 0)
            
            # Get coupon from database
            coupon = Coupon.objects.get(code=coupon_code, is_active=True)
            
            # Check if coupon is valid
            if coupon.min_amount > order_amount:
                return JsonResponse({
                    'success': False,
                    'message': f'Minimum order amount should be ₹{coupon.min_amount}'
                })
            
            # Calculate discount
            discount = min(
                (order_amount * coupon.discount_percentage) / 100,
                coupon.max_discount
            )
            
            return JsonResponse({
                'success': True,
                'discount': discount,
                'coupon': {
                    'code': coupon.code,
                    'title': coupon.title,
                    'discount_percentage': coupon.discount_percentage
                },
                'message': f'Coupon applied successfully! You saved ₹{discount}'
            })
            
        except Coupon.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid coupon code'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to apply coupon'
            })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'})
"""