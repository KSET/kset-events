"use strict";

var corsProxy = "http://localhost:8080/fetch?site=";

var myParser = new DOMParser();
var myFactory = null;
var CUTOFF = 6;
var INTERVAL = 7000;
var MAX_HEIGHT = "700px";

var smallDict = new Map();
smallDict.set("Mon", "ponedjeljak");
smallDict.set("Tue", "utorak");
smallDict.set("Wed", "srijeda");
smallDict.set("Thu", "četvrtak");
smallDict.set("Fri", "petak");
smallDict.set("Sat", "subota");
smallDict.set("Sun", "nedjelja");

smallDict.set("Jan", "siječnja");
smallDict.set("Feb", "veljače");
smallDict.set("Mar", "ožujka");
smallDict.set("Apr", "travnja");
smallDict.set("May", "svibnja");
smallDict.set("Jun", "lipnja");
smallDict.set("Jul", "srpnja");
smallDict.set("Aug", "kolovoza");
smallDict.set("Sep", "rujna");
smallDict.set("Oct", "listopada");
smallDict.set("Nov", "studenog");
smallDict.set("Dec", "prosinca");

function fetchXML(url, onSuccess, onFailure, xml) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === XMLHttpRequest.DONE) {
      if (xhttp.status === 200) {
        if(xml)
          onSuccess(xhttp.responseXML);
        else
          onSuccess(myParser.parseFromString(xhttp.responseText, "text/html"));
      } else {
        onFailure();
      }
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
};

function parseDate(date) {
    var d = date.split(" ");
    d = d[1] + ". " + smallDict.get(d[2]) + ' ' + d[3]
            + ". (" + smallDict.get(d[0].replace(',', '')) + ") "
            + d[4];
    return d;
}

function parseXML(file) {
  var events = file.getElementsByTagName("item");
  var title, date, parsed, link;

  var cut = events.length <= 7 ? events.length : CUTOFF;
  for(var i = 0; i < cut; i++) {
    title = events[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
    date = events[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
    link = events[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
    date = parseDate(date);
    myFactory.addEvent(new KSETEvent(title, date, link));
    fetchXML(corsProxy + link, function(evNum) {
        return function(l) {
            findImage(l, evNum);
        };
    }(myFactory.size() - 1), failure, false);
  }
  myFactory.startSlideshow(INTERVAL);
}

function findImage(file, ev) {
  var path = "https://www.kset.org" +
  file.getElementsByClassName("thumb")[0].getAttributeNode("src").value;
  myFactory.getAt(ev).changeImgSrc(path);
}

function failure() {
  alert("Something went wrong...");
}

function Factory(container, wrapClass, titleClass,
        dateClass, imageClass) {
    
    var events = [];
    var current = 0;

    this.addEvent = function(ev) {
        var div = document.createElement("div");
        div.classList.add(wrapClass);
        ev.divObj = div;

        var h2 = document.createElement("h2");
        h2.innerHTML = ev.name;
        h2.classList.add(titleClass);
        ev.titleObj = h2;
        
        var p = document.createElement("p");
        p.innerHTML = ev.date;
        p.classList.add(dateClass);
        ev.dateObj = p;

        var img = document.createElement("img");
        img.classList.add(imageClass);
        ev.imgObj = img;

        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(img);

        container.appendChild(div);
        events.push(ev);
    };

    this.getAt = function(i) {
        if(i >= 0 && i < events.length) {
            return events[i];
        } else {
            throw new Error("Sranje.");
        }
    };

    this.size = function() {
        return events.length;
    };

    this.update = function() {
        var prev = current;
        current = (current + 1) % events.length;
        events[prev].divObj.style["max-height"] = "";
        events[current].divObj.style["max-height"] = MAX_HEIGHT;
    };

    this.startSlideshow = function(interval) {
        if(events.length === 0) return;
        events[0].divObj.style["max-height"] = MAX_HEIGHT;
        setInterval(this.update, interval);
    };
}

function KSETEvent(name, date, link) {
    this.name = name;
    this.date = date;
    this.link = link;
    this.divObj = null;
    this.titleObj = null;
    this.dateObj = null;
    this.imgObj = null;
}

KSETEvent.prototype.changeImgSrc = function(src) {
    this.imgObj.setAttribute("src", src);
};

window.onload = function() {
    var cont = document.getElementById("container");
    
    if(cont === null) {
        cont = document.body;
    }

    myFactory = new Factory(cont, "wrapper", "title",
            "date", "thumb");

    fetchXML(corsProxy + "https://www.kset.org/feeds/rss/",
        parseXML, failure, true);
}
