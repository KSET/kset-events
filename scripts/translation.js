var smallDict = new Map();
// days
smallDict.set("Mon", "ponedjeljak");
smallDict.set("Tue", "utorak");
smallDict.set("Wed", "srijeda");
smallDict.set("Thu", "četvrtak");
smallDict.set("Fri", "petak");
smallDict.set("Sat", "subota");
smallDict.set("Sun", "nedjelja");

// months
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

// translates a date into Croatian
function translateDate(date) {
    var dt = date.split(" ");
    var cro = dt[1] + ". " + smallDict.get(dt[2]) + ' ' + dt[3]
            + ". (" + smallDict.get(dt[0].replace(',', '')) + ") "
            + dt[4];
    return cro;
}
