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
    var header = document.querySelector('.post-header'),
        wHeight = window.innerHeight,
        nav = document.querySelector('.page-nav'),
        topOfNav = getOffset(document.querySelector('.page-nav ul')).y,
        topOfHeader = getOffset(document.querySelector('.wrapper--pull-top')).y - topOfNav,
        timer;

    // scroll
    window.addEventListener('scroll', function(){

        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(onScroll, 15);

    });

    var fixed = true;
    var onScroll = function(){
        var scroll = document.body.scrollTop,
            perc = Math.min(scroll/(wHeight *.5) * 100, 100);

        // var percDoc = scroll/document.body.offsetHeight * 100;

        var headerInner = header.querySelector('.post-header__inner').style.opacity = 1 - (perc/100);
        var shouldBeFixed = scroll >= topOfHeader;
            if (shouldBeFixed && fixed) {
                nav.classList.remove('page-nav--fixed');
                fixed = false;
            } else if (!shouldBeFixed && !fixed){
                nav.classList.add('page-nav--fixed');
                fixed = true;
            }

    };

}());










