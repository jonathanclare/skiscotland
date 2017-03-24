window.onload = function () 
{ 
    lazyLoad();
    on(window, 'scroll resize', debounce(lazyLoad));
    buildSlideShow();
} 

var twitterLoaded = false;
var fbLoaded = false;

function lazyLoad () 
{
    // Images.
    var offset = pageOffset().y
    var pageBottom = offset + viewportHeight();
    /*[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) 
    {
        var imgTop = offset + bounds(img).top;
        if(imgTop <= pageBottom)
        {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = function() {img.removeAttribute('data-src');}
        }
    });*/

    // Twitter feed.
    if (!twitterLoaded)
    {
        var twitter = document.querySelector('.twitter');
        var twitterTop = offset + bounds(twitter).top;
        if(twitterTop <= pageBottom)
        {   
            twitterLoaded = true;
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
        }
    }

    // fb feed.
    if (!fbLoaded)
    {
        var fb = document.querySelector('.twitter');
        var fbTop = offset + bounds(fb).top;
        if(fbTop <= pageBottom)
        {   
            (function(d, s, id) 
            {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }
}

// Slideshow.
document.onkeydown = function(e) 
{
    e = e || window.event;
    if (e.keyCode == '37')  prevSlide()
    else if (e.keyCode == '39')  nextSlide();
    else if (e.keyCode == '27')  closeSlideShow();
}
function openSlideShow(src)
{
    document.querySelector('.slideshow-next').focus();

    addClass(document.body, 'hide-scrollbars');
    var slideshow = document.querySelector('.slideshow');
    if (src !== undefined)
    {
        var activeSlide = slideshow.querySelector('.slideshow-slide-active');
        var nextSlide = slideshow.querySelector('img[src="'+src+'"], img[data-src="'+src+'"]').parentElement.parentElement;
        addClass(nextSlide, 'slideshow-slide-active');
        removeClass(activeSlide, 'slideshow-slide-active');
    }
    addClass(slideshow, 'slideshow-active');
}
function closeSlideShow()
{
    removeClass(document.body, 'hide-scrollbars');
    var slideshow = document.querySelector('.slideshow');
    removeClass(slideshow, 'slideshow-active');
}
function nextSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var nextSlide = (activeSlide.nextElementSibling !== null ? activeSlide.nextElementSibling : activeSlide.parentNode.firstElementChild);
    addClass(nextSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}
function prevSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var prevSlide = (activeSlide.previousElementSibling !== null ? activeSlide.previousElementSibling : activeSlide.parentNode.lastElementChild);
    addClass(prevSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}
function buildSlideShow()
{
    var strHtml = '<div class="slideshow-slides">';

    [].forEach.call(document.querySelectorAll('.bg-img'), function(elt, index) 
    {
        var src = window.getComputedStyle(elt).backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");

        var title = elt.getAttribute('title');
        if (index === 0)
            strHtml += '<div class="slideshow-slide slideshow-slide-active"><div class="slideshow-img flex-box"><img src="'+src+'" alt="'+title+'" /></div><div class="slideshow-text">'+title+'</div></div>';
        else
            strHtml += '<div class="slideshow-slide"><div class="slideshow-img flex-box"><img src="'+src+'" alt="'+title+'" /></div><div class="slideshow-text">'+title+'</div></div>';

        // Add click to open slideshow.
        (function (_src) {
            on(elt, 'click', function(e)
            {
                openSlideShow(_src);
            });
        })(src);
    });

    strHtml += '</div>'
    strHtml += '<div class="slideshow-prev flex-box" role="button" tabindex="0" onclick="prevSlide()">&#10094;</div>';
    strHtml += '<div class="slideshow-next flex-box" role="button" tabindex="0" onclick="nextSlide()">&#10095;</div>';
    strHtml += '<div class="slideshow-close flex-box" role="button" tabindex="0" onclick="closeSlideShow()">&times;</div>';

    var slideshow = document.createElement('div');
    addClass(slideshow, 'slideshow no-select')
    slideshow.innerHTML = strHtml; 
    document.querySelector('body').appendChild(slideshow);
}

// Util functions.
function addClass (element, className)
{
    element.className += ' ' + className;
}
function removeClass (element, className)
{
    element.className = element.className.replace(new RegExp('(?:^|\\s)'+ className + '(?:\\s|$)'), ' ');
}
function on(element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.addEventListener(type, listener);
    }
}
function bounds(element) 
{
    return element.getBoundingClientRect();
}
function viewportHeight() 
{
    return document.documentElement.clientHeight;
}
function pageOffset() 
{
    var doc = document.documentElement;
    return {
        x : (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y : (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
}
function debounce(func, wait, immediate) 
{
    var timeout;
    return function() 
    {
        var me = this, args = arguments;
        var later = function() 
        {
            timeout = null;
            if (!immediate) func.apply(me, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 250);
        if (callNow) func.apply(me, args);
    };
};