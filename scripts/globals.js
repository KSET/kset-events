//if node.js proxy server is used,
//corsProxy should be http://localhost:8080/fetch?site=
var myFactory = null;
// load only this much feeds
var CUTOFF = 6;
// after how many miliseconds to change the event
var INTERVAL = 5000;
var MAX_HEIGHT = (0.85 * screen.height) * 1;
var HIGHLIGHT = "highlight";
var THUMBNAIL = "thumb";
// colors for event titles
var TITLEC_ON = "orange";
// white-gray
var TITLEC_OFF = "#dbdbdb";
// event fired after an image is sucessfully retrieved
var RESOURCE_LOADED = new Event("resourceLoaded");

var NAMES = ["first", "second", "third", "fourth", "fifth", "sixth"];
