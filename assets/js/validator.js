
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function Validator(options) {  

    let selectorRules = {}; 
    // Validate rules
    function validate(inputElement, rule) {  
        let parentElement = inputElement.parentElement
        let errorElement = parentElement.querySelector(options.errorSelector)
        let errorMsg

        // Get list of rule
        let rules = selectorRules[rule.selector]

        // Check rules
        for (let i = 0; i < rules.length; i++){
            errorMsg = rules[i](inputElement.value)
            if (errorMsg) break;
        }
        // Invalid
        if (errorMsg)
        {
            errorElement.innerText = errorMsg
            parentElement.classList.add('invalid')
        }
        else { // Valid
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
                        return (values[input.name] = input.value) && values
                    }, {})
                    options.onSubmit(formValues)
                }
                else { // Default submit
                    formElement.submit()
                }
            }
            else{
                console.log('có lỗi');
            }
        }
        // Evenct for rule
        options.rules.forEach(function (rule) {  
            // Store rules to array
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            let inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {

                // On blur input
                inputElement.onblur = function () {  
                    validate(inputElement, rule)
                }

                // On typing
                inputElement.oninput = function () { 
                    let parentElement = inputElement.parentElement 
                    let errorElement = parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    parentElement.classList.remove('invalid')
                }
            }
        })
    }
}
// Define rules
Validator.isRequired = function (selector, msg) {  
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : msg || 'Vui lòng nhập trường này'
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
    errorSelector: '.form-message', 
    rules: [
        // Fullname
        Validator.isRequired('#fullname', 'Nhập tên kìa thằng ngu'),
        // Email
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        // Password
        Validator.isRequired('#password'),
        Validator.minLength('#password', 6),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', function(){
            return $('#form-1 #password').value
        }, 'Mật khẩu nhập lại không chính xác'),
    ],
    onSubmit: function(data){
        // Call API here
    }

})  