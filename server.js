(function () {
    "use strict";
    var express = require('express'),
        optimist = require('optimist').default('port', 8080).default('host', '127.0.0.1'),
        color = require('colors'),
        cfg,
        app = express(),
        printDate = function (date) {
            return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
        };
		
	app.use(express.static(__dirname + "/"));
    app.use(express.static(__dirname + "/Script"));
//	app.use(express.static(__dirname + "/Library"));
		
    app.use(express.bodyParser());
    
    cfg = optimist.argv;
    app.listen(cfg.port, cfg.host);
    console.log("Server up: ".green + cfg.host + ":" + cfg.port);
}());