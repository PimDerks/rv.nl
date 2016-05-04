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
        var scroll = document.body.scrollTop;

            var shouldBeFixed = scroll > topOfHeader;
            if (shouldBeFixed && fixed) {
                nav.classList.remove('page-nav--fixed');
                fixed = false;
            } else if (!shouldBeFixed && !fixed){
                nav.classList.add('page-nav--fixed');
                fixed = true;
            }

    };

}());










