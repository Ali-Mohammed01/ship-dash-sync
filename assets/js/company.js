// Company Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Wait for main.js to load
    setTimeout(() => {
        loadPendingRequests();
    }, 200);
});

// Load pending requests
function loadPendingRequests() {
    const pendingRequestsList = document.getElementById('pendingRequestsList');
    const emptyPendingState = document.getElementById('emptyPendingState');
    
    if (!pendingRequestsList || !emptyPendingState) return;

    // Clear existing content
    pendingRequestsList.innerHTML = '';

    // Load data directly from localStorage
    const saved = localStorage.getItem('shipmentRequests');
    let allRequests = [];
    if (saved) {
        allRequests = JSON.parse(saved);
    }

    const pendingRequests = allRequests.filter(req => req.status === 'Pending');
    console.log('Company loading pending requests:', pendingRequests);

    if (pendingRequests.length === 0) {
        emptyPendingState.style.display = 'block';
        pendingRequestsList.style.display = 'none';
    } else {
        emptyPendingState.style.display = 'none';
        pendingRequestsList.style.display = 'block';
        
        pendingRequests.forEach(request => {
            const requestCard = createPendingRequestCard(request);
            pendingRequestsList.appendChild(requestCard);
        });
    }
}

// Create pending request card
function createPendingRequestCard(request) {
    const col = document.createElement('div');
    col.className = 'col-12 col-lg-6';
    
    col.innerHTML = `
        <div class="card request-card h-100">
            <div class="card-header d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="card-title mb-1">
                        طلب #${request.id.slice(-6)}
                        <span class="status-badge status-pending ms-2">
                            ${FuelShipmentSystem.getStatusText(request.status)}
                        </span>
                    </h6>
                    <small class="text-muted">${FuelShipmentSystem.formatDate(request.createdAt)}</small>
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
                <div class="btn-group-actions">
                    <button class="btn btn-accept btn-action" onclick="acceptRequest('${request.id}')">
                        <i class="bi bi-check-circle me-2"></i>
                        قبول الطلب
                    </button>
                    <button class="btn btn-reject btn-action" onclick="rejectRequest('${request.id}')">
                        <i class="bi bi-x-circle me-2"></i>
                        رفض الطلب
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Accept request
function acceptRequest(requestId) {
    if (confirm('هل أنت متأكد من قبول هذا الطلب؟')) {
        FuelShipmentSystem.updateRequestStatus(requestId, 'Accepted');
    }
}

// Reject request
function rejectRequest(requestId) {
    if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
        FuelShipmentSystem.updateRequestStatus(requestId, 'Rejected');
    }
}

// Make functions globally available
window.acceptRequest = acceptRequest;
window.rejectRequest = rejectRequest;
