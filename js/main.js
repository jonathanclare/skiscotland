window.onload = function () 
{ 
    lazyLoad();
    on(window, 'scroll resize', debounce(lazyLoad));
 } 

// Remove filename from location.
//history.replaceState({}, document.title, '.');
var twitterLoaded = false;
var fbLoaded = false;

function lazyLoad () 
{
    // Images.
    var offset = pageOffset().y
    var pageBottom = offset + viewportHeight();
    [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) 
    {
        var imgTop = offset + bounds(img).top;
        if(imgTop <= pageBottom)
        {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = function() {img.removeAttribute('data-src');}
        }
    });

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

function openArea(area) 
{
    window.location = area + '.html'
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