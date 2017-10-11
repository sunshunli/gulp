import num from './inclod.js';
$(function(){
	$('img').click(function(){
		alert(1);
	})
	$('.box').click(() => {
		console.log(2);
		console.log(num(1, 3));
	})
})