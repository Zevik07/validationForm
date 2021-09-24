
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function Validator(options) {  
    // Validate rulte
    function validate(inputElement, rule) {  
        let errorMsg = rule.test(inputElement.value)
        let parentElement = inputElement.parentElement
        let errorElement = parentElement.querySelector(options.errorSelector)
        if (errorMsg)
        {
            errorElement.innerText = errorMsg
            parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            parentElement.classList.remove('invalid')
        }
    }
    // Get option attribute
    let formElement = $(options.form)
    if (formElement){
        options.rules.forEach(function (rule) {  

            // Lưu lại các rule
            selectorRule[rule.selector] = rule.test

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
        Validator.isRequired('#fullname'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 6),
        Validator.isConfirmed('#password_confirmation', function(){
            return $('#form-1 #password').value
        }, 'Mật khẩu nhập lại không chính xác'),
    ]
})