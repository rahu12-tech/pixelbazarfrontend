# Backend Requirements for Enhanced Return & Delivery System

## 🔄 **Return Management System**

### 1. **Return Request API**
```python
# URL: /api/orders/<order_id>/return/
# Method: POST
def request_return(request, order_id):
    # Validate return eligibility
    # Create return record with tracking
    # Send return confirmation email
    pass
```

### 2. **Return Tracking API**
```python
# URL: /api/returns/<return_id>/track/
# Method: GET
def track_return(request, return_id):
    # Return tracking stages like Flipkart:
    # 1. Return Requested
    # 2. Pickup Scheduled  
    # 3. Item Picked Up
    # 4. Quality Check
    # 5. Refund Processed
    pass
```

### 3. **Database Models to Add/Update**

#### **Return Model**
```python
class Return(models.Model):
    return_id = models.CharField(max_length=20, unique=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=[
        ('requested', 'Return Requested'),
        ('pickup_scheduled', 'Pickup Scheduled'),
        ('picked_up', 'Item Picked Up'),
        ('quality_check', 'Quality Check'),
        ('approved', 'Return Approved'),
        ('rejected', 'Return Rejected'),
        ('refund_processed', 'Refund Processed')
    ])
    requested_at = models.DateTimeField(auto_now_add=True)
    pickup_date = models.DateTimeField(null=True, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
```

#### **Product Model Updates**
```python
class Product(models.Model):
    # Existing fields...
    return_policy_days = models.IntegerField(default=0)  # 0 = No return
    return_policy_details = models.TextField(blank=True)
    free_delivery_eligible = models.BooleanField(default=False)
```

#### **User Model Updates**
```python
class User(models.Model):
    # Existing fields...
    account_created_at = models.DateTimeField(auto_now_add=True)
    free_delivery_days_left = models.IntegerField(default=2)
```

## 🚚 **Delivery Charge System**

### 1. **Delivery Calculation API**
```python
# URL: /api/calculate-delivery/
# Method: POST
def calculate_delivery_charges(request):
    user = request.user
    pincode = request.data.get('pincode')
    
    # Check if user has free delivery days left
    days_since_signup = (timezone.now() - user.account_created_at).days
    
    if days_since_signup <= 2:
        return JsonResponse({'delivery_charge': 0, 'message': 'Free delivery'})
    
    # Calculate distance-based charges
    distance = calculate_distance_from_pincode(pincode)
    charge = calculate_charge_by_distance(distance)
    
    return JsonResponse({'delivery_charge': charge, 'distance': distance})
```

### 2. **Distance Calculation Function**
```python
def calculate_distance_from_pincode(pincode):
    # Use Google Maps API or similar
    # Calculate distance from warehouse to delivery pincode
    pass

def calculate_charge_by_distance(distance_km):
    if distance_km <= 50:
        return 40
    elif distance_km <= 100:
        return 60
    elif distance_km <= 200:
        return 80
    else:
        return 100
```

## 📱 **Product Details Enhancement**

### 1. **Product Detail API Update**
```python
# URL: /api/products/<product_id>/
def get_product_detail(request, product_id):
    product = Product.objects.get(id=product_id)
    
    return JsonResponse({
        'product': {
            # Existing fields...
            'return_policy': {
                'days': product.return_policy_days,
                'details': product.return_policy_details,
                'eligible': product.return_policy_days > 0
            },
            'delivery_info': {
                'free_delivery_eligible': product.free_delivery_eligible,
                'delivery_text': f"Free delivery & return in {product.return_policy_days} days" if product.return_policy_days > 0 else "No return policy"
            }
        }
    })
```

## 🔧 **URLs to Add**
```python
# In urls.py
urlpatterns = [
    # Existing URLs...
    
    # Return Management
    path('orders/<str:order_id>/return/', views.request_return, name='request_return'),
    path('returns/<str:return_id>/track/', views.track_return, name='track_return'),
    path('returns/<str:return_id>/update-status/', views.update_return_status, name='update_return_status'),
    
    # Delivery Management
    path('calculate-delivery/', views.calculate_delivery_charges, name='calculate_delivery'),
    path('user/delivery-status/', views.get_user_delivery_status, name='user_delivery_status'),
]
```

## 📧 **Email Templates to Create**
1. **Return Request Confirmation**
2. **Return Status Updates**
3. **Refund Processed Notification**

## 🎯 **Admin Panel Updates Needed**
1. **Return Management Dashboard**
2. **Return Status Update Interface**
3. **Delivery Charge Configuration**
4. **Product Return Policy Settings**

## 🔄 **Migration Commands**
```bash
python manage.py makemigrations
python manage.py migrate
```

## 📊 **Testing Checklist**
- [ ] Return request creation
- [ ] Return tracking updates
- [ ] Delivery charge calculation
- [ ] Free delivery validation
- [ ] Product return policy display
- [ ] Email notifications