// Fuel Shipment System - Main JavaScript

// Global variables
let shipmentRequests = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadShipmentRequests();
    initializeEventListeners();
    initializeAnimations();
    
    // Wait a bit for all elements to be ready
    setTimeout(() => {
        console.log('FuelShipmentSystem initialized');
    }, 100);
});

// Initialize animations and interactions
function initializeAnimations() {
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(30, 58, 138, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(30, 58, 138, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });
    
    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

// Load shipment requests from localStorage
function loadShipmentRequests() {
    const saved = localStorage.getItem('shipmentRequests');
    if (saved) {
        shipmentRequests = JSON.parse(saved);
    }
    console.log('Loaded shipment requests:', shipmentRequests);
}

// Save shipment requests to localStorage
function saveShipmentRequests() {
    localStorage.setItem('shipmentRequests', JSON.stringify(shipmentRequests));
}

// Generate unique ID
function generateId() {
    return 'REQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status color class
function getStatusColor(status) {
    const statusColors = {
        'Pending': 'status-pending',
        'Accepted': 'status-accepted',
        'Rejected': 'status-rejected',
        'Received': 'status-received',
        'On the Way': 'status-on-the-way',
        'Delivered': 'status-delivered',
        'Confirmed': 'status-confirmed'
    };
    return statusColors[status] || 'status-pending';
}

// Get status text in Arabic
function getStatusText(status) {
    const statusTexts = {
        'Pending': 'في الانتظار',
        'Accepted': 'مقبول',
        'Rejected': 'مرفوض',
        'Received': 'تم الاستلام',
        'On the Way': 'في الطريق',
        'Delivered': 'تم التسليم',
        'Confirmed': 'مؤكد'
    };
    return statusTexts[status] || status;
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
        <div class="toast-body d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;

    // Add to container
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Update request status
function updateRequestStatus(id, status) {
    console.log('Updating request status:', id, status);
    const requestIndex = shipmentRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
        shipmentRequests[requestIndex].status = status;
        saveShipmentRequests();
        
        console.log('Updated shipment requests:', shipmentRequests);
        
        // Show success message
        showToast(`تم تحديث حالة الطلب إلى: ${getStatusText(status)}`, 'success');
        
        // Update all pages that might be open
        updateAllPages();
        
        // Refresh current page after a short delay
        setTimeout(() => {
            location.reload();
        }, 1500);
    } else {
        console.error('Request not found:', id);
        showToast('لم يتم العثور على الطلب', 'error');
    }
}

// Update all open pages with new data
function updateAllPages() {
    // This function can be used to update other open tabs/windows
    // For now, we'll just reload the current page
    console.log('Updating all pages with new data');
}

// Calculate estimated cost
function calculateCost(quantity) {
    return (quantity * 1.5).toFixed(2);
}

// Format card number
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Initialize event listeners
function initializeEventListeners() {
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }

    // CVV input - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

// Show ratings (placeholder)
function showRatings() {
    showToast('ميزة التقييمات قيد التطوير', 'info');
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Clear form
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
    }
}

// Simulate payment processing
function processPayment(requestData, callback) {
    console.log('Processing payment for:', requestData);
    
    // Show loading state
    const payButton = document.getElementById('payButton');
    const payButtonText = document.getElementById('payButtonText');
    const payButtonLoading = document.getElementById('payButtonLoading');
    
    console.log('Payment elements found:', {
        payButton: !!payButton,
        payButtonText: !!payButtonText,
        payButtonLoading: !!payButtonLoading
    });
    
    if (payButton) {
        payButton.disabled = true;
        if (payButtonText) {
            payButtonText.textContent = 'جاري المعالجة...';
        }
        if (payButtonLoading) {
            payButtonLoading.style.display = 'inline-block';
        }
    }

    // Simulate API call
    setTimeout(() => {
        // Create new request
        const newRequest = {
            ...requestData,
            id: generateId(),
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        console.log('Creating new request:', newRequest);
        shipmentRequests.push(newRequest);
        saveShipmentRequests();
        console.log('All shipment requests after adding new one:', shipmentRequests);

        // Show success message
        showToast('تم إرسال طلب الشحنة بنجاح!', 'success');

        // Reset button state
        if (payButton) {
            payButton.disabled = false;
            if (payButtonText) {
                payButtonText.textContent = 'دفع';
            }
            if (payButtonLoading) {
                payButtonLoading.style.display = 'none';
            }
        }

        // Callback
        if (callback) callback(newRequest);

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    }, 2000);
}

// Export functions for use in other files
window.FuelShipmentSystem = {
    shipmentRequests,
    loadShipmentRequests,
    saveShipmentRequests,
    generateId,
    formatDate,
    getStatusColor,
    getStatusText,
    showToast,
    updateRequestStatus,
    calculateCost,
    showRatings,
    validateForm,
    clearForm,
    processPayment
};
