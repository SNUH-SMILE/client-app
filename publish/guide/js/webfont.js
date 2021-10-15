(function () {
    "use strict";
    // 스매싱 매거진의 '지연된 웹폰트 불러오기' javascript를 안형우가 수정한 것.
    // https://gist.github.com/hdragomir/8f00ce2581795fd7b1b7

    // 한 번 캐시하면 css 파일은 클라이언트 측에 저장한다.
    // 아래 css_href 가 바뀌면 그 때 다시 받는다.
    // woff base64를 내장한 css
    var css_href = '../css/font-base64.css';
    // localStorage 를 지원하지 않는 브라우저를 위한 css
    var css_href_normal = '../css/font.css';

    // 간단한 이벤트 핸들러 함수
    function on(el, ev, callback) {
        if (el.addEventListener) {
            el.addEventListener(ev, callback, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + ev, callback);
        }
    }

    // localStorage 에 글꼴이 저장돼 있거나, 네이티브 브라우저 캐시를 이용해 저장했다면...
    if (
        (window.localStorage && localStorage.font_css_cache)
        || document.cookie.indexOf('font_css_cache') > -1
    ) {
        // 캐시된 버전을 사용한다.
        injectFontsStylesheet();
    } else {
        // 캐시된 버전이 없으면 페이지 로딩을 막지 않고 기다렸다가
        // 페이지가 전부 load 되면 웹폰트를 다운로드한다.
        on(window, "load", injectFontsStylesheet);
    }

    /**
     * css 파일이 브라우저에 저장됐는지 확인하는 함수.
     * @param href
     * @returns {Storage|string|*|boolean}
     */
    function isFileCached(href) {
        return (
            window.localStorage
            && localStorage.font_css_cache
            && (localStorage.font_css_cache_file === href)
        );
    }

    /**
     * 구형 브라우저 탐지 함수.
     * 로컬 스토리지나 ajax 를 지원하지 않는 경우
     * <html> 태그에 oldie 클래스가 붙은 경우
     * (IE8 이하인 경우 <html class="oldie  ie8"> 하는 식으로 미리 처리해 둬야 한다.
     * https://css-tricks.com/snippets/html/add-body-class-just-for-ie/ 참고)
     * @returns {boolean}
     */
    function isOldBrowser(){
        return (
            !window.localStorage
            || !window.XMLHttpRequest
            || (document.getElementsByTagName('html')[0].className.indexOf('oldie') > -1) // IE8 이하
        );
    }

    /**
     * 실제 css 내용을 넣는 함수
     */
    function injectFontsStylesheet() {
        // 구형 브라우저라면 link 요소를 만들어서 head에 때려 박는다.
        // 이 때는 css_href_normal 을 사용한다.
        if (isOldBrowser()) {
            var stylesheet = document.createElement('link');
            stylesheet.href = css_href_normal;
            stylesheet.rel = 'stylesheet';
            stylesheet.type = 'text/css';
            // 네이티브 브라우저 캐시 사용. 오래 가도록 서버에 만료일을 최대한 길게 설정하자.
            document.getElementsByTagName('head')[0].appendChild(stylesheet);
            // 쿠키에 표시한다.
            document.cookie = "font_css_cache";
        } else {

            // 구형 브라우저가 아닌 경우
            if (isFileCached(css_href)) {
                // 로컬 스토리지에 캐시한 버전이 있다면 그걸 <head>에 박는다.
                injectRawStyle(localStorage.font_css_cache);
            } else {
                // 아니면, ajax 로 불러온다.
                // jQuery 만 쓴 분들은 생소하겠지만, 이게 plain js로 구현한 ajax 다.
                var xhr = new XMLHttpRequest();
                xhr.open("GET", css_href, true);

                // ajax 에서 addEventListener 나 attachEvent 를 지원하지 않는 IE8을 위한 조치
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // ajax 로 받은 css 내용을 <head>에 박는다.
                        injectRawStyle(xhr.responseText);
                        // 그리고 css 내용을 로컬 스토리지에 집어 넣어 나중에도 쓸 수 있게 한다.
                        // 기존에 저장된 것이 있다면 덮어쓴다는 점을 알아 둬라.
                        localStorage.font_css_cache = xhr.responseText;
                        localStorage.font_css_cache_file = css_href;
                    }
                };
                xhr.send();
            }
        }
    }

    /**
     * css 텍스트를 <head>에 집어넣는 간단한 함수
     * @param text
     */
    function injectRawStyle(text) {
        var style = document.createElement('style');
        // style.innerHTML 을 지원하지 않는 IE8을 위한 조치
        style.setAttribute("type", "text/css");
        if (style.styleSheet) {
            style.styleSheet.cssText = text;
        } else {
            style.innerHTML = text;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

}());