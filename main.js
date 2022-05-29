// Overrite built-in message
validator.messages['valueMissing'] = 'This field is required.'

// Set rules  
validator.add('isHello',function(value, element){
    // tmp value
	value = value.toLowerCase(); 
	
	//true==valid | false==invalid
	return (value.indexOf('hello') > -1 || value.indexOf('hi') > -1); 
}, 'Please, say hello');

validator.add('greaterTthan',function(value, element){
    let minValue = element.getAttribute('min');
	return (value > minValue); 
}, 'Please enter a value greater than or equal to {0}.');

validator.add('lessThan',function(value, element){
	let maxValue = element.getAttribute('max');
	return (value > maxValue);
}, 'Please enter a value less than or equal to {0}.');

normalizer.add('digits',function(value,el){
    el.value = value.replace(/[^0-9]/g, '')
    return (value === el.value)
}, 'Please enter only digits.');

document.addEventListener('DOMContentLoaded', (event) => {
    window['validator'] = validator.init();
	window['normalizer'] = normalizer.init();
});