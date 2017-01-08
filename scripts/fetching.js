var handleResource = (function() {
    var resource = 0;

    return function(e) {
        resource++;
        if (resource === CUTOFF) {
            document.body.dispatchEvent(
                new Event("doneLoading")
            );
        }
    };
})();

// tries to fetch data with GET
function fetchData(url, onSuccess, onFailure, isXML) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status === 200) {
                if (isXML) {
                    onSuccess(xhttp.responseXML);
                } else {
                    var myParser = new DOMParser();
                    onSuccess(myParser.parseFromString(
                                xhttp.responseText, "text/html"));
                }
            } else {
                onFailure();
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

// extracts data from the RSS feed
// and fires off more request for
// event images
function parseRSS(file, factory) {
    var events = file.getElementsByTagName("item");
    var title, date, parsed, link;

    var cut = events.length <= CUTOFF ? events.length : CUTOFF;

    document.body.addEventListener("resourceLoaded",
            handleResource, false);

    document.body.addEventListener("doneLoading",
            function () {
				$("#myCarousel").carousel("pause").removeData();
				$("#myCarousel").carousel({
  					interval: INTERVAL
				});
			}, true);

    for (var i = 0; i < cut; i++) {
        title = events[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        date = events[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
        link = events[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        date = translateDate(date);
        factory.addEvent(new KSETEvent(title, date, link));

        fetchData(corsProxy + link, function(evNum) {
            return function(f) {
                fetchImage(f, evNum, factory);
            };
        }(factory.size() - 1), failure, false);
    }

}

// searches DOM for the image of a event
function fetchImage(file, evt, factory) {
    var path = "https://www.kset.org" +
        file.getElementsByClassName(THUMBNAIL)[0].getAttributeNode("src").value;
    factory.getAt(evt).changeImgSrc(path);
}

function failure() {
    alert("Oops, something went wrong...");
}
