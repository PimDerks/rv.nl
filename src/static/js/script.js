(function(){

    // window height
    var wHeight = window.innerHeight,
        header = document.querySelector('.post-header'),
        headerInner = document.querySelector('.post-header__inner'),
        timer;

    // scroll
    window.addEventListener('scroll', function(){

        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(onScroll, 200);

    });

    var onScroll = function(){
        var scroll = document.body.scrollTop,
            perc = Math.min(scroll/(wHeight *.5) * 100, 100);

        // headerInner.style.opacity = 1 - perc/100;

        // var percDoc = scroll/document.body.offsetHeight * 100;
        // document.body.style.backgroundPosition = '0 ' + percDoc + '%';

        var nav = document.querySelector('.page-nav');
        if(scroll > (wHeight / 4)){
            nav.classList.add('page-nav--fixed');
        } else {
            nav.classList.remove('page-nav--fixed');
        }
    };

    // random header
    // var random = Math.floor(Math.random() * 5) + 1;
    // header.classList.add('post-header--' + random);

}());










