var element = [].slice.apply(document.querySelectorAll("[data-tilt]")).forEach(function (el) {
	VanillaTilt.init(el);	
});