document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemBody = document.getElementById('invoice-item-body');
    const taxRateInput = document.getElementById('tax-rate');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const clientNameInput = document.getElementById('client-name-input');
    const clientSignatureName = document.getElementById('client-signature-name');
    const statusSelector = document.getElementById('payment-status-selector');
    const dpSection = document.getElementById('dp-section');
    const alreadyPaidInput = document.getElementById('already-paid-input');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            navLinks.forEach(item => item.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            const targetId = this.getAttribute('data-target');
            contentSections.forEach(section => {
                section.id === targetId ? section.classList.remove('hidden') : section.classList.add('hidden');
            });
        });
    });

    function calculateTotals() {
        let subtotal = 0;
        itemBody.querySelectorAll('tr').forEach(row => {
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseFloat(row.querySelector('.unit-price-input').value) || 0;
            const total = quantity * unitPrice;
            row.querySelector('.line-total').textContent = formatCurrency(total);
            subtotal += total;
        });

        const taxRate = parseFloat(taxRateInput.value) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        const alreadyPaid = parseFloat(alreadyPaidInput.value) || 0;
        const amountDue = grandTotal - alreadyPaid;

        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('tax-amount').textContent = formatCurrency(taxAmount);
        document.getElementById('grand-total').textContent = formatCurrency(grandTotal);
        
        if (statusSelector.value === 'dp') {
             document.getElementById('amount-due').textContent = formatCurrency(amountDue);
        }
    }

    function formatCurrency(value) {
        return 'Rp ' + value.toLocaleString('id-ID');
    }
    
    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function createItemRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="item-col"><textarea class="editable item-description" placeholder="Deskripsi item" rows="1"></textarea></td>
            <td class="quantity-col"><input type="number" placeholder="1" class="editable quantity"></td>
            <td class="price-col">
                <div class="price-input-group">
                    <span class="currency-symbol">Rp</span>
                    <input type="number" placeholder="0" class="editable unit-price-input">
                </div>
            </td>
            <td class="total-col line-total">${formatCurrency(0)}</td>
            <td class="action-cell"><button class="btn-delete-item"><i class="fas fa-trash-alt"></i></button></td>
        `;
        itemBody.appendChild(row);
    }
    
    function generateInvoiceDetails() {
        const now = new Date();
        const year = now.getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        document.getElementById('invoice-number').value = `TD-${randomNum}-${year}`;
        document.getElementById('invoice-date').valueAsDate = now;
    }

    function updateClientSignature() {
        clientSignatureName.value = clientNameInput.value;
    }

    function handleStatusChange() {
        statusSelector.classList.remove('status-paid', 'status-dp', 'status-unpaid');
        if (statusSelector.value === 'paid') {
            statusSelector.classList.add('status-paid');
            dpSection.style.display = 'none';
        } else if (statusSelector.value === 'dp') {
            statusSelector.classList.add('status-dp');
            dpSection.style.display = 'block';
        } else {
            statusSelector.classList.add('status-unpaid');
            dpSection.style.display = 'none';
        }
        calculateTotals();
    }

    addItemBtn.addEventListener('click', createItemRow);
    
    itemBody.addEventListener('click', function(e) {
        if (e.target.closest('.btn-delete-item')) {
            e.target.closest('tr').remove();
            calculateTotals();
        }
    });

    itemBody.addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity') || e.target.classList.contains('unit-price-input')) {
            calculateTotals();
        }
        if (e.target.classList.contains('item-description')) {
            autoResizeTextarea(e);
        }
    });

    taxRateInput.addEventListener('input', calculateTotals);
    alreadyPaidInput.addEventListener('input', calculateTotals);
    clientNameInput.addEventListener('input', updateClientSignature);
    statusSelector.addEventListener('change', handleStatusChange);

    downloadPdfBtn.addEventListener('click', () => {
        const invoiceToPrint = document.getElementById('invoice-to-print');
        const invoiceNumber = document.getElementById('invoice-number').value || 'invoice';
        
        const statusRow = document.querySelector('.status-row');
        const taxRow = document.querySelector('.tax-row');

        const statusText = statusSelector.options[statusSelector.selectedIndex].text;
        const statusValue = statusSelector.value;
        const statusBadge = document.createElement('span');
        statusBadge.textContent = statusText;
        statusBadge.className = `status-badge status-${statusValue}`;
        if (statusRow) statusRow.appendChild(statusBadge);

        const taxValue = taxRateInput.value;
        const taxText = document.createElement('span');
        taxText.textContent = `(${taxValue}%)`;
        taxText.className = 'tax-value-print';
        if (taxRow) taxRow.insertBefore(taxText, document.getElementById('tax-amount'));

        invoiceToPrint.classList.add('printing');

        html2canvas(invoiceToPrint, { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const { jsPDF } = window.jspdf;
            
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${invoiceNumber}.pdf`);
            
            invoiceToPrint.classList.remove('printing');
            if (statusRow && statusRow.contains(statusBadge)) {
                statusRow.removeChild(statusBadge);
            }
            if (taxRow && taxRow.contains(taxText)) {
                taxRow.removeChild(taxText);
            }
        });
    });

    createItemRow();
    calculateTotals();
    generateInvoiceDetails();
    handleStatusChange();
});