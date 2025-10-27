// Paintello Pro Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    // Wilaya number auto-fill
    const wilayaSelect = document.getElementById('wilaya');
    const wilayaNumberInput = document.getElementById('wilayaNumber');
    
    if (wilayaSelect && wilayaNumberInput) {
        wilayaSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                const wilayaNumber = selectedOption.text.match(/\((\d+)\)/);
                if (wilayaNumber && wilayaNumber[1]) {
                    wilayaNumberInput.value = wilayaNumber[1];
                }
            } else {
                wilayaNumberInput.value = '';
            }
        });
    }

    // Form validation enhancements
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Add loading states to buttons
    const submitButtons = document.querySelectorAll('button[type="submit"], .btn[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('form');
            if (form && form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...';
                this.disabled = true;
            }
        });
    });

    // Price calculation for orders
    const areaInput = document.getElementById('area');
    const pricePerSqmInput = document.getElementById('pricePerSqm');
    const budgetInput = document.getElementById('budget');
    
    if (areaInput && pricePerSqmInput && budgetInput) {
        function calculateBudget() {
            const area = parseFloat(areaInput.value) || 0;
            const pricePerSqm = parseFloat(pricePerSqmInput.value) || 0;
            const budget = area * pricePerSqm;
            budgetInput.value = budget.toFixed(0);
        }
        
        areaInput.addEventListener('input', calculateBudget);
        pricePerSqmInput.addEventListener('input', calculateBudget);
    }

    // Image preview for file inputs
    const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                const previewId = this.getAttribute('data-preview');
                const previewElement = previewId ? document.getElementById(previewId) : this.previousElementSibling;
                
                if (previewElement && previewElement.classList.contains('image-preview')) {
                    reader.onload = function(e) {
                        previewElement.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Auto-hide navbar on scroll (mobile)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar && window.innerWidth < 992) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        });
    }

    console.log('Paintello Pro JS loaded successfully!');
});

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
    }).format(price);
}

function showToast(message, type = 'success') {
    // You can implement a toast notification system here
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// API helper functions
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
