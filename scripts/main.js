// initializes all containers and sends
// the initial request to the KSET's server
window.onload = function() {
    myFactory = new Factory($("#car-inner"), $("#car-ind"), "wrapper", "title",
            "date", "thumb");

    $('#myCarousel').carousel({
  		interval: false // remove interval for manual sliding
	});

    fetchData(corsProxy + "https://www.kset.org/feeds/rss/",
        function(f) { parseRSS(f, myFactory); }, failure, true);
}
