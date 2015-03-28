define(function() {

    var ajax = function(properties) {
        var requestType = properties.type ? properties.type : 'GET';
        if (!properties.url.match(/\?/)) {
            properties.url += '?ts=';
        } else {
            properties.url += '&ts=';
        }
        properties.url += new Date().getTime();

        var XMLHttpRequest = window.XMLHttpRequest || window.ActiveXObject && function() {return new ActiveXObject('Msxml2.XMLHTTP');},
            xhr = new XMLHttpRequest();

        xhr.open(requestType, properties.url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (properties.success) properties.success(xhr.responseText, xhr.statusText);
                } else {
                    if (properties.error) properties.error(xhr.responseText, xhr.statusText);
                }
            }
        };
        xhr.timeout = 30000;
        xhr.send(properties.data ? properties.data : null);

        return xhr;
    };

    var OnlineWorker = function(url) {
        this._url = url;
    };

    OnlineWorker.prototype = {
        postMessage: function(data) {
            if (this._inactive) return;

            var string;
            if (data instanceof Object) {
                string = JSON.stringify(data);
            } else {
                string = data.toString();
            }

            var self = this;
            ajax({
                type: 'POST',
                url: this._url,
                data: string,
                success: function(response) {
                    if (self.onmessage) {
                        var data;
                        try {
                            data = JSON.parse(response);
                        } catch (e) {
                            data = response;
                        }

                        self.onmessage({data: data});
                    }
                }
            });
        },

        terminate: function() {
            this._inactive = true;
        }
    };

    return OnlineWorker;



});