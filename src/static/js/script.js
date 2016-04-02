(function(){

    // window height
    var wHeight = window.innerHeight,
        header = document.querySelector('.post-header'),
        headerInner = document.querySelector('.post-header__inner');

    // scroll
    window.addEventListener('scroll', function(){

        var scroll = document.body.scrollTop,
            perc = Math.min(scroll/(wHeight *.5) * 100, 100);

        headerInner.style.opacity = 1 - perc/100;

        // var percDoc = scroll/document.body.offsetHeight * 100;
        // header.style.backgroundPosition = '0 ' + percDoc + '%';


    });

}());










