 class ContactForm {
            constructor() {
                this.form = document.getElementById('contactForm');
                this.submitBtn = document.getElementById('submitBtn');
                this.successMessage = document.getElementById('successMessage');
                this.charCount = document.getElementById('charCount');
                this.description = document.getElementById('description');
                
                this.init();
            }

            init() {
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
                this.description.addEventListener('input', this.updateCharCount.bind(this));
                
                // Real-time validation
                const inputs = this.form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('blur', this.validateField.bind(this));
                    input.addEventListener('input', this.clearError.bind(this));
                });

                // Initialize character count
                this.updateCharCount();
                
                // Auto-generate order number for demo
                this.generateSampleOrderNumber();
            }

            generateSampleOrderNumber() {
                const orderInput = document.getElementById('orderNumber');
                const prefixes = ['ORD', 'INV', 'PUR'];
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const number = Math.floor(Math.random() * 900000) + 100000;
                orderInput.placeholder = `e.g., ${prefix}-${number}`;
            }

            updateCharCount() {
                const count = this.description.value.length;
                this.charCount.textContent = count;
                
                if (count > 800) {
                    this.charCount.style.color = 'var(--warning-color)';
                } else if (count > 950) {
                    this.charCount.style.color = 'var(--error-color)';
                } else {
                    this.charCount.style.color = 'var(--text-secondary)';
                }
            }

            validateField(e) {
                const field = e.target;
                const formGroup = field.closest('.form-group');
                let isValid = true;

                // Clear previous error
                formGroup.classList.remove('error');

                if (field.hasAttribute('required') && !field.value.trim()) {
                    this.showError(formGroup, 'This field is required');
                    isValid = false;
                } else if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        this.showError(formGroup, 'Please enter a valid email address');
                        isValid = false;
                    }
                } else if (field.id === 'orderNumber' && field.value) {
                    const orderRegex = /^[A-Z]{3}-[0-9]{6}$/;
                    if (!orderRegex.test(field.value)) {
                        this.showError(formGroup, 'Order number should be in format: ABC-123456');
                        isValid = false;
                    }
                } else if (field.id === 'description' && field.value.length < 20) {
                    this.showError(formGroup, 'Please provide at least 20 characters');
                    isValid = false;
                }

                return isValid;
            }

            showError(formGroup, message) {
                formGroup.classList.add('error');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = message;
                }
            }

            clearError(e) {
                const formGroup = e.target.closest('.form-group');
                formGroup.classList.remove('error');
            }

            async handleSubmit(e) {
                e.preventDefault();
                
                // Add ripple effect
                this.submitBtn.classList.add('ripple');
                setTimeout(() => {
                    this.submitBtn.classList.remove('ripple');
                }, 600);
                
                // Validate all fields
                let isFormValid = true;
                const inputs = this.form.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    const mockEvent = { target: input };
                    if (!this.validateField(mockEvent)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    // Shake animation for invalid form
                    this.form.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        this.form.style.animation = '';
                    }, 500);
                    return;
                }

                // Show loading state
                this.setLoading(true);

                try {
                    // Simulate API call
                    await this.simulateSubmission();
                    this.showSuccess();
                } catch (error) {
                    // Create a temporary form group for the error message
                    const tempErrorDiv = document.createElement('div');
                    tempErrorDiv.className = 'error-message';
                    tempErrorDiv.style.display = 'block';
                    tempErrorDiv.style.marginTop = '1rem';
                    tempErrorDiv.textContent = 'An error occurred. Please try again.';
                    this.submitBtn.parentNode.insertBefore(tempErrorDiv, this.submitBtn);
                    
                    setTimeout(() => {
                        if (tempErrorDiv.parentNode) {
                            tempErrorDiv.remove();
                        }
                    }, 5000);
                } finally {
                    this.setLoading(false);
                }
            }

            async simulateSubmission() {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    return Promise.resolve();
                } else {
                    throw new Error('Submission failed');
                }
            }

            setLoading(loading) {
                const btnText = this.submitBtn.querySelector('.btn-text');
                const loadingSpinner = this.submitBtn.querySelector('.loading');
                
                if (loading) {
                    btnText.style.display = 'none';
                    loadingSpinner.style.display = 'inline-block';
                    this.submitBtn.disabled = true;
                    this.submitBtn.style.opacity = '0.8';
                } else {
                    btnText.style.display = 'inline';
                    loadingSpinner.style.display = 'none';
                    this.submitBtn.disabled = false;
                    this.submitBtn.style.opacity = '1';
                }
            }

            showSuccess() {
                this.form.style.display = 'none';
                this.successMessage.style.display = 'block';
                
                // Confetti effect
                this.createConfetti();
                
                // Reset form after delay
                setTimeout(() => {
                    this.form.reset();
                    this.form.style.display = 'block';
                    this.successMessage.style.display = 'none';
                    this.updateCharCount();
                }, 5000);
            }

            createConfetti() {
                const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)', 'var(--success-color)'];
                
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        const confetti = document.createElement('div');
                        confetti.style.cssText = `
                            position: fixed;
                            left: ${Math.random() * 100}%;
                            top: -10px;
                            width: 8px;
                            height: 8px;
                            background: ${colors[Math.floor(Math.random() * colors.length)]};
                            border-radius: 50%;
                            pointer-events: none;
                            z-index: 1000;
                            animation: confetti-fall 3s ease-out forwards;
                        `;
                        
                        document.body.appendChild(confetti);
                        
                        setTimeout(() => {
                            confetti.remove();
                        }, 3000);
                    }, i * 100);
                }
            }
        }

        // Add confetti animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

        // Initialize the form when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ContactForm();
        });

        // Add floating elements dynamically
        function addFloatingElements() {
            const container = document.querySelector('.floating-elements');
            const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
            
            setInterval(() => {
                if (container.children.length < 8) {
                    const element = document.createElement('div');
                    element.className = 'floating-element';
                    element.style.left = Math.random() * 100 + '%';
                    element.style.background = colors[Math.floor(Math.random() * colors.length)];
                    element.style.animationDuration = (8 + Math.random() * 8) + 's';
                    container.appendChild(element);
                    
                    setTimeout(() => {
                        if (element.parentNode) {
                            element.remove();
                        }
                    }, 15000);
                }
            }, 3000);
        }

        // Start floating elements
        addFloatingElements();