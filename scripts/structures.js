// a container which keeps all events
// and also changes their appearance
function Factory(container, wrapClass, titleClass,
        dateClass, imageClass) {//, startMinimum) {
    
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

        div.addEventListener("transitionend", function (obj) {
            return function() {
                if (obj.style["max-height"] !== "") {
                    obj.style["overflow-y"] = "visible";
                } else {
                    obj.style["overflow-y"] = "hidden";
                }
            };
        }(div), false);
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

    // hide the current event, and display next one
    this.update = function() {
        var prev = current;
        current = (current + 1) % events.length;
        events[prev].turnOff();
        events[current].turnOn();
    };

    // start swapping events
    this.startSlideshow = function(interval) {
        if (events.length === 0) return;
        events[current].turnOn();
        setInterval(this.update, interval);
    };
}

// models an event
function KSETEvent(name, date, link, bullet) {
    this.name = name;
    this.date = date;
    this.link = link;
    this.liObj = bullet;
    this.divObj = null;
    this.titleObj = null;
    this.dateObj = null;
    this.imgObj = null;
}

// sets the event's image
KSETEvent.prototype.changeImgSrc = function(src) {
    this.imgObj.setAttribute("src", src);
    this.imgObj.onload = function() {
        document.body.dispatchEvent(RESOURCE_LOADED);
    }
};

// hides the event
KSETEvent.prototype.turnOff = function() {
    this.divObj.style["max-height"] = "";
    this.liObj.style["color"] = TITLEC_OFF;
    this.divObj.style["overflow-y"] = "hidden";
};

// shows the event and highlights its title
KSETEvent.prototype.turnOn = function() {
    this.divObj.style["max-height"] = MAX_HEIGHT;
    this.divObj.style["overflow-y"] = "visible";
    this.liObj.style["color"] = TITLEC_ON;
};
