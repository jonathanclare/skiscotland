window.onload = function () 
{ 
    lazyLoad();
    on(window, 'scroll resize', debounce(lazyLoad));
    // Twitter feed.
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
} 

// Remove filename from location.
history.replaceState({}, document.title, ".");

function lazyLoad () 
{
    console.log('lazyLoad');
    [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) 
    {
        var sb = pageOffset().y + viewportHeight();
        if(bounds(img).top < sb)
        {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = function()  
            {
                img.removeAttribute('data-src');
            }
        }
    });
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