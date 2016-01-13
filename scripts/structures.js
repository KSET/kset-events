// a container which keeps all events
// and also changes their appearance
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
        if (i >= 0 && i < events.length) {
            return events[i];
        } else {
            console.log("Event index out of bounds!");
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
        if (events.length === 0) return;
        events[0].divObj.style["max-height"] = MAX_HEIGHT;
        setInterval(this.update, interval);
    };
}

// models an event
function KSETEvent(name, date, link) {

    this.name = name;
    this.date = date;
    this.link = link;
    this.divObj = null;
    this.titleObj = null;
    this.dateObj = null;
    this.imgObj = null;
}

// sets the event's image
KSETEvent.prototype.changeImgSrc = function(src) {
    this.imgObj.setAttribute("src", src);
};
