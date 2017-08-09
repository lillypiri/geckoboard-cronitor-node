var 
	request = require("request")
	, url = require("url")
	, debug = require('debug')('CronitorClient')
;

function CronitorClient (option){
	var defaults = option || {};
	if(defaults){
		this.access_token =  defaults.access_token || null;
		this.endpoint	= defaults.endpoint || "https://cronitor.io/v1";
		this.auth_header = new Buffer(this.access_token + ':').toString('base64');
	}
}

/*****
* Create new cron on cronitor.io
*
* @params {Object}  cron objects
* @params {Callback} Callback (error, body)
*
*/

CronitorClient.prototype.test = function(callback){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors");


	var options = {
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
		}
	};

	request( options, 
			function(err, res, body){
				if(err){
					debug( "Got Error:  %s", err );
					callback(err, null);
				}else{
					debug( body);
					if( res.statusCode === 403){
						debug("Access key invalid or absent");
						err = body;
						body = null;
					}
				}
				callback(err,body);
				
		});

}

/****
* Create new monitor
* 
* @params { Object } obj monitor information
* @returns {Callback} callback (err, body)
*
*/
CronitorClient.prototype.new = function(obj, callback){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors");


	var options = {
		method: 'POST',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		body: obj,
		json: true
	};

	request( options, 
			function(err, res, body){
				debug(err, body);
				if( res.statusCode !== 201){
					callback(body, null);
				}else{
					callback(err, body);
				}

		});
}

/**
* Fetch all monitors 
*
* @returns {Object} Array of monitors
*
*/
CronitorClient.prototype.all = function( filter, cb){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors");

	var params = {};
	var callback = null;
	var args = Array.prototype.slice.call(arguments);

	if( args.length === 1){
		callback = args[0];
	}else{
		params = args[0];
		callback = args[1];
	}

	var options = {
		method: 'GET',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		json: true,
		qs: params
	};

	request( options, 
			function(err, res, body){
				debug(body);
				if( res.statusCode !== 200){

					callback(body, null);
				}else{
					callback(err, body);
				}
		});
}


/**
* Read single monitor
*
* @params { String} monitor code
* @return {Object} monitor
*/

CronitorClient.prototype.get = function( code,callback){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors/"+ code);


	var options = {
		method: 'GET',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		json: true
	};

	request( options, 
			function(err, res, body){

				if( res.statusCode !== 200){
					callback(body, null);
				}else
					callback(err, body);
		});
}


/**
* Update  monitor
*
* @params { String} monitor code
* @params {Object} monitor info to update
* @return {Callback} Callback object with result or error
*/

CronitorClient.prototype.update = function( code, obj, callback){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors/"+ code);


	var options = {
		method: 'PUT',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		body: obj,
		json: true
	};

	request( options, 
			function(err, res, body){

				if( res.statusCode !== 200){
					callback(body, null);
				}else
					callback(err, body);
		});
}

/**
* Delete  monitor
*
* @params { String} monitor code
* @return { Callback } Callback 
*/

CronitorClient.prototype.delete = function( code, callback){

	var finalURL = url.resolve( this.endpoint, "/v1/monitors/"+ code);


	var options = {
		method: 'DELETE',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		json: true
	};

	request( options, 
			function(err, res, body){
				if( res.statusCode !== 204){
					callback(body, null);
				}else
					callback(err, body);
		});
}

/**
* Unpause  monitor
*
* @params { String} monitor code
* @return { Callback } Callback 
*/

CronitorClient.prototype.unpause = function( code, callback){

	var finalURL = url.resolve( this.endpoint, "/"+ code + "/pause/0");


	var options = {
		method: 'GET',
		url: finalURL,
		port: 443,
		headers: {
			'Authorization': 'Basic ' + this.auth_header
			},
		json: true
	};

	request( options, 
			function(err, res, body){
				if( res.statusCode !== 200){
					callback(body, null);
				}else
					callback(err, body);
		});
}



module.exports = CronitorClient;

