(function(){

    var hero = document.querySelector('.o-hero'),
        heroInner = document.querySelector('.o-hero__inner'),
        heroHeight = hero.offsetHeight,
        timer;

    // scroll
    window.addEventListener('scroll', function(){

        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(onScroll, 25);

    });

    var onScroll = function(){
        var scroll = document.body.scrollTop,
            perc = scroll/(heroHeight/100);

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










