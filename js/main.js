/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() 
{
    'use strict';

    // Check to make sure service workers are supported in the current browser,
    // and that the current page is accessed from a secure origin. Using a
    // service worker from an insecure origin will trigger JS console errors. See
    // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
    var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) 
    {
        navigator.serviceWorker.register('./service-worker.js').then(function(registration) 
        {

            console.log('ServiceWorker registration successful with scope:',  registration.scope);
            
            // updatefound is fired if service-worker.js changes.
            registration.onupdatefound = function() 
            {
                // updatefound is also fired the very first time the SW is installed,
                // and there's no need to prompt for a reload at that point.
                // So check here to see if the page is already controlled,
                // i.e. whether there's an existing service worker.
                if (navigator.serviceWorker.controller) 
                {
                    // The updatefound event implies that registration.installing is set:
                    // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
                    var installingWorker = registration.installing;

                    installingWorker.onstatechange = function() 
                    {
                        switch (installingWorker.state) 
                        {
                            case 'installed':
                            // At this point, the old content will have been purged and the
                            // fresh content will have been added to the cache.
                            // It's the perfect time to display a "New content is
                            // available; please refresh." message in the page's interface.
                            break;

                            case 'redundant':
                            throw new Error('The installing ' +
                            'service worker became redundant.');

                            default:
                            // Ignore
                        }
                    };

                }
            };
        }).catch(function(e) 
        {
            console.error('Error during service worker registration:', e);
        });
    }

    // Your custom JavaScript goes here
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
    var xDown = null;                                                        
    function slideShowOnTouchStart (evt) 
    {             
        xDown = evt.touches[0].clientX;                                      
    }                                            
    function slideShowOnTouchMove (evt) 
    {
        if (!xDown) return;
        var xUp = evt.touches[0].clientX;     
        var xDiff = xDown - xUp;
        if ( xDiff > 0 ) nextSlide();
        else  prevSlide();
        xDown = null;
    }
    function slideShowOnKeyDown (evt)
    {
        evt = evt || window.event;
        if (evt.keyCode == '37')  prevSlide()
        else if (evt.keyCode == '39')  nextSlide();
        else if (evt.keyCode == '27')  closeSlideShow();
    }
    function buildSlideShow()
    {
        var strHtml = '<div class="slideshow-slides">';

        [].forEach.call(document.querySelectorAll('.slide'), function(elt, index) 
        {
            var src;
            if (elt.nodeName == 'IMG') 
                src = elt.getAttribute('src');
            else     
                src = window.getComputedStyle(elt).backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
           
            // Add click to open slideshow.
            (function (_src) {
                on(elt, 'click', function(e)
                {
                    openSlideShow(_src);
                });
            })(src);

            var slideShowIcon = document.createElement('div');
            addClass(slideShowIcon, 'slideshow-icon')
            elt.appendChild(slideShowIcon);

            var title = elt.getAttribute('title');

            if (index === 0) 
                strHtml += '<div class="slideshow-slide slideshow-slide-active">';
            else 
                strHtml += '<div class="slideshow-slide">';

                    strHtml += '<div class="slideshow-img flex-box">';
                        strHtml += '<img src="'+src+'" alt="'+title+'" />';
                    strHtml += '</div>';
                    strHtml += '<div class="slideshow-text">'+title+'</div>';
                strHtml += '</div>';
        });

        strHtml += '</div>'
        strHtml += '<div class="slideshow-prev flex-box" role="button" tabindex="0">&#10094;</div>';
        strHtml += '<div class="slideshow-next flex-box" role="button" tabindex="0">&#10095;</div>';
        strHtml += '<div class="slideshow-close flex-box" role="button" tabindex="0">&times;</div>';

        var slideshow = document.createElement('div');
        addClass(slideshow, 'slideshow no-select')
        slideshow.innerHTML = strHtml; 
        on(slideshow, 'click', function (e)
        {
            if (hasClass(e.target, 'slideshow-prev')) prevSlide();
            else if (hasClass(e.target, 'slideshow-next') || hasClass(e.target, 'slideshow-img')) nextSlide();
            else if (hasClass(e.target, 'slideshow-close')) closeSlideShow();
        }, false);

        document.querySelector('body').appendChild(slideshow);
    }
    function openSlideShow(src)
    {
        var slideshow = document.querySelector('.slideshow');
        if (slideshow !== null)
        {
            on(document, 'keydown', slideShowOnKeyDown);
            on(document, 'touchstart', slideShowOnTouchStart);
            on(document, 'touchmove', slideShowOnTouchMove);

            addClass(document.body, 'slideshow-hide-scrollbars');
            slideshow.querySelector('.slideshow-next').focus();
            if (src !== undefined)
            {
                var activeSlide = slideshow.querySelector('.slideshow-slide-active');
                var nextSlide = slideshow.querySelector('img[src="'+src+'"], img[data-src="'+src+'"]').parentElement.parentElement;
                addClass(nextSlide, 'slideshow-slide-active');
                removeClass(activeSlide, 'slideshow-slide-active');
            }
            addClass(slideshow, 'slideshow-active');
        }
    }
    function closeSlideShow()
    {
        off(document, 'keydown', slideShowOnKeyDown);
        off(document, 'touchstart', slideShowOnTouchStart);
        off(document, 'touchmove', slideShowOnTouchMove);

        removeClass(document.body, 'slideshow-hide-scrollbars');
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

    // Util functions.
    function addClass (element, className)
    {
        element.className += ' ' + className;
    }
    function removeClass (element, className)
    {
        element.className = element.className.replace(new RegExp('(?:^|\\s)'+ className + '(?:\\s|$)'), ' ');
    }
    function hasClass (element, className)
    {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    }
    function on(element, types, listener, useCapture)
    {
        useCapture = useCapture === undefined ? true : false;
        var arrTypes = types.split(' ');
        for (var i = 0; i < arrTypes.length; i++)  
        {
            var type = arrTypes[i].trim();
            element.addEventListener(type, listener);
        }
    }
    function off(element, types, listener)
    {
        var arrTypes = types.split(' ');
        for (var i = 0; i < arrTypes.length; i++)  
        {
            var type = arrTypes[i].trim();
            element.removeEventListener(type, listener);
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
})();