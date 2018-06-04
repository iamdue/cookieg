/**
 * CookieG cookieconsent wrapper class
 * @desc A cookieconsent.insites.com oszt�lyra �p�l� s�tikezel� oszt�ly.
 * @desc With this class you can simplyfiy you cookieconsent.insites.com COOKIE box implementation.
 * @desc Specify the configuration with a JSON file or with -new CookieG(configurationJSON)-.
 * @author György Sági (gyorgy.sagi@w5labs.com)
 * @date 2018.05.29
 * @version 0.1
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('CookieG', [], factory);
    } else {
        // Browser globals
        root.CookieG = factory(root);
    }
}
(this, function (window) {

    var currentScript = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

    var configPath = currentScript.getAttribute('data-config');

    var loadJSON =function (callback, filePath) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filePath, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    };

    function CookieG(options) {
        this.cookieconsentURLs = {
            'css': '//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css',
            'script': '//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js'
        };

        if(options.hasOwnProperty('css')){
            this.cookieconsentURLs.css = options.css;
        }

        if(options.hasOwnProperty('script')){
            this.cookieconsentURLs.script = options.script;
        }

        this.cookieOptions = options;
        this.init();
    }

    CookieG.prototype = {
        'init': function () {
            this.injectCSS(this.cookieconsentURLs.css);
            this.injectScript(this.cookieconsentURLs.script);
        },
        'initCookieConsent': function () {
            var self = this;
            window.addEventListener("load", function () {
                if (window.hasOwnProperty('cookieconsent')) {
                    window.cookieconsent.initialise(self.cookieOptions);
                } else {
                    console.warn("Cookieconsent not detected");
                }
            });
        },
        'injectCSS': function (css, context) {
            context = context || document.head;
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.setAttribute('class', "cookiecss");
            link.href = css;
            context.appendChild(link);
        },
        'injectScript': function (src, d) {
            var self = this;
            d = d || document;
            var script = d.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
                self.initCookieConsent();
            };
            script.onerror = function () {
                reject(src + ' cannot be added. (Not found, or script error.)');
            };
            script.setAttribute('class', "cookiescript");
            script.src = src;
            d.getElementsByTagName('head')[0].appendChild(script);
        }
    };

    if(typeof configPath !== 'undefined'){
        loadJSON(function(response){
            try{
                var jsonresponse = JSON.parse(response);
                new CookieG(jsonresponse);
            } catch (e) {
                console.warn('Configuration file is not a JSON.')
            }
        }, configPath);
    }

    return CookieG;

}));
