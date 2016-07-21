(function(){

    var getOffset = function (element) {
        var pos = {x: 0, y: 0};
        if (element.offsetParent) {
            do {
                pos.x += element.offsetLeft;
                pos.y += element.offsetTop;
                // jshint -W084
            } while (element = element.offsetParent);
        }
        return pos;

    };

    var hero = document.querySelector('.o-hero'),
        heroInner = document.querySelector('.o-hero__inner'),
        heroHeight = hero.offsetHeight,
        nav = document.querySelector('.page-nav'),
        navOffset = getOffset(nav),
        timer;

    // scroll
    window.addEventListener('scroll', function(){

        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(onScroll, 10);

    });

    var update = function(scrollPos, headerPos){
            var method = scrollPos > headerPos ? 'add' : 'remove';
            nav.classList[method]('page-nav--fixed');
    };

    var onScroll = function(){
        return;
        var scroll = document.body.scrollTop,
            perc = scroll/(heroHeight/100);

        // toggle menu
        // update(scroll, navOffset.y);

        // animate background in header
        if(perc > 0 && perc <= 100) {
            hero.style.backgroundPosition = '100% ' + perc/2 + '%';
        } else {
            hero.style.backgroundPosition = '';
        }

        if(perc > 25){
            var opacity = (perc - 25) * 2;
            heroInner.style.opacity = 1 - (opacity/100);
        } else {
            heroInner.style.opacity = 1;
        }

    };

}());

var initMap = function(){
    var el = document.getElementById('map'),
        map;
    if(el){
        map = new google.maps.Map(el, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }
}










