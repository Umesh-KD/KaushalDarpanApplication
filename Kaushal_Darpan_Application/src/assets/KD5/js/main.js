$('.slider').slick({
    draggable: true,
    loop: true,
    autoplay: true,
    arrows: true,
    dots: false,
    fade: true,
    speed: 900,
    infinite: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    touchThreshold: 100
})

$('.NewsSlider').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: true,
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.NewsSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 1,
            nav: true
        },
        1000: {
            items: 1,
            nav: true,
            loop: true,
            margin: 10
        }

    }
});

$('.services').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicesSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicesone').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicesoneSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 5,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicestwo').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicestwoSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 4,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicesthree').owlCarousel({
    loop:true,
    margin:10,
    nav:true,

    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicesthreeSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicesinner').owlCarousel({
    margin:10,
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicesinnerSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 1,
            nav: true
        },
        1000: {
            items: 1,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});


$('.servicesinnertwo').owlCarousel({
    margin:10,
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicesinnertwoSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 1,
            nav: true
        },
        1000: {
            items: 4,
            nav: true,
            loop: true,
            margin:75
        }

    }
});

$('.servicess').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicessSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicessone').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicessoneSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: true,
            margin: 30
        }

    }
});

$('.servicesseven').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    dots: true,    
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.servicessevenSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 1,
            nav: true
        },
        1000: {
            items: 1,
            nav: true,
            loop: true,
            margin:0
        }

    }
});


$('.colleges').owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    center: false,
    navText: [
        '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
        '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    navContainer: '.collegesSliderNav',
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: true,
            margin: 20
        }

    }
});


//document.addEventListener("DOMContentLoaded", () => {
//    function counter(id, start, end, duration) {
//     let obj = document.getElementById(id),
//      current = start,
//      range = end - start,
//      increment = end > start ? 1 : -1,
//      step = Math.abs(Math.floor(duration / range)),
//      timer = setInterval(() => {
//       current += increment;
//       obj.textContent = current;
//       if (current == end) {
//        clearInterval(timer);
//       }
//      }, step);
//    }
//    counter("count1", 0, 100, 3000);
//    counter("count2", 0, 100, 3000);
//    counter("count3", 0, 118, 3000);

//    counter("count4", 0, 100, 3000);
//    counter("count5", 0, 100, 3000);
//    counter("count6", 0, 118, 3000);
//   });



   