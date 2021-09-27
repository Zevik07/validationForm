
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function Validator(options) {  
    let selectorRules = {}; 
    // Validate rules
    function validate(inputElement, rule) {  
        let parentElement = inputElement.closest(options.formGroup)
        let errorElement = parentElement.querySelector(options.errorSelector)
        let errorMsg

        // Get list of rule
        let rules = selectorRules[rule.selector]

        // Check rules
        for (let i = 0; i < rules.length; i++){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMsg = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
            
                default:
                    errorMsg = rules[i](inputElement.value)
            }
            if (errorMsg) break;
        }
        if (errorMsg)
        {
            errorElement.innerText = errorMsg
            parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            parentElement.classList.remove('invalid')
        }
        return !errorMsg
    }
    // Get option attribute
    let formElement = $(options.form)
    if (formElement){
        // When submit
        formElement.onsubmit = function (e){
            e.preventDefault();
            let isFormValid = true;

            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector)
                let isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            })

            if (isFormValid){
                if (typeof options.onSubmit === 'function') {
                    // Get form input
                    let validInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    let formValues = Array.from(validInputs).reduce((values, input) => {
                        switch (input.type) {
                            case 'radio':
                                if (input.matches(':checked')){
                                    values[input.name] = input.value
                                }
                                else {
                                    values[input.name] = ''
                                }
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values
                                }
                                if (!Array.isArray(values[input.name])){
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files
                                break;
                            default:
                                values[input.name] = input.value
                                break;
                        }
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
                else { // Default submit
                    formElement.submit()
                }
            }
        }
        // Event for rule
        options.rules.forEach(function (rule) {  
            // Store rules to array
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            let inputElements = formElement.querySelectorAll(rule.selector)

            if (inputElements) {
                Array.from(inputElements).forEach(function (inputElement) {
                    let parentElement = inputElement.closest(options.formGroup)
                    let errorElement = parentElement.querySelector(options.errorSelector)

                    // For input 
                    inputElement.onblur = function () {  
                        validate(inputElement, rule)
                    }

                    // For input
                    inputElement.oninput = function () { 
                        errorElement.innerText = ''
                        parentElement.classList.remove('invalid')
                    }
                    // For select
                    inputElement.onchange = function () {  
                        validate(inputElement, rule)
                    }
                })
            }
        })
    }
}
// Define rules
Validator.isRequired = function (selector, msg) {  
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : msg || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function (selector, msg) {  
    return {
        selector: selector,
        test: function (value) {  
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : msg || 'Email không hợp lệ'
        }
    }
}
Validator.minLength = function (selector, min, msg) {  
    return {
        selector: selector,
        test: function (value) {  
            return value.length >= min ? undefined : msg || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmValue, msg) {  
    return {
        selector: selector,
        test: function (value) {  
            return value === getConfirmValue() ? undefined : msg || 'Mật khẩu nhập lại chưa đúng'
        }
    }
}

Validator({
    form: '#form-1',
    formGroup: '.form-group',
    errorSelector: '.form-message', 
    rules: [
        // // Fullname
        // Validator.isRequired('#fullname', 'Nhập tên kìa thằng ngu'),
        // // Email
        // Validator.isRequired('#email'),
        // Validator.isEmail('#email'),
        // // Password
        // Validator.isRequired('#password'),
        // Validator.minLength('#password', 6),
        // // Password confirmation
        // Validator.isRequired('#password_confirmation'),
        // Validator.isConfirmed('#password_confirmation', function(){
        //     return $('#form-1 #password').value
        // }, 'Mật khẩu nhập lại không chính xác'),
        // // Gender
        // Validator.isRequired('input[name="gender"]'),
        // // Province
        // Validator.isRequired('#province'),
        Validator.isRequired('#avatar'),
    ],
    onSubmit: function(data){
        // Call API here
        console.log(data)
    }

})  