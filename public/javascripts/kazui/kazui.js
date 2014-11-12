/*
* KAZUI v01 (http://www.kazui.io)
* Copyright 2014 YonaxTics. All rights reserved.
*
* KAZUI commercial licenses may be obtained at
* http://www.kazui.io/purchase/license-agreement/kazui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
var Alert = (function () {
    function Alert(htmlElement) {
        this.element = null;
        this.button = document.createElement('button');
        this.span = document.createElement('span');
        this.p = document.createElement('p');
        this.i = document.createElement('i');
        this.strong = document.createElement('strong');
        this.icoSuccess = 'fa-check';
        this.icoInfo = 'fa-info';
        this.icoWarning = 'fa-exclamation-triangle';
        this.icoDanger = 'fa-times';
        this.icoWait = 'fa-circle-o-notch';
        this.element = htmlElement;
        /*this.element.className = 'hidden';*/
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close();
        };
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }
    Alert.prototype.close = function () {
        this.element.className = 'ui-ease ui-1s bounce-in-down';
        var self = this;
        setTimeout(function () {
            self.element.classList.add('hidden');
        }, 1000);
    };
    Alert.prototype.success = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible ui-ease ui-1s bounce-in-up';
        this.strong.textContent = message;
    };
    Alert.prototype.info = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.strong.textContent = message;
    };
    Alert.prototype.warning = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.strong.textContent = message;
    };
    Alert.prototype.danger = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.strong.textContent = message;
    };
    Alert.prototype.wait = function (message) {
        this.i.className = 'fa  fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.strong.textContent = message;
    };
    return Alert;
})();
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
    Utils.reloadCSS = function (element, href) {
        var queryString = '?reload=' + new Date().getTime();
        element.href = href.replace(/\?.*|$/, queryString);
    };
    return Utils;
})();
window.onload = function () {
    Toggle.init();
};
/*
* Evento click para el  documento.
*/
document.onclick = function () {
    /*
    * Cerrar los dropdowns
    */
    Toggle.clearDropDown();
};
