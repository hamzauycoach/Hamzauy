// Configuration
const WHATSAPP_NUMBER = '201557403075'; // Without + sign

// Language System
const html = document.documentElement;
const FIXED_LANG = 'ar';
let currentLang = FIXED_LANG;

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', text);
            } else if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.hasAttribute('value')) {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
}

// Initialize language on load
window.addEventListener('DOMContentLoaded', function() {
    switchLanguage(FIXED_LANG);
});

// Plan Selection and Price Update
const planOptions = document.querySelectorAll('.plan-option');
const summaryPlan = document.getElementById('summaryPlan');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const summaryFeatures = document.getElementById('summaryFeatures');
const modalAmount = document.getElementById('modalAmount');
const modalAmountWallet = document.getElementById('modalAmountWallet');

const planData = {
    regular: {
        name: {en: 'Regular', ar: 'عادي'},
        price: 600,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Weekly follow-up', ar: '✓ متابعة أسبوعية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'}
        ]
    },
    advanced: {
        name: {en: 'Advanced', ar: 'متقدم'},
        price: 1000,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Daily follow-up', ar: '✓ متابعة يومية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'},
            {en: '✓ Priority response', ar: '✓ أولوية في الرد'},
            {en: '✓ Weekly video call', ar: '✓ مكالمة فيديو أسبوعية'}
        ]
    },
    vip: {
        name: {en: 'VIP', ar: 'VIP'},
        price: 1500,
        features: [
            {en: '✓ All Advanced features', ar: '✓ جميع مميزات المتقدم'},
            {en: '✓ 24-hour delivery', ar: '✓ تسليم خلال 24 ساعة'},
            {en: '✓ Premium support', ar: '✓ دعم مميز'},
            {en: '✓ Exclusive content', ar: '✓ محتوى حصري'}
        ]
    }
};

// Update summary when plan changes
planOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    radio.addEventListener('change', function() {
        const planType = this.value;
        const plan = planData[planType];
        
        // Update summary
        summaryPlan.textContent = plan.name[currentLang];
        const currency = currentLang === 'ar' ? 'جنيه' : 'EGP';
        summarySubtotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        summaryTotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmount.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmountWallet.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        
        // Update features list
        summaryFeatures.innerHTML = plan.features.map(feature => 
            `<li data-en="${feature.en}" data-ar="${feature.ar}">${feature[currentLang]}</li>`
        ).join('');
    });
});

// Phone Number Validation
const phoneInput = document.getElementById('phone');
const phoneGroup = phoneInput.closest('.form-group');
const phoneError = document.getElementById('phoneError');

phoneInput.addEventListener('input', function(e) {
    // Remove any non-digit characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    e.target.value = value;
    
    // Validate
    validatePhone();
});

phoneInput.addEventListener('blur', validatePhone);

function validatePhone() {
    const value = phoneInput.value;
    const pattern = /^01[0-9]{9}$/;
    
    phoneGroup.classList.remove('error', 'success');
    
    if (value === '') {
        return true;
    }
    
    if (!pattern.test(value)) {
        phoneGroup.classList.add('error');
        return false;
    } else {
        phoneGroup.classList.add('success');
        return true;
    }
}

// Payment Method Selection
const qrModal = document.getElementById('qrModal');
const modalClose = document.querySelector('.modal-close');
const completeCheckoutBtn = document.getElementById('completeCheckout');
const confirmPaymentBtn = document.getElementById('confirmPayment');

// Payment Tabs Functionality
const paymentTabs = document.querySelectorAll('.payment-tab');
const tabContents = document.querySelectorAll('.payment-tab-content');

paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        
        // Update active tab
        paymentTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${method}-content`) {
                content.classList.add('active');
            }
        });
    });
});

// Copy Wallet Number
const copyWalletBtn = document.getElementById('copyWalletBtn');
const walletNumber = document.querySelector('.wallet-number').textContent;

copyWalletBtn.addEventListener('click', async function() {
    try {
        await navigator.clipboard.writeText(walletNumber);
        
        // Visual feedback
        this.classList.add('copied');
        const copyText = this.querySelector('.copy-text');
        const originalText = copyText.textContent;
        copyText.textContent = currentLang === 'ar' ? 'تم النسخ' : 'Copied';
        
        setTimeout(() => {
            this.classList.remove('copied');
            copyText.textContent = originalText;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = walletNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const copyText = this.querySelector('.copy-text');
            copyText.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
            setTimeout(() => {
                copyText.textContent = currentLang === 'ar' ? 'نسخ' : 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
});

// Complete Checkout Button
completeCheckoutBtn.addEventListener('click', function() {
    // Validate form
    const shippingForm = document.getElementById('shippingForm');
    
    // Check phone validation first
    if (!validatePhone()) {
        phoneInput.focus();
        return;
    }
    
    if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity();
        return;
    }
    
    // Show modal - only InstaPay/Wallet payment
    qrModal.classList.add('show');
    
    // Make sure InstaPay tab is active by default
    if (paymentTabs.length > 0) {
        paymentTabs[0].click();
    }
});

// Close modal
modalClose.addEventListener('click', function() {
    qrModal.classList.remove('show');
});

// Close modal when clicking outside
qrModal.addEventListener('click', function(e) {
    if (e.target === qrModal) {
        qrModal.classList.remove('show');
    }
});

// ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && qrModal.classList.contains('show')) {
        qrModal.classList.remove('show');
    }
});

// Confirm Payment Button - Save to Google Sheets & WhatsApp
confirmPaymentBtn.addEventListener('click', async function() {
    // Get selected plan info
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    const plan = planData[selectedPlan];
    const customerName = document.getElementById('fullName').value;
    const customerPhone = document.getElementById('phone').value;
    const customerEmail = document.getElementById('email').value;
    const customerAddress = document.getElementById('address').value;
    const customerCity = document.getElementById('city').value;
    const customerCountry = document.getElementById('country').value;
    const customerNotes = document.getElementById('notes').value || 'No additional notes';
    
    // Create order object
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress,
            city: customerCity,
            country: customerCountry,
            notes: customerNotes
        },
        plan: {
            type: selectedPlan,
            name: plan.name.en,
            nameAr: plan.name.ar,
            price: plan.price,
            currency: 'EGP'
        }
    };
    
    // Save order to Google Sheets
    const savedToSheets = await saveToGoogleSheets(orderData);
    if (savedToSheets) {
        alert(currentLang === 'ar'
            ? 'تم حفظ الطلب بنجاح في Google Sheets.'
            : 'Order saved successfully to Google Sheets.');
    } else {
        alert(currentLang === 'ar'
            ? 'تعذر حفظ الطلب في Google Sheets. سيتم إرسال البيانات عبر واتساب.'
            : 'Could not save order to Google Sheets. Details will still be sent via WhatsApp.');
    }
    
    // Create WhatsApp message
    const message = currentLang === 'ar' 
        ? `مرحباً، أنا ${customerName}%0A%0Aقمت بالدفع للخطة: ${plan.name.ar}%0Aالمبلغ: ${plan.price} جنيه%0Aرقم الهاتف: ${customerPhone}%0A%0Aسأقوم بإرسال لقطة شاشة تأكيد الدفع.`
        : `Hello, I'm ${customerName}%0A%0AI have completed payment for: ${plan.name.en} Plan%0AAmount: ${plan.price} EGP%0APhone: ${customerPhone}%0A%0AI will send the payment confirmation screenshot.`;
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Close modal after a short delay
    setTimeout(() => {
        qrModal.classList.remove('show');
    }, 500);
});

// Dark Mode Support
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Initialize with selected plan from homepage or default
window.addEventListener('load', function() {
    // Check if a plan was selected from the homepage
    const selectedPlan = localStorage.getItem('selectedPlan');
    
    if (selectedPlan) {
        // Find and select the corresponding radio button
        const planRadio = document.querySelector(`input[name="plan"][value="${selectedPlan}"]`);
        if (planRadio) {
            planRadio.checked = true;
            planRadio.dispatchEvent(new Event('change'));
        }
        
        // Clear the selection after loading
        localStorage.removeItem('selectedPlan');
    } else {
        // Load default plan if nothing was pre-selected
        const defaultPlan = document.querySelector('input[name="plan"]:checked');
        if (defaultPlan) {
            defaultPlan.dispatchEvent(new Event('change'));
        }
    }
});


// Save orders to Google Sheets using Google Sheets API
const SHEET_ID = '1Cmp9_qUDexlxhQcL5aA3yy7devuPlVAO3cqXHiJ6VGc';
const API_KEY = 'AIzaSyDGbiFbVcWk6K6C0erIfyTJ3JJ4vh-qm0k';

async function saveToGoogleSheets(orderData) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:K:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    const row = [
        new Date().toISOString(),
        orderData.orderId,
        orderData.customer.name,
        orderData.customer.email,
        orderData.customer.phone,
        orderData.plan.name,
        orderData.plan.price,
        orderData.customer.address,
        orderData.customer.city,
        orderData.customer.country,
        orderData.customer.notes
    ];

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [row]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Google Sheets API error:', response.status, errorData);
            return false;
        }

        const data = await response.json();
        console.log('✅ Saved to Google Sheets:', data);
        return true;
    } catch (error) {
        console.error('❌ Error saving to Google Sheets:', error);
        return false;
    }
}
