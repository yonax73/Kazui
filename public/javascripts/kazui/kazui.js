/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
var Toggle = (function () {
    function Toggle() {
    }
    Toggle.init = function () {
        this.initNavBar();
        this.initDropDown();
    };
    Toggle.initNavBar = function () {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                };
            }
        }
    };
    Toggle.initDropDown = function () {
        var dropdowns = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdowns.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = dropdowns[i];
                element.onclick = function (e) {
                    this.parentNode.classList.toggle('open');
                    e.stopPropagation();
                    return false;
                };
            }
        }
    };
    Toggle.clearDropDown = function () {
        var dropdowns = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdowns.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = dropdowns[i].parentNode;
                if (element.classList.contains('open')) {
                    element.classList.remove('open');
                }
            }
        }
    };
    return Toggle;
})();
var Utils = (function () {
    function Utils() {
    }
    Utils.showActiveLink = function (element) {
        var anchors = element.querySelectorAll('.ui-link');
        var n = anchors.length;
        var url = window.location.pathname;
        url = url.replace(/\//g, '');
        for (var i = 0; i < n; i++) {
            var a = anchors[i];
            var href = a.href.split('/');
            href = href[href.length - 1];
            if (a.classList.contains('active')) {
                a.parentNode.classList.add('remove');
            }
            if (href === url) {
                a.parentNode.classList.add('active');
            }
        }
    };
    return Utils;
})();
Toggle.init();
/*
* Evento click para el  documento.
*/
document.onclick = function () {
    /*
    * Cerrar los dropdowns
    */
    Toggle.clearDropDown();
};
