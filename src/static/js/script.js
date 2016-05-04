(function(){

    var getOffset = function (element) {
            var pos = {x:0,y:0};
            if (element.offsetParent) {
                do {
                    pos.x += element.offsetLeft;
                    pos.y += element.offsetTop;
                    // jshint -W084
                    console.log(element);
                } while (element = element.offsetParent);
            }
            return pos;
        };

    // window height
    var wHeight = window.innerHeight,
        header = document.querySelector('.post-header'),
        headerInner = document.querySelector('.post-header__inner'),
        topOfNav = getOffset(document.querySelector('.page-nav ul')).y,
        topOfHeader = getOffset(document.querySelector('.wrapper--pull-top')).y - topOfNav,
        timer;

    // scroll
    window.addEventListener('scroll', function(){

        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(onScroll, 10);

    });

    var onScroll = function(){
        var scroll = document.body.scrollTop,
            topOfNav = getOffset(document.querySelector('.page-nav ul')).y,
            perc = Math.min(scroll/(wHeight *.5) * 100, 100);


        // headerInner.style.opacity = 1 - perc/100;

        // var percDoc = scroll/document.body.offsetHeight * 100;
        // document.body.style.backgroundPosition = '0 ' + percDoc + '%';


        var fixed = true;

        var nav = document.querySelector('.page-nav');

            if (scroll > topOfHeader && fixed) {
                nav.classList.remove('page-nav--fixed');
                fixed = false;
            } else {
                nav.classList.add('page-nav--fixed');
                fixed = true;
            }

    };

    // random header
    // var random = Math.floor(Math.random() * 5) + 1;
    // header.classList.add('post-header--' + random);

}());










