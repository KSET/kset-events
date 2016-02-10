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

    var panel = document.getElementById("board");

    for (var i = 0; i < cut; i++) {
        title = events[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        date = events[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
        link = events[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        date = translateDate(date);

        var li = document.createElement("li");
        li.innerHTML = title;
        li.style["color"] = TITLEC_OFF;
        panel.appendChild(li);

        factory.addEvent(new KSETEvent(title, date, link, li));

        fetchData(corsProxy + link, function(evNum) {
            return function(f) {
                fetchImage(f, evNum, factory);
            };
        }(factory.size() - 1), failure, false);
    }

    factory.startSlideshow(INTERVAL);
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
