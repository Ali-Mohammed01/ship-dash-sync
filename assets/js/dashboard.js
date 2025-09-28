// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Wait for main.js to load
    setTimeout(() => {
        loadRequests();
    }, 200);
});

// Load and display requests
function loadRequests() {
    const requestsList = document.getElementById('requestsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!requestsList || !emptyState) return;

    // Clear existing content
    requestsList.innerHTML = '';

    // Load data directly from localStorage
    const saved = localStorage.getItem('shipmentRequests');
    let requests = [];
    if (saved) {
        requests = JSON.parse(saved);
    }

    console.log('Dashboard loading requests:', requests);

    if (requests.length === 0) {
        emptyState.style.display = 'block';
        requestsList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        requestsList.style.display = 'block';
        
        requests.forEach(request => {
            const requestCard = createRequestCard(request);
            requestsList.appendChild(requestCard);
        });
    }
}

// Create request card element
function createRequestCard(request) {
    const col = document.createElement('div');
    col.className = 'col-12 col-lg-6';
    
    col.innerHTML = `
        <div class="card request-card h-100">
            <div class="card-header d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="card-title mb-1">
                        طلب #${request.id.slice(-6)}
                        <span class="status-badge ${getStatusColor(request.status)} ms-2">
                            ${getStatusText(request.status)}
                        </span>
                    </h6>
                    <small class="text-muted">${window.FuelShipmentSystem ? window.FuelShipmentSystem.formatDate(request.createdAt) : new Date(request.createdAt).toLocaleDateString()}</small>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <small class="text-muted">الكمية المطلوبة</small>
                        <div class="fw-bold">${request.quantity} لتر</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">نوع الوقود</small>
                        <div class="fw-bold">${request.fuelType}</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">سعة الخزان</small>
                        <div class="fw-bold">${request.tankCapacity} لتر</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">المحطة المستهدفة</small>
                        <div class="fw-bold">${request.targetStation}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <small class="text-muted">عنوان المحطة</small>
                    <div class="text-break">${request.description}</div>
                </div>
                ${request.status === 'Delivered' ? `
                    <button class="btn btn-confirm btn-action" onclick="confirmDelivery('${request.id}')">
                        <i class="bi bi-check-circle me-2"></i>
                        تأكيد التسليم
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return col;
}

// Open create request modal
function openCreateModal() {
    const modal = new bootstrap.Modal(document.getElementById('createRequestModal'));
    modal.show();
}

// Submit new request
function submitRequest() {
    if (!window.FuelShipmentSystem || !window.FuelShipmentSystem.validateForm('createRequestForm')) {
        if (window.FuelShipmentSystem && window.FuelShipmentSystem.showToast) {
            window.FuelShipmentSystem.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        }
        return;
    }

    const requestData = {
        quantity: parseInt(document.getElementById('quantity').value),
        fuelType: document.getElementById('fuelType').value,
        tankCapacity: parseInt(document.getElementById('tankCapacity').value),
        targetStation: document.getElementById('targetStation').value,
        description: document.getElementById('description').value
    };

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createRequestModal'));
    modal.hide();

    // Clear form
    if (window.FuelShipmentSystem && window.FuelShipmentSystem.clearForm) {
        window.FuelShipmentSystem.clearForm('createRequestForm');
    }

    // Redirect to payment
    window.location.href = `payment.html?data=${encodeURIComponent(JSON.stringify(requestData))}`;
}

// Confirm delivery
function confirmDelivery(requestId) {
    if (confirm('هل أنت متأكد من تأكيد التسليم؟')) {
        if (window.FuelShipmentSystem && window.FuelShipmentSystem.updateRequestStatus) {
            window.FuelShipmentSystem.updateRequestStatus(requestId, 'Confirmed');
        }
    }
}

// Helper functions
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

// Make functions globally available
window.openCreateModal = openCreateModal;
window.submitRequest = submitRequest;
window.confirmDelivery = confirmDelivery;
