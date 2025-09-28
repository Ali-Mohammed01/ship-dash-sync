// Payment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    initializePaymentForm();
});

// Load order data from URL parameters
function loadOrderData() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    console.log('URL params:', urlParams.toString());
    console.log('Data param:', dataParam);
    
    if (dataParam) {
        try {
            const requestData = JSON.parse(decodeURIComponent(dataParam));
            console.log('Parsed request data:', requestData);
            displayOrderSummary(requestData);
        } catch (error) {
            console.error('Error parsing order data:', error);
            if (window.FuelShipmentSystem && window.FuelShipmentSystem.showToast) {
                window.FuelShipmentSystem.showToast('خطأ في تحميل بيانات الطلب', 'error');
            }
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }
    } else {
        console.log('No data parameter found');
        if (window.FuelShipmentSystem && window.FuelShipmentSystem.showToast) {
            window.FuelShipmentSystem.showToast('لا توجد بيانات طلب', 'error');
        }
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

// Display order summary
function displayOrderSummary(requestData) {
    document.getElementById('orderFuelType').textContent = requestData.fuelType;
    document.getElementById('orderQuantity').textContent = `${requestData.quantity} لتر`;
    document.getElementById('orderStation').textContent = requestData.targetStation;
    
    const totalCost = FuelShipmentSystem.calculateCost(requestData.quantity);
    document.getElementById('totalCost').textContent = `$${totalCost}`;
    
    // Update pay button text
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.innerHTML = `<span id="payButtonText">دفع $${totalCost}</span>`;
    }
    
    // Store request data for payment processing
    window.currentRequestData = requestData;
}

// Initialize payment form
function initializePaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }
}

// Handle payment form submission
function handlePayment(event) {
    event.preventDefault();
    
    if (!FuelShipmentSystem.validateForm('paymentForm')) {
        FuelShipmentSystem.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (!window.currentRequestData) {
        FuelShipmentSystem.showToast('لا توجد بيانات طلب للدفع', 'error');
        return;
    }
    
    // Get payment details
    const paymentDetails = {
        holderName: document.getElementById('holderName').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
    };
    
    // Validate card number (basic validation)
    if (!validateCardNumber(paymentDetails.cardNumber)) {
        FuelShipmentSystem.showToast('رقم البطاقة غير صحيح', 'error');
        return;
    }
    
    // Validate expiry date
    if (!validateExpiryDate(paymentDetails.expiryDate)) {
        FuelShipmentSystem.showToast('تاريخ الانتهاء غير صحيح', 'error');
        return;
    }
    
    // Validate CVV
    if (!validateCVV(paymentDetails.cvv)) {
        FuelShipmentSystem.showToast('رمز الأمان غير صحيح', 'error');
        return;
    }
    
    // Process payment
    if (window.FuelShipmentSystem && window.FuelShipmentSystem.processPayment) {
        window.FuelShipmentSystem.processPayment(window.currentRequestData, function(newRequest) {
            console.log('Payment processed successfully:', newRequest);
        });
    } else {
        console.error('FuelShipmentSystem not available');
        FuelShipmentSystem.showToast('خطأ في النظام', 'error');
    }
}

// Validate card number
function validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
}

// Validate CVV
function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Make functions globally available
window.handlePayment = handlePayment;
