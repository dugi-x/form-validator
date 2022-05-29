const normalizer = {
    rules: {},
    messages: {},
    add: function(name, fn, message){
        this.rules[name] = fn;
        this.messages[name] = message;
    },
    init: function(){
        document.querySelectorAll('[data-normalize]').forEach((fieldElement)=> {
            fieldElement.addEventListener('keyup', (event) => {
                // Normalization
                String(fieldElement.getAttribute('data-normalize')).split(' ').every((rule)=>{
                    if (!this.rules[rule]){
                        console.error('The rule "'+rule+'" not exist');
                        //Continue
                        return true;
                    }
                    
                    let valid = this.rules[rule].call(fieldElement, fieldElement.value, fieldElement);
                    if (valid){
                        //Continue
                        return true;
                    }
                    
                    //Brake invalid
                    // Alert feedback
                    let errorBox = event.target.parentElement.querySelector('.invalid-feedback')
                    if (!errorBox){
                        errorBox = document.createElement('span');
                        errorBox.classList.add('invalid-feedback');
                        fieldElement.parentElement.append(errorBox);
                    }
                    if (errorBox) {
                        errorBox.innerText = this.messages[rule] || 'invalid'
                        errorBox.classList.add('show');
                        console.log(errorBox.innerText);
                    }
                    return false;
                });
            });
        });
  
        return this;
    }
}


const validator = {
    rules: {},
    messages: {
        valueMissing: '* This field is required.'
    },
    add: function(name, fn, message){
        this.rules[name] = fn;
        this.messages[name] = message;
    },
    init: function(){
        const coreValidityNames = ["badInput","customError","patternMismatch","rangeOverflow","rangeUnderflow","stepMismatch","tooLong","tooShort","typeMismatch","valueMissing"];
        const forms = document.querySelectorAll('.needs-validation');
        
        Array.prototype.slice.call(forms).forEach((formElement) => {
            formElement.setAttribute('novalidate', true);
  
            formElement.querySelectorAll(':invalid,[data-rule]').forEach((fieldElement)=> {
                fieldElement.addEventListener('keyup', (event) => {
                    // Validation
                    fieldElement.setCustomValidity('')
                    fieldElement.classList.remove('is-invalid');
                    if (fieldElement.validity.valid === true && fieldElement.hasAttribute('data-rule')){
                        String(fieldElement.getAttribute('data-rule')).split(' ').every((rule)=>{
                            if (!this.rules[rule]){
                                console.error('The rule "'+rule+'" not exist');
                                return true;
                            }
                            
                            let valid = this.rules[rule].call(fieldElement, fieldElement.value, fieldElement);
                            if (valid){
                                //Continue
                                return true;
                            }
                            
                            //Brake invalid
                            fieldElement.setCustomValidity(this.messages[rule] || 'invalid');
                            return false;
                        });
                    } else {
                        // Overrite built-in message
                        coreValidityNames.every( key => {
                            if (fieldElement.validity[key] && this.messages[key]){
                                fieldElement.setCustomValidity(this.messages[key]);
                                return false;
                            }

                            return true;
                        });
                    }
                    
                    
                    // Alert feedback
                    let errorBox = event.target.parentElement.querySelector('.invalid-feedback')
                    if (!errorBox){
                        errorBox = document.createElement('span');
                        errorBox.classList.add('invalid-feedback');
                        fieldElement.parentElement.append(errorBox);
                    }
                    if (errorBox) {
                        errorBox.innerText = fieldElement.validationMessage
                    }
                });

                fieldElement.addEventListener('change', (event) => {
                    let errorBox = event.target.parentElement.querySelector('.invalid-feedback')
                    if(fieldElement.validity.valid){
                        fieldElement.classList.remove('is-invalid');
                        if (errorBox){
                            errorBox.classList.remove('show')
                        }
                    } else {
                        fieldElement.classList.add('is-invalid');
                        if (errorBox){
                            errorBox.classList.add('show')
                        }
                    }
                });
            });
  
            formElement.addEventListener('submit', (event) => {
                formElement.querySelectorAll(':invalid,[data-rule]').forEach((fieldElement) => {
                    fieldElement.dispatchEvent(new Event('keyup'));
                });
               
                if (!formElement.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                formElement.classList.add('was-validated')
            }, false);
        });

        return this;
    }
}
