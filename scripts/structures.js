// a container which keeps all events
// and also changes their appearance
function Factory(container, indicator, wrapClass, titleClass,
        dateClass, imageClass) {//, startMinimum) {
    
    var events = [];
    var current = 0;

    this.addEvent = function(ev) {
        var div = document.createElement("div");
	$(div).addClass("item");
	$(div).addClass("container");

	//<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
	var li = document.createElement("li");
	$(li).attr('data-slide-to', events.length);
	$(li).attr('data-target', "#myCarousel");
	
	if (events.length == 0) {
		$(div).addClass("active");
		$(li).addClass("active");
	}

	$(li).appendTo(indicator);

        ev.divObj = div;

	var row1 = document.createElement("div");
	$(row1).addClass("row");

	var row2 = document.createElement("div");
	$(row2).addClass("row");

	var cont = document.createElement("div");
	$(cont).addClass("row");
	$(cont).appendTo(div);

	var capt = document.createElement("div");
	$(capt).addClass("carousel-caption");
	$(capt).appendTo(cont);

	var h1 = document.createElement("h1");
        $(h1).text(ev.name);
	$(h1).appendTo(capt);
        ev.titleObj = h1;

	var p = document.createElement("p");
        $(p).text(ev.date);
	$(p).appendTo(capt);
        ev.dateObj = p;
	
	var img = document.createElement("img");
	$(img).addClass(NAMES[events.length] + "-slide");
	ev.imgObj = img;
	$(img).appendTo(row2);
	$(row2).appendTo(div);

	$(div).appendTo(container);
        //container.appendChild(div);
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
    this.imgObj.onload = function(obj) {
        return function() {
            if (obj.height >= 0.8 * MAX_HEIGHT) {
                console.log("Possible overflow");
                obj.classList.remove(THUMBNAIL);
                obj.height = 0.8 * MAX_HEIGHT;
            } 
            document.body.dispatchEvent(RESOURCE_LOADED);
        };
    } (this.imgObj);
};

// hides the event
KSETEvent.prototype.turnOff = function() {
    this.divObj.style["max-height"] = "";
    this.liObj.style["color"] = TITLEC_OFF;
    this.liObj.classList.remove(HIGHLIGHT);
    this.divObj.style["overflow-y"] = "hidden";
};

// shows the event and highlights its title
KSETEvent.prototype.turnOn = function() {
    this.divObj.style["max-height"] = MAX_HEIGHT + "px";
    this.liObj.style["color"] = TITLEC_ON;
    this.liObj.classList.add(HIGHLIGHT);
};
