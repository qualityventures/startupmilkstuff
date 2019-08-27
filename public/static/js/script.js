$(document).ready(function(){

    //ready

    //nojs
    $('body').removeClass('no-js');

    //------------------------------------------------------------------------//

    //fakelink
    $('a[href="#"]').on('click', function(event) {
        event.preventDefault();
    });

    //------------------------------------------------------------------------//

    //placeholder
    $('input[placeholder], textarea[placeholder]').placeholder();

    //------------------------------------------------------------------------//

    //navigation
    $('.navigation-toggle').on('click', function(event) {
        event.preventDefault();
        $('body').toggleClass('navigation-open');
    });

    //------------------------------------------------------------------------//

    //scroll to
    $('a.scroll-link').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 70
                }, 400);
                return false;
            }
        }
    });

    //------------------------------------------------------------------------//

    //panel
    scrollHeader($(window).scrollTop());
    $(window).scroll(function() {
        scrollHeader($(window).scrollTop());
    });

    //------------------------------------------------------------------------//

});//document ready

//*********************************************************************//

$(window).load(function() {

    //load

});//window load

//*********************************************************************//

$(window).resize(function() {

    //resize

});//window resize

function scrollHeader(value) {
    if( value > 26 ) {
        $('.header-global').addClass('header-fixed');
    } else {
        $('.header-global').removeClass('header-fixed');
    }
}