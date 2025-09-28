// Driver Control Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Wait for main.js to load
    setTimeout(() => {
        loadAssignedDeliveries();
    }, 200);
});

// Load assigned deliveries
function loadAssignedDeliveries() {
    const assignedDeliveriesList = document.getElementById('assignedDeliveriesList');
    const emptyDriverState = document.getElementById('emptyDriverState');
    
    if (!assignedDeliveriesList || !emptyDriverState) return;

    // Clear existing content
    assignedDeliveriesList.innerHTML = '';

    // Load data directly from localStorage
    const saved = localStorage.getItem('shipmentRequests');
    let allRequests = [];
    if (saved) {
        allRequests = JSON.parse(saved);
    }

    const assignedRequests = allRequests.filter(req => 
        ['Accepted', 'Received', 'On the Way'].includes(req.status)
    );
    console.log('Driver loading assigned deliveries:', assignedRequests);

    if (assignedRequests.length === 0) {
        emptyDriverState.style.display = 'block';
        assignedDeliveriesList.style.display = 'none';
    } else {
        emptyDriverState.style.display = 'none';
        assignedDeliveriesList.style.display = 'block';
        
        assignedRequests.forEach(request => {
            const deliveryCard = createDeliveryCard(request);
            assignedDeliveriesList.appendChild(deliveryCard);
        });
    }
}

// Create delivery card
function createDeliveryCard(request) {
    const col = document.createElement('div');
    col.className = 'col-12 col-lg-6';
    
    col.innerHTML = `
        <div class="card request-card h-100">
            <div class="card-header d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="card-title mb-1">
                        تسليم #${request.id.slice(-6)}
                        <span class="status-badge ${FuelShipmentSystem.getStatusColor(request.status)} ms-2">
                            ${FuelShipmentSystem.getStatusText(request.status)}
                        </span>
                    </h6>
                    <small class="text-muted">${FuelShipmentSystem.formatDate(request.createdAt)}</small>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <small class="text-muted">الكمية</small>
                        <div class="fw-bold">${request.quantity} لتر</div>
                    </div>
                    <div class="col-6">
                        <small class="text-muted">نوع الوقود</small>
                        <div class="fw-bold">${request.fuelType}</div>
                    </div>
                    <div class="col-12">
                        <small class="text-muted">الوجهة</small>
                        <div class="fw-bold">${request.targetStation}</div>
                        <div class="text-muted small">${request.description}</div>
                    </div>
                </div>
                <div class="btn-group-actions">
                    ${getNextActionButton(request)}
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Get next action button based on status
function getNextActionButton(request) {
    switch (request.status) {
        case 'Accepted':
            return `
                <button class="btn btn-receive btn-action" onclick="markAsReceived('${request.id}')">
                    <i class="bi bi-box-seam me-2"></i>
                    تم الاستلام
                </button>
            `;
        case 'Received':
            return `
                <button class="btn btn-deliver btn-action" onclick="markAsOnTheWay('${request.id}')">
                    <i class="bi bi-truck me-2"></i>
                    في الطريق
                </button>
            `;
        case 'On the Way':
            return `
                <button class="btn btn-confirm btn-action" onclick="markAsDelivered('${request.id}')">
                    <i class="bi bi-geo-alt me-2"></i>
                    تم التسليم
                </button>
            `;
        default:
            return '';
    }
}

// Mark as received
function markAsReceived(requestId) {
    if (confirm('هل أنت متأكد من تأكيد استلام الشحنة؟')) {
        FuelShipmentSystem.updateRequestStatus(requestId, 'Received');
    }
}

// Mark as on the way
function markAsOnTheWay(requestId) {
    if (confirm('هل أنت متأكد من بدء التوصيل؟')) {
        FuelShipmentSystem.updateRequestStatus(requestId, 'On the Way');
    }
}

// Mark as delivered
function markAsDelivered(requestId) {
    if (confirm('هل أنت متأكد من تسليم الشحنة؟')) {
        FuelShipmentSystem.updateRequestStatus(requestId, 'Delivered');
    }
}

// Make functions globally available
window.markAsReceived = markAsReceived;
window.markAsOnTheWay = markAsOnTheWay;
window.markAsDelivered = markAsDelivered;
