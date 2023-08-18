var blueKaiTimeOut = 600;
var liveRampTimeOut = 700;
var global_liveRampResponse = "";
var global_idlValue = "";
var liveRampResp = '';
var liveRamp_RespTime = '';
var cuuid = '';
// JSON object variable to set indicator for  liveRamp call
	
var liveRampIndicator = {
    callStatus: '-', // callStatus - check whether LiveRamp call success or error.  [1->(lr call success),0->(lr timedout/failed),- ->(no call)]
    idlResponse: '-', // idlResponse - set indicator depends upon response from LiveRamp call . 1->XY, 0->empty, 2->Xc, 3->Xi, - -> (no call)
    idlLinkInOS: '0', // idlLinkInOS - indicates if os request had idl value. 1->(idl in os), 0->(idl not in os)
    responseTime: '' // responseTime  - response time in ms for the LiveRamp call
};
var cuttentdomain = (location.hostname == 'localhost') ? location.hostname : '.citi.com';

setLiveRampPixel();
fireBlueKaiCall();
function getCUUID() {

    var cookieName = "CUUID" + "="; //get cookiename CUUID
    var decodedCookie = decodeURIComponent(document.cookie); //decode cookie
    var ca = decodedCookie.split(';'); //split cookie, using ; as delimiter
    for (var i = 0; i < ca.length; i++) { //go through cookies find CUUID cookie name
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookieName) == 0) {
            if(c.substring(cookieName.length) != null && c.substring(cookieName.length) != undefined && c.substring(cookieName.length) != ""){
                var cookie = c.substring(cookieName.length);
                console.log("Old CuuidCookie", cookie)
                return cookie; //return CUUID value
            }
        }
    }
    const DATE = new Date();
    DATE.setTime(DATE.getTime() + (3600 * 1000 * 24 * 365));
    const newCuuid = newCookie();
    document.cookie = "CUUID=" + newCuuid + "; expires=" + DATE.toUTCString() + "; path=/;" + "domain=" + cuttentdomain ; //TODO add "secure" attribute
 
    console.log("CUUIDCookie",newCuuid)
    // return newCuuid;
}
function newCookie(){
    options = {};

    var rnds = rng(); //define rng
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    return bytesToUuid(rnds);
}
function rng(){
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
 
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    getRandomValues(rnds8);
    return rnds8;
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
}
}

function bytesToUuid(buf){
    var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
  var i = 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');

};

//This is Blue kai call
function fireBlueKaiCall(){
    var cookieName = "BKDMP" + "="; //get cookiename BKDMP
    var decodedCookie = decodeURIComponent(document.cookie); //decode cookie
    var ca = decodedCookie.split(';'); //split cookie, using ; as delimiter
    //Set BKDMP cookie since none is present
    var blueKaiUrl = 'https://stags.bluekai.com/site/19469?ret=json';
    var res = httpCall("GET", blueKaiUrl, true, blueKaiTimeOut);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function httpCall(type ,url, async, timeout){
    var xmlHttp = new XMLHttpRequest();
	if(url.indexOf("identity") != -1 || url.indexOf("bluekai") != -1){
		xmlHttp.withCredentials= true;
	}
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if(url.indexOf('bluekai') != -1){
                var  bluekaiResponse = JSON.parse(xmlHttp.response);
                bluekaiCallback(bluekaiResponse);
            }
        }
    }
    xmlHttp.open(type, url, async); // Makes the http get call true for asynchronous, type would be like "get"
    if(timeout != -1){
        xmlHttp.timeout = timeout;
    }

    var start_time = new Date().getTime();
    xmlHttp.onload = function () { //request finished
        if (xmlHttp.readyState === xmlHttp.DONE) {
            if (xmlHttp.status === 200) {
                if(url.indexOf('identity') != -1){
                    var diff =  new Date().getTime() - start_time;
                    liveRamp_RespTime = diff; 
                    liveRampIndicator.callStatus = '1';
                    liveRampIndicator.responseTime = liveRamp_RespTime;
                    liveRampResp =  xmlHttp.response;
                   
					if (liveRampResp != null && liveRampResp != "" && liveRampResp != undefined) {
                        global_liveRampResponse = liveRampResp;
                        var convertedToJson = JSON.parse(global_liveRampResponse);
                        var lrResponse = convertedToJson.idl.substring(0,2);
                        //LR parameter for tagging 
					    liveRampIndicator.idlResponse = (lrResponse!='') ? ((lrResponse == 'XY') ? 1 : ((lrResponse == 'Xc') ? 2 : ((lrResponse == 'Xi') ? 3 : '-'))): '0';
                        validateLiveRampResponse(global_liveRampResponse, convertedToJson);
                        
                    }
                    else {
                        liveRampIndicator.idlResponse = '0';
                    }
                }
                
                return xmlHttp.response
            }
        }
    };

    xmlHttp.ontimeout = function (e) { //request timedout
        console.log('timeout error for url:'+ url + 'error:' + e);
        if(url.indexOf('identity') != -1){
        console.log('timeout error for LiveRamp Call:'+ url + 'error:' + e); 
        liveRampIndicator.callStatus = '0';
        try {
            liveRampIndicator.responseTime = new Date().getTime() - start_time;
        } catch (e) {
            console.log('Error occurs in response time', e.message);
        }
    }
        return -1;
      };

    xmlHttp.onerror = function (e) { //failing in both local scenarios
        console.log('error for url:'+ url + 'error:' + e);
        
        if(url.indexOf('identity') != -1){
            console.log('timeout error for LiveRamp Call:'+ url + 'error:' + e);
        liveRampIndicator.callStatus = '0';
        try {
            liveRampIndicator.responseTime = new Date().getTime() - start_time;
        } catch (e) {
            console.log('Error occurs in response time', e.message);
        }
    }
        return -1;
    }

    xmlHttp.send(null);
    return xmlHttp.response
}

function bluekaiCallback(blkuekaiData){    
    if (blkuekaiData) {
        parseBlueKaiResponse(blkuekaiData);
    }
    else {
        document.cookie = "BKDMP=;  path=/; domain=" + cuttentdomain;
    }     
}
function parseBlueKaiResponse(bkResponse) {
    var parsed_bk_result_format = '';
    if (bkResponse && bkResponse.campaigns && bkResponse.campaigns.length > 0) {
        if (bkResponse.campaigns.length == 1 && this.blueKaiCampaignIdCheck == bkResponse.campaigns[0].campaign) {
            bkResponse.campaigns.length = 0;
            return;
        }
    }

    if (!Array.prototype.reduce || !Array.prototype.map){
        for (let i = 0; i < bkResponse.campaigns.length; i++) {
            var c = bkResponse.campaigns[i];
            var campaignid = parseInt(c.campaign);
            var categoriesTotal = '';
            for (var j = 0; j < c.categories.length; j++) {
                var cid = parseInt(c.categories[j].categoryID);
                if (j != c.categories.length - 1)
                    categoriesTotal = categoriesTotal + cid + "|";
                else
                    categoriesTotal = categoriesTotal + cid;
            }
            if (i != bkResponse.campaigns.length - 1)
                parsed_bk_result_format = parsed_bk_result_format + campaignid + ":" + categoriesTotal + "-";
            else
                parsed_bk_result_format = parsed_bk_result_format + campaignid + ":" + categoriesTotal;
        }
    }else{
        var parsing_bk_results = [];
        bkResponse.campaigns.reduce(function(i, v) {
            parsing_bk_results.push(v.campaign + ':' + v.categories.map(function(elem) {
                return elem.categoryID;
            }).join("|"));
        }, true);
        parsed_bk_result_format = parsing_bk_results.join('-');
    }
    console.log('location: banner.js, BKDMP cookie value is', parsed_bk_result_format);
    document.cookie = "BKDMP=" + parsed_bk_result_format + ";domain=" + cuttentdomain + ";path=/";
}

function fireLiveRampCall() {
    
    var liveRampUrl = "https://api.rlcdn.com/api/identity?pid=1&rt=idl";
    var start_time = new Date().getTime();
    var header = {
        "Access-Control-Allow-Credentials": "true",
        "access-control-allow-origin": "https://api.rlcdn.com",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    };
    var res = httpCall("GET", liveRampUrl, header, liveRampTimeOut);
    var end_time = new Date().getTime();
    console.log('location: banner.js, Live Ramp call successful, response is', res + 'end time', end_time );
}


function validateLiveRampResponse(stringtoValidate, convertedToJson) {
    var flag = false;
    var idl = "";
    var blackListKeyFound = false;
    var whiteListKeyFound = false;
    var liverampValidationObject = { "blackListKeywords": ["script", "embed", "object"], "whiteListVariables": ["idl"] }
    // Validate string against blacklist keywords of whole liveramp response
    for (let i = 0; i < liverampValidationObject.blackListKeywords.length; i++) {
        blackListKeyFound = (stringtoValidate.indexOf(liverampValidationObject.blackListKeywords[i]) == -1) ? false : true
        if (blackListKeyFound) {
            return flag;
            //idl var set above
            
        }
    }

    // Validate json against whitelist words to find if key present
    for (let i = 0; i < liverampValidationObject.whiteListVariables.length; i++) {
        whiteListKeyFound = convertedToJson[liverampValidationObject.whiteListVariables[i]] ? true : false;
        if (whiteListKeyFound) {
           idl = convertedToJson[liverampValidationObject.whiteListVariables[i]];
            global_idlValue = idl;
            flag = true;
        }
    }
    return flag;
    
}


//pixel Call
function setLiveRampPixel(){
    new Promise((resolve) => {
        var isAggregatorTraffic = false;
        // TODO set userType in cookie and create clearUserExp flag.
        var clearUserExp = false;
        var liverampPixelImage = document.createElement("IMG");

        //call getcuuid function to get from cookie
        cuuid = getCUUID();
        var liveRampPixelURL = 'https://idsync.rlcdn.com/463166.gif?partner_uid'; // TODO - add to and fetch from content

        if (!isAggregatorTraffic) {
            liveRampPixelURL = liveRampPixelURL + "=" + cuuid;
            liverampPixelImage.setAttribute("src", liveRampPixelURL); //Makes the liveRampPixel Call
        }

        liverampPixelImage.addEventListener('load', function () {
			resolve(liverampPixelImage);
		});
		// Handle call error
		liverampPixelImage.addEventListener('error', function () {
			resolve(null);
		});
		liverampPixelImage.addEventListener('abort', function () {
			resolve(null);
		});
		// Handle call timeout
		setTimeout(function () {
			resolve(null);
        }, liveRampTimeOut);
    }).then((liverampPixelImg) => {		
        if (!liverampPixelImg){
            console.log('Pixel load timed out. Triggering the idl api call');
        }
		fireLiveRampCall();
		return;
    })
    .catch(error => {
        console.log('Pixel failed. Triggering the idl api call ', error);
        fireLiveRampCall();
		return;
    });
};