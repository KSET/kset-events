// initializes all containers and sends
// the initial request to the KSET's server
window.onload = function() {
    var cont = document.getElementById("container");

    if(cont === null) {
        cont = document.body;
    }

    myFactory = new Factory(cont, "wrapper", "title",
            "date", "thumb");

    fetchData(corsProxy + "https://www.kset.org/feeds/rss/",
        function(f) { parseRSS(f, myFactory); }, failure, true);
}
