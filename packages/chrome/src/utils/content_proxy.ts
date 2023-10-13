interface XHRExtended extends XMLHttpRequest {
  _method: string;
  _url: string | URL;
}

(function(xhr) {
  const XHR = XMLHttpRequest.prototype as XHRExtended;
  const open = XHR.open;
  const send = XHR.send;

  XHR.open = function(method, url) {
    this._method = method;
    this._url = url;

    // @ts-expect-error
    return open.apply(this, arguments);
  };

  XHR.send = function () {
    this.addEventListener('load', function () {
      const self = this as XHRExtended;
      const url = typeof self._url === "string" ? self._url : self._url.href;
      
      if (url === "https://www.projet-voltaire.fr/services-pjv/gwt/WolLearningContentWebService") {
        document.dispatchEvent(
          new CustomEvent('__GOT_PROXIED_RESPONSE_VOLTAIRE', {
            detail: this.responseText
          })
        );
      }

    });

    // @ts-expect-error
    return send.apply(this, arguments);
  };
})(XMLHttpRequest);