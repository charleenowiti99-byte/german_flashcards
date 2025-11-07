function processPayment() {
    const userEmail = document.getElementById('userEmail').value;
    
    if (!userEmail || !userEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    const handler = PaystackPop.setup({
        key: 'pk_live_0ad4453a77ae5457237c4ae64748381821766d04', // ← YOUR LIVE KEY HERE
        email: userEmail,
        amount: 5000, // $50 USD in cents (50 * 100)
        currency: 'USD', // ← CHANGED TO USD
        ref: 'FLASHCARD_' + Math.floor((Math.random() * 1000000000) + 1),
        onClose: function() {
            closeModal();
            alert('Payment window closed.');
        },
        callback: function(response) {
            closeModal();
            alert('Payment successful! Welcome to Premium!');
            unlockPremiumFeatures();
        }
    });
    
    handler.openIframe();
}
function closeModal() {
    document.getElementById('emailModal').style.display = 'none';
    document.getElementById('userEmail').value = '';
}