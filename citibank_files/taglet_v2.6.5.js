//Only pass one lpTag.identities object to LP
function removeExcessIdentities(callback) {
    //console.info("removed excess ident");
    /*     if (typeof chatUtilJson !== "undefined") {
            if (chatUtilJson.acr === "0" || typeof chatUtilJson.sub !== "undefined") {
                // if sub is not blank (authenticated page)
                lpTag.identitiesObjects = { "iss": "Citi", "acr": chatUtilJson.acr, "sub": chatUtilJson.sub };
            } else {
                // sub is blank (unauth page)
                lpTag.identitiesObjects = { "iss": "Citi", "acr": "0" };
            }
        } */
    fixRaceConditionsWithNewPage();
}

//Display the LP buttons by calling newPage in race conditions
function fixRaceConditionsWithNewPage(callback) {

    if (window.location.href.indexOf("online.citi.com") > 0 && window.location.href.indexOf("mortgage") < 0) {

        var newPageRetryCallsCounter = 10;
        var newPageRetryCalls = setInterval(function () {
            //if div id exists but LPMcontainer is not below it, then do newPage() 5 times once per second
            if ((document.querySelector("#old_sp_lp_chat_button") && !document.querySelector("#old_sp_lp_chat_button").childNodes[0])
            || (document.querySelector("#sp_lp_chat_button") && !document.querySelector("#sp_lp_chat_button").childNodes[0])) {
              //console.log("new page in frc");
              var currentSection = lpTag.section? lpTag.section: null;
              var currentCtype = lpCType? lpCType: null;
              lpTag.newPage(document.location.href, {
                "section": currentSection,
                "sdes": [
                  {
                    "type": "ctmrinfo",
                    "info": {
                      "ctype": currentCtype
                    }
                  }]
              });
            }
            newPageRetryCallsCounter--;
            if (newPageRetryCallsCounter === 0) {
                clearInterval(newPageRetryCalls);
            }
        }, 5000);

        removeDoubleButtons();
    }
}

//Hide one of the two duplicate buttons of the same engagement in race conditions
function removeDoubleButtons(callback) {

    /*     var newStickyButton = document.querySelectorAll('img[class="LPMimage"]');
    
        // if double buttons, hide the second button
        if (newStickyButton.length > 1 && newStickyButton[1].style.display !== "none") {
            newStickyButton[1].style.display = "none";
        }
    
        // if duplicate Sticky engagements, hide the second button
        for (let i = 1; i < newStickyButton.length; i++) {
            newStickyButton[i].style.display = "none";
        } */

    hideMobileButtonsBesidesContactUsPage();
}

//Hide all LP buttons when using a mobile browser besides the Contact Us page
function hideMobileButtonsBesidesContactUsPage(callback) {

    /** if mobile browser, only show LP reactive/sticky on Contact Us page **/

    //if mobile and not on Contact Us page
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var newStickyButton = document.querySelector('.LPMcontainer.LPMoverlay'); //the parent LP wrapper that then injects the sticky btn

        for (var i; i < document.querySelectorAll(".LPMcontainer.LPMoverlay").length; i++) {
            var newStickyButton = document.querySelectorAll('.LPMcontainer.LPMoverlay')[i];
            if (newStickyButton && newStickyButton !== null && typeof newStickyButton !== "undefined" && newStickyButton.parentElement.id !== "sp_lp_chat_button") {
                newStickyButton.style.visibility = 'hidden'; //hide the LP button
                //console.log("BUTTON HIDDEN = " + newStickyButton);
            }
        }

    } else { //if desktop continue with rest of flow
        alignStickyWithFeedback();
    }
}

//Align the LP Sticky Engagement with their Feedback button Part 1
function alignStickyWithFeedback(callback) {
    var newStickyButton = document.querySelectorAll('img[class="LPMimage"]')[0];
    var feedbackButton = document.getElementById("nebula_div_btn");

    if (typeof newStickyButton !== "undefined" && typeof feedbackButton !== "undefined" && feedbackButton !== null) {
        newStickyButton.style.position = "fixed";
        newStickyButton.style.right = parseInt(feedbackButton.style.right) + 120 + 'px';
        newStickyButton.style.bottom = "0px";
        newStickyButton.style.left = "";
        newStickyButton.style.top = "";
        newStickyButton.style.marginBottom = "5px";
        newStickyButton.style.lineHeight = "1px";
        //one more line for Spanish pages
        if (lpTag.section.indexOf("lang=es") >= 0 || (document.querySelector("#nebula_div_btn > img") !== null && document.querySelector("#nebula_div_btn > img").alt == "Comentario")) {
            newStickyButton.style.margin = "0px 15px 5px";
            newStickyButton.style.right = parseInt(feedbackButton.style.right) + 115 + 'px'; //fix overlap issue
        }
    }
    alignStickyWithFeedbackHeight();
}

//Align the LP Sticky Engagement with their Feedback button Part 2
function alignStickyWithFeedbackHeight(callback) {

    var newStickyButton = document.querySelectorAll('img[class="LPMimage"]')[0];

    function repositionFeedbackHeightFn() {
        var newStickyButtonLength = document.querySelector('img[class="LPMimage"]');
        var feedbackButtonLength = document.getElementById("nebula_div_btn");

        //feedback higher than sticky btn; Legacy pages
        if (newStickyButtonLength && feedbackButtonLength && newStickyButtonLength.getBoundingClientRect().y - feedbackButtonLength.getBoundingClientRect().y > 0) {
            var differenceTopBtns = newStickyButtonLength.getBoundingClientRect().y - feedbackButtonLength.getBoundingClientRect().y;
            newStickyButtonLength.style.marginBottom = parseInt(newStickyButtonLength.style.marginBottom) + differenceTopBtns + "px";
            //console.info("feedback higher than sticky - fixed at: " + differenceTopBtns);
        }

        //reverse - sticky higher than feedback btn
        if (newStickyButtonLength && feedbackButtonLength && newStickyButtonLength.getBoundingClientRect().y - feedbackButtonLength.getBoundingClientRect().y < 0) {
            var reversedifferenceTopBtns = feedbackButtonLength.getBoundingClientRect().y - newStickyButtonLength.getBoundingClientRect().y;
            newStickyButtonLength.style.marginBottom = parseInt(newStickyButtonLength.style.marginBottom) - reversedifferenceTopBtns + "px";
            //console.info("sticky higher than feedback - fixed at: " + reversedifferenceTopBtns);
        }

        //tell us button repositioning
        var newStickyButton = document.querySelectorAll('img[class="LPMimage"]')[0];
        var feedbackButton = document.getElementById("nebula_div_btn");

        if (newStickyButton && feedbackButton && feedbackButton.offsetWidth && feedbackButton.offsetHeight) { //if the Tell Us button even exists
            if (feedbackButton.offsetWidth == 82 && feedbackButton.offsetHeight == 82) { //detect if Tell Us button vs Feedback button based on height/width
                newStickyButton.style.right = "110px";
                newStickyButton.style.marginBottom = "50px";
            }
        }
    }

    autoCloseWindow();
}

//Automatically close the engagement when they are on a Sign Off page (caused an infinite authentication loop Citi issue)
function autoCloseWindow(callback) {
    //if on sign-off or timed out pages
    if (window.location.href.indexOf('PostSignOffOverlay') > 0 ||
        window.location.href.indexOf('inactivityLandingPage') > 0 ||
        window.location.href.indexOf('CBOLSessionRecovery') > 0 ||
        window.location.href.indexOf('loginpage') > 0 ||
        window.location.href.indexOf('signon/uname/Next.do') > 0 ||
        window.location.href.indexOf('OutsideTimeOutNext.do') > 0 ||
        window.location.href.indexOf('login.do') > 0 ||
        window.location.href.indexOf('sign-off') > 0) {
        //if chat window is open, then click the close button
        if (document.getElementById("lpChat")) {
            document.querySelector('#lpChat > div.lp_maximized.lpmx > div.lp_header > div > div.lp_header-buttons-container > button.lp_close').click();
        }
    }
}

//Loop through this taglet several times to ensure the taglet loads on pages that take long to load
if (window.location.href.indexOf("online.citi.com") > 0 && window.location.href.indexOf("mortgage") < 0) {
    var counter = 5;
    var reconfirmLPTaglet = setInterval(function () {
        removeExcessIdentities();
        counter--;
        if (counter === 0) {
            clearInterval(reconfirmLPTaglet);
        }
    }, 2000);
}

// bind to buttons starting to display event
lpTag.events.bind("LP_OFFERS", "START", function (data, eventInfo) {
    hideMobileButtonsBesidesContactUsPage();
    //remove excess identitiesFn
    if (window.location.href.indexOf("online.citi.com") > 0 && window.location.href.indexOf("mortgage") < 0) {
        var counter = 5;
        var realignStickyFeedback = setInterval(function () {
            removeExcessIdentities();
            counter--;
            if (counter === 0) {
                clearInterval(realignStickyFeedback);
            }
        }, 2000);
    }

});

//Thank you Rewards page customized window
function processThis(data, eventInfo){
    if (lpTag.section && lpTag.section == "thank you rewards") {
        console.log("New TYR window is loaded.");
        document.querySelector("div.lp_maximized.lpmx.lpc_window.lpc_window_maximized.lpc_desktop").style.cssText = "height: 510px";
        document.querySelector("div.lpc_hero-image-area.lpc_hero-image-area_maximized.lpc_desktop").innerText = "Please don\'t share sensitive information here, such as your full account or card number, social security number, password, security word, or card expiration date. We may send you a secure electronic form to collect this information. We may record or monitor this session.";
        document.querySelector("div.lpc_hero-image-area.lpc_hero-image-area_maximized.lpc_desktop").style.cssText = "padding: 30px 30px 30px 30px; height: 130px; background-color: #0363ad; text-align: left; color: #FFFFFF; width: 278px; font-size: 10px; white-space: break-spaces; line-height: 1.4";
        document.querySelector("div.lp_header.lpc_maximized-header.lpc_desktop").style.cssText = "border-color: #0363ad; background-color: #0363ad";
        document.querySelector("div.lp_lpview_mp.lp_main_area").style.cssText = "margin-top: -27px";
        //Fixing scroll bar to be below the new tile 
        document.querySelector("div.lp_location_center").style.cssText = "overflow-y: hidden";
        document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").style.cssText = "overflow-y: auto; height: 300px";
    }
};
lpTag.events.bind("lpUnifiedWindow", "state", processThis);

//when chat window is open
lpTag.events.bind("lpUnifiedWindow", "state", function (eventData, eventInfo) {

    //wait for header to appear first before invoking start a convo
    var waitForElSAC = function (selector, callback, maxTimes) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            if (maxTimes === false || maxTimes > 0) {
                maxTimes--;
                setTimeout(function () {
                    waitForElSAC(selector, callback, maxTimes);
                }, 500);
            }
        }
    };

    if (eventData.state !== "init") {
        waitForElSAC("div.lp_logo_image_wrapper", startAConvoFn, 20); //wait for the header icon before invoking start a convo fn
    }

    var counter = 1;
    var pushSAC = setInterval(function () {
        if (document.querySelector(".lp_logo_image_wrapper") != null) {
            startAConvoFn();
        };
        counter--;
        if (counter === 0) {
            clearInterval(pushSAC);
        }
    }, 1000);

    /** START: Mutation observer **/
    // Select the node that will be observed for mutations
    var targetNodeLP = document.querySelector("div.lpc_transcript.lpc_transcript_maximized");

    // Options for the observer (which mutations to observe)
    var configLP = {
        attributes: true,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    var callbackLP = function (mutationsList, observerLP) {
        // Use traditional 'for loops' for IE 11
        //for (var mutation of mutationsList) {
        for (i = 0; i < mutationsList.length; i++) {
            //if (mutation.type === 'childList') {
            //lp chat window is open
            if (document.querySelector("#lpChat") !== null) {
                if (document.querySelector("div.lpc_transcript.lpc_transcript_maximized") !== null) {
                    document.querySelector("div.lpc_transcript.lpc_transcript_maximized").scrollTop = document.querySelector("div.lpc_transcript.lpc_transcript_maximized").scrollHeight;
                }
            }
            //}
        }
    };

    // Create an observer instance linked to the callback function
    var observerLP = new MutationObserver(callbackLP);

    // start observing if not on mobile device
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { //only desktop customers
        if (window.location.href.indexOf("nafeez") > 0) { //only fire if URL contains word nafeez
            observerLP.observe(targetNodeLP, configLP);
        }
    }
    /** END: Mutation observer **/

    //replace typing indicator
    if (document.getElementsByClassName('lpc_typing-indication')[0]) {
        document.getElementsByClassName('lpc_typing-indication')[0].innerText = "...";
        document.getElementsByClassName("lpc_typing-indication")[0].style.fontSize = "x-large";
        document.getElementsByClassName("lpc_typing-indication")[0].style.top = "-40px";
    }

}); //end lpUnifiedWindow bind

//hide our blue sticky button from the Print Preview page
if (!styleTagLP1) {
    var head = document.getElementsByTagName('head')[0];
    var styleTagLP1 = document.createElement('style');
    styleTagLP1.setAttribute('type', 'text/css');
    var css = '@media print{ img.LPMimage { display:none; } }';
    if (styleTagLP1.styleSheet) { // IE
        styleTagLP1.styleSheet.cssText = css;
    } else { // the world
        styleTagLP1.appendChild(document.createTextNode(css));
    }
    head.appendChild(styleTagLP1);
}

//stylesheets for Start a Convo project
if (!styleTagLP4) {
    var styleTagLP4 = document.createElement('link');
    styleTagLP4.rel = "stylesheet";
    //styleTagLP4.id = "fontAwesomeLP";
    styleTagLP4.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
    head.appendChild(styleTagLP4);
}

if (!styleTagLP5) {
    var styleTagLP5 = document.createElement('link');
    styleTagLP5.rel = "stylesheet";
    //styleTagLP5.id = "startAConvoLP"
    styleTagLP5.href = "https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/style.css";
    head.appendChild(styleTagLP5);
}

//start a convo function
function startAConvoFn() {
    let ctypeSde = lpTag.sdes.get().ctmrinfo? lpTag.sdes.get().ctmrinfo[0].info.ctype:null;
    let spanishIpb = [ 'cbol-ipb-blue', 'cbol-ipb-ci-gold', 'cbol-ipb-cpci', 'cbol-ipb-geb-blue', 'cbol-ipb-geb-gold', 'cbol-ipbipb', 'cbolcpc-i'];

    /** if logo is there, section is spanish */
    if (document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized") !== null && lpTag.section.includes('lang=es') && spanishIpb.includes(ctypeSde)) {
        runStartAConvoFnSpanish();
        /** if logo is there, and section is FUIP Prelogin */
    } else if (document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized") !== null && lpTag.sdes.get().ctmrinfo && lpTag.sdes.get().ctmrinfo[0].info.ctype !== "wealthbuilder") {
        runStartAConvoFn();
        /** if logo is there, and section is FUIP Prelogin */
    } else if (document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized") !== null && lpTag.section[0] == "FUIP-PreLogin") {
        runStartAConvoFn();

        /** handle issue where ctype isn't passed on page */
    } else if (document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized") !== null && lpTag.sdes.get().ctmrinfo === undefined) {
        runStartAConvoFn();

    } else {
        //console.log("nafeez - did not qualify for SAC");
    }

    function runStartAConvoFn() {
        //hide the citi logo image when mobile browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            if (document.querySelector(".lp_logo_area_wrapper")) {
                document.querySelector(".lp_logo_area_wrapper").style.display = "none";
            }

            //still replace typing indicator
            if (document.getElementsByClassName('lpc_typing-indication')[0]) {
                document.getElementsByClassName('lpc_typing-indication')[0].innerText = "...";
                document.getElementsByClassName("lpc_typing-indication")[0].style.fontSize = "x-large";
                document.getElementsByClassName("lpc_typing-indication")[0].style.top = "-40px";
            }

            //not a mobile device
        } else {

            //resize window to viewheight
            document.querySelector("#lpChat > div.lp_maximized").style.height = "80vh";

            //typing indicator
            document.getElementsByClassName('lpc_typing-indication')[0].innerText = "...";
            document.getElementsByClassName("lpc_typing-indication")[0].style.fontSize = "x-large";
            document.getElementsByClassName("lpc_typing-indication")[0].style.top = "-40px";

            var styleTagLP4 = document.createElement('link');
            styleTagLP4.rel = "stylesheet";
            //styleTagLP4.id = "fontAwesomeLP";
            styleTagLP4.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
            head.appendChild(styleTagLP4);

            var styleTagLP5 = document.createElement('link');
            styleTagLP5.rel = "stylesheet";
            //styleTagLP5.id = "startAConvoLP"
            styleTagLP5.href = "https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/style.css";
            head.appendChild(styleTagLP5);

            var htmlCode = "<div class='right-sidebar'><div class='livechat-cards'><div class='cards-carousel'><div class='livechat-card dark' id='carousel1'><div class='full'><div class='disc'>Please do not share any sensitive account information here, such as your security word or expiration date. This conversation may be recorded and monitored. Take a look at these quick tips to get the most out of Message Us.</div></div></div><div class='livechat-card d-none' id='carousel2' style='margin-right: 2px'><div class='title' style='padding-bottom:5px'> <span class='title' style='font-size:large'>Virtually Anytime, Anywhere</span></div><div class='first'><div class='disc'>Start a conversation on the <b>Citi Mobile&reg; App</b> and pick it up where you left off on Citi.com, or vice versa. <br><span class='appLink'><u>Launch Mobile App</u></span></div></div><div class='second'><div class='design-img'> <img src='https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/assets/pushnotifyillustration.png' alt='Illustration of woman texting on her phone' /></div></div></div><div class='livechat-card d-none' id='carousel3' style='margin-right: 2px'><div class='title' style='padding-bottom:5px'> <span class='title' style='font-size:large'>How It Works</span></div><div class='first'><div class='disc'>It&#39;s easy. Type what you&#39;re looking for in a few words and Citi&reg; Bot or a representative will assist you.</div></div><div class='second'><div class='design-img'> <img src='https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/assets/howbotworks.png' alt='Illustration of woman texting on her phone' /></div></div></div></div><div class='carousel-nav dark' style='margin-left: -2px; width: 340px; height: 42px; margin-top: 5px;'><ul id='carouselNavUL'><li class='prev d-none' style='display: none;'><i class='fas fa-angle-left' aria-label='Previous' style='margin-top:2px'></i></li><li class='active' id='carousel1bubble1' aria-label='1 of 3'></li><li id='carousel1bubble2' aria-label='2 of 3'></li><li id='carousel1bubble3' aria-label='3 of 3'></li><li class='next'><i class='fas fa-angle-right' style='margin-top:2px' aria-label='Next'></i></li></ul></div></div></div>";

            /** 
             * Start A Convo just one slide for the Wealth Builder windows only
             */
            if (lpTag.section && lpTag.section == "wealthbuilder") {
                htmlCode = "<div class='right-sidebar' tabindex='0'><div class='livechat-cards'><div class='cards-carousel' tabindex='0'><div class='livechat-card dark' id='carousel1' tabindex='0'><div class='title' style='padding-bottom:5px'> <span class='title' style='font-size:large' tabindex='0'>How It Works</span></div><div class='first'><div class='disc' tabindex='0'>Tell Citi Bot&reg; what you need in just a few words. If you ever need live assistance, type <q>representative.</q></div></div><div class='second'><div class='design-img'> <img tabindex='0' src='https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/assets/howbotworks.png' alt='Illustration of woman texting on her phone' /></div></div></div></div></div></div>";
            }

            // Collections rewording the Welcome Message for Proactive PopUp
            if (window.location.href.indexOf("forbearancenafeez") > 0) {
                if (document.querySelector("#lp_line_bubble_0").innerText) {
                    document.querySelector("#lp_line_bubble_0").innerText = "Welcome to Citi Message Us. Having hardship with payments? We can help!"
                }
            }

            //var lp = document.querySelector("div.lpc_hero-image-area.lpc_hero-image-area_maximized.lpc_desktop");
            //var lp = document.querySelector(".lp_logo_area_wrapper");
            var lp = document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized");
            lp.innerHTML = htmlCode;

            //fix top chat transcript line from going into the top carousel
            document.querySelector("div.lp_lpview_mp.lp_main_area.lp_logo_top_margin").style.marginTop = "165px";


            //olena fixes
            //Header; eliminating menu button
            document.getElementsByClassName('lp_slider lpc_maximized-header__slider-button lpc_desktop')[0].style.cssText = "display: none";

            //Merging cards and header together
            document.getElementsByClassName('lp_header lpc_maximized-header lpc_desktop')[0].style.cssText = "background-color: #003378; border-color: #003378; font-size: 17px; border-radius: 0";
            document.getElementsByClassName('cards-carousel')[0].style.cssText = "margin-top: -5px; height: 122px; width: 340px";
            document.getElementById('carousel1').style.cssText = "background-color: #003378; height: 122px; width: 340px";

            //Styling cards disclaimer text
            document.querySelector('.disc').style.cssText = "font-family: Interstate-Light; font-size: 10px; padding: 15px 5px; height: 107px";

            //Styling the title and description to match the mock-up
            document.querySelector("span.lp_top-text.lpc_maximized-header__text.lpc_desktop").style.cssText = "font-family: Interstate-Regular; font-size: 17px; color: #FFFFFF; letter-spacing: 0";

            //Scrolling bar height adjustment and eliminating second scrollbar and eliminating blue border popping up
            document.querySelector('.lp_location_center').style.cssText = "overflow-y: hidden; outline: none";

            //Shift Chat header title to the left 5px
            document.querySelector("div.lp_title.lpc_maximized-header__text-wrapper.lpc_desktop").style.marginLeft = "10px";

            //Width and height of the window
            // document.getElementsByClassName('lp_maximized lpmx lpc_window lpc_window_maximized lpc_desktop lp_maximized_large')[0].style.cssText = "width: 340px; bottom: 5px; right: 0; border-radius: 0";
            document.getElementsByClassName('lp_maximized lpmx lpc_window lpc_window_maximized lpc_desktop lp_maximized_large')[0].style.width = "342px";

            //Adding grey bottom border for white cards
            document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 118px 0px; height: 40px";

            //Footer
            //Eliminating menu button
            //document.getElementsByClassName('lp_actions_button lpc_composer__menu-button')[0].style.cssText = "display: none";

            //Styling of the text area
            document.getElementsByClassName('lpview_form_textarea')[0].style.cssText = "font-weight: normal; font-style: normal; color: #000; font-size: 1.1em; ";
            document.getElementsByClassName('lp_bottom_area')[0].style.cssText = "border-top: 1px solid #4CA6F3";

            //Scrolling bar height adjustment and eliminating second scrollbar and eliminating blue border popping up
            document.querySelector('.lp_location_center').style.cssText = "overflow-y: hidden; outline: none";

            //New shorter scrollbar, Needs fixing for onmouse
            document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").style.overflowY = "hidden";
            document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").style.overflowX = "hidden";

            //Function to replace input area text
            if (document.querySelector('.lpview_form_textarea.lpc_composer__text-area.lpc_desktop').placeholder !== "Enter text here") {
                document.querySelector('[placeholder="Type your message"]').placeholder = "Enter text here";
            }

            //auto scroll to bottom
            if (document.querySelector("#lpChat") !== null) {
                if (document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop") !== null) {
                    document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").scrollTop = document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").scrollHeight;
                }
            }

            //olena new fixes again
            document.querySelector("div.lp_main.lpc_body.lpc_desktop").style.cssText = "outline: none";
            document.getElementById('carousel1').style.cssText = "margin-left: -2px; width: 340px";
            document.getElementsByClassName('lp_location_center')[0].style.cssText = "scroll-behavior: smooth";
            document.querySelector('.lp_location_center').style.cssText = "outline: none";
            document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 30px 0px 30px; height: 40px";
            document.getElementsByClassName('carousel-nav dark')[0].style.cssText = "margin-left: -2px; width: 340px; margin-top: 5px";
            document.querySelector(".carousel-nav.dark").style.marginLeft = "-2px";
            document.querySelector(".carousel-nav.dark").style.width = "340px";
            document.querySelector(".carousel-nav.dark").style.marginTop = "5px";
            document.querySelector(".carousel-nav.dark").style.padding = "10px 118px 0px";

            //resize window to viewheight
            document.querySelector("#lpChat > div.lp_maximized.lpmx.lpc_window.lpc_window_maximized.lpc_desktop.lp_maximized_large").style.height = "80vh"

            //widget resize as well
            document.querySelector(".lpc_slider.lp_slider.lpc_desktop").style.height = "70vh";

            //fix IE11 style issues
            document.getElementsByClassName('livechat-cards')[0].style.cssText = "width: 340px";
            document.querySelector(".carousel-nav.dark").style.height = "42px";
            document.querySelector(".carousel-nav.dark").style.outline = "none";

            /** Carousel click events **/

            //click QR code app link to open the widget
            document.querySelector(".appLink").addEventListener("click", function (e) {
                var widgetIcon = document.querySelectorAll(".lp-slider-icon")[0];
                widgetIcon.click();
            });

            //clicking on right arrow
            document.querySelector(".fas.fa-angle-right").addEventListener("click", function () {
                //console.log("right arrow clicked!");
            })

            //clicking on carousel
            for (var i = 0, len = document.getElementById('carouselNavUL').children.length; i < len; i++) {
                (function (index) {
                    document.getElementById('carouselNavUL').children[i].onclick = function () {

                        //console.log("clicked - index: " + index);

                        function firstCard() {
                            document.querySelector('.carousel-nav').classList.add('dark');
                            document.querySelector('.right-sidebar').style.backgroundColor = '#003378';
                            document.querySelector('.carousel-nav .prev').style.display = 'none';
                            document.querySelector('.carousel-nav .next').style.display = '';
                            document.querySelectorAll('.livechat-card')[0].style.display = 'none';
                            document.querySelectorAll('.livechat-card')[1].style.display = 'none';
                            document.querySelectorAll('.livechat-card')[2].style.display = 'none';
                            document.querySelectorAll('.livechat-card')[0].style.display = '';
                            document.querySelectorAll(".carousel-nav li")[1].classList.add("active"); //first bubble white
                            document.querySelectorAll('.carousel-nav li')[2].classList.remove('active'); //second bubble blue
                            document.querySelectorAll('.carousel-nav li')[3].classList.remove('active'); //third bubble blue
                            document.getElementById('carousel1').style.cssText = "margin-left: -2px; width: 340px";
                            document.getElementsByClassName('carousel-nav dark')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; height: 42px; margin-left: -2px; width: 340px; margin-top: 5px; padding: 10px 118px 0px";
                        }

                        function secondCard() {
                            document.querySelectorAll('.livechat-card')[0].style.display = 'none'; //hide existing cards
                            document.querySelectorAll('.livechat-card')[1].style.display = 'none'; //hide existing cards
                            document.querySelectorAll('.livechat-card')[2].style.display = 'none'; //hide existing cards
                            document.querySelector('.carousel-nav .prev').style.display = ''; //show previous button
                            document.querySelector(".carousel-nav .prev").classList.remove("d-none"); //show back button
                            document.querySelector('.carousel-nav .next').style.display = ''; //show next button
                            document.querySelector('.carousel-nav').classList.remove('dark');//remove the blue dark background
                            document.querySelector('.right-sidebar').style.backgroundColor = '#fff'; //white background
                            document.querySelectorAll('.livechat-card')[1].style.display = ''; //show second card
                            document.querySelectorAll(".livechat-card")[1].classList.remove("d-none"); //show card
                            document.querySelectorAll(".carousel-nav li")[1].classList.remove("active"); //first bubble blue
                            document.querySelectorAll('.carousel-nav li')[2].classList.add('active'); //second bubble white
                            document.querySelectorAll('.carousel-nav li')[3].classList.remove('active'); //third bubble blue
                            document.querySelector(".carousel-nav").style.padding = "10px 115px 0px";
                            document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 30px 0px 30px; height: 40px";
                        }

                        function thirdCard() {
                            document.querySelectorAll('.livechat-card')[0].style.display = 'none'; //hide existing cards
                            document.querySelectorAll('.livechat-card')[1].style.display = 'none'; //hide existing cards
                            document.querySelectorAll('.livechat-card')[2].style.display = 'none'; //hide existing cards
                            document.querySelector('.carousel-nav .prev').style.display = ''; //show previous button
                            document.querySelector(".carousel-nav .prev").classList.remove("d-none"); //show back button
                            document.querySelector('.carousel-nav .next').style.display = 'none'; //hide next button
                            document.querySelector('.carousel-nav').classList.remove('dark');//remove the blue dark background
                            document.querySelector('.right-sidebar').style.backgroundColor = '#fff'; //white background
                            document.querySelectorAll('.livechat-card')[2].style.display = ''; //show card
                            document.querySelectorAll(".livechat-card")[2].classList.remove("d-none"); //show card
                            document.querySelectorAll(".carousel-nav li")[1].classList.remove("active"); //first bubble blue
                            document.querySelectorAll('.carousel-nav li')[2].classList.remove('active'); //second bubble blue
                            document.querySelectorAll('.carousel-nav li')[3].classList.add('active'); //third bubble white
                            document.querySelector(".carousel-nav").style.padding = "10px 115px 0px";
                            document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 30px 0px 30px; height: 40px";
                        }

                        if (index == 1) {
                            firstCard();

                        } else if (index == 2) {
                            secondCard();

                        } else if (index == 3) {
                            thirdCard();

                        } else if (index == 4) { //right arrow
                            //which slide are we currently on
                            if (document.querySelector("#carousel1").style.display !== "none") {
                                //go to the second card 
                                secondCard();
                            } else if (document.querySelector("#carousel2").style.display !== "none") {
                                //go to the third card
                                thirdCard();
                            }

                        } else if (index == 0) { //left arrow
                            if (document.querySelector("#carousel2").style.display !== "none") {
                                // go to the first card
                                firstCard();

                            } else if (document.querySelector("#carousel3").style.display !== "none") {
                                //go to the second card
                                secondCard();
                            }
                        }
                    }
                })(i);
            }
        }
    }



    // Spanish version with no carousel
    function runStartAConvoFnSpanish() {
        // console.log('running spanish version');
        //hide the citi logo image when mobile browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            if (document.querySelector(".lp_logo_area_wrapper")) {
                document.querySelector(".lp_logo_area_wrapper").style.display = "none";
            }

            //still replace typing indicator
            if (document.getElementsByClassName('lpc_typing-indication')[0]) {
                document.getElementsByClassName('lpc_typing-indication')[0].innerText = "...";
                document.getElementsByClassName("lpc_typing-indication")[0].style.fontSize = "x-large";
                document.getElementsByClassName("lpc_typing-indication")[0].style.top = "-40px";
            }

            //not a mobile device
        } else {

            //resize window to viewheight
            document.querySelector("#lpChat > div.lp_maximized").style.height = "80vh";

            //typing indicator
            document.getElementsByClassName('lpc_typing-indication')[0].innerText = "...";
            document.getElementsByClassName("lpc_typing-indication")[0].style.fontSize = "x-large";
            document.getElementsByClassName("lpc_typing-indication")[0].style.top = "-40px";

            var styleTagLP4 = document.createElement('link');
            styleTagLP4.rel = "stylesheet";
            //styleTagLP4.id = "fontAwesomeLP";
            styleTagLP4.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
            head.appendChild(styleTagLP4);

            var styleTagLP5 = document.createElement('link');
            styleTagLP5.rel = "stylesheet";
            //styleTagLP5.id = "startAConvoLP"
            styleTagLP5.href = "https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/style.css";
            head.appendChild(styleTagLP5);

            //spanish html
            var htmlCode = "<div class='right-sidebar'><div class='livechat-cards'><div class='cards-carousel'><div class='livechat-card dark' id='carousel1'><div class='full'><div class='disc'>Por favor, no compartas aqu&iacute; informaci&oacute;n confidencial de la cuenta como, por ejemplo, tu palabra de seguridad o la fecha de vencimiento. Puede que te enviemos un formulario electr&oacute;nico seguro para recolectar esta informaci&oacute;n. Esta sesi&oacute;n podr&iacute;a ser grabada o monitoreada. Un representante te atender&aacute; en pocos minutos.</div></div></div></div></div>";

            /** 
             * Start A Convo just one slide for the Wealth Builder windows only
             */
            if (lpTag.section && lpTag.section == "wealthbuilder") {
                htmlCode = "<div class='right-sidebar' tabindex='0'><div class='livechat-cards'><div class='cards-carousel' tabindex='0'><div class='livechat-card dark' id='carousel1' tabindex='0'><div class='title' style='padding-bottom:5px'> <span class='title' style='font-size:large' tabindex='0'>How It Works</span></div><div class='first'><div class='disc' tabindex='0'>Tell Citi Bot&reg; what you need in just a few words. If you ever need live assistance, type <q>representative.</q></div></div><div class='second'><div class='design-img'> <img tabindex='0' src='https://static-assets.dev.fs.liveperson.com/citi/projects/start_a_convo/assets/howbotworks.png' alt='Illustration of woman texting on her phone' /></div></div></div></div></div></div>";
            }

            // Collections rewording the Welcome Message for Proactive PopUp
            if (window.location.href.indexOf("forbearancenafeez") > 0) {
                if (document.querySelector("#lp_line_bubble_0").innerText) {
                    document.querySelector("#lp_line_bubble_0").innerText = "Welcome to Citi Message Us. Having hardship with payments? We can help!"
                }
            }

            //var lp = document.querySelector("div.lpc_hero-image-area.lpc_hero-image-area_maximized.lpc_desktop");
            //var lp = document.querySelector(".lp_logo_area_wrapper");
            var lp = document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized");
            lp.innerHTML = htmlCode;

            //fix top chat transcript line from going into the top carousel
            document.querySelector("div.lp_lpview_mp.lp_main_area.lp_logo_top_margin").style.marginTop = "165px";


            //olena fixes
            //Header; eliminating menu button
            document.getElementsByClassName('lp_slider lpc_maximized-header__slider-button lpc_desktop')[0].style.cssText = "display: none";

            //Merging cards and header together
            document.getElementsByClassName('lp_header lpc_maximized-header lpc_desktop')[0].style.cssText = "background-color: #003378; border-color: #003378; font-size: 17px; border-radius: 0";
            document.getElementsByClassName('cards-carousel')[0].style.cssText = "margin-top: -33px; height: 122px; width: 340px";
            document.getElementById('carousel1').style.cssText = "background-color: #003378; height: 122px; width: 340px";

            //Styling cards disclaimer text
            document.querySelector('.disc').style.cssText = "font-family: Interstate-Light; font-size: 10px; padding: 15px 5px; height: 144px";

            //Styling the title and description to match the mock-up
            document.querySelector("span.lp_top-text.lpc_maximized-header__text.lpc_desktop").style.cssText = "font-family: Interstate-Regular; font-size: 17px; color: #FFFFFF; letter-spacing: 0";

            //Scrolling bar height adjustment and eliminating second scrollbar and eliminating blue border popping up
            document.querySelector('.lp_location_center').style.cssText = "overflow-y: hidden; outline: none";

            //Shift Chat header title to the left 5px
            document.querySelector("div.lp_title.lpc_maximized-header__text-wrapper.lpc_desktop").style.marginLeft = "10px";

            //Width and height of the window
            // document.getElementsByClassName('lp_maximized lpmx lpc_window lpc_window_maximized lpc_desktop lp_maximized_large')[0].style.cssText = "width: 340px; bottom: 5px; right: 0; border-radius: 0";
            document.getElementsByClassName('lp_maximized lpmx lpc_window lpc_window_maximized lpc_desktop lp_maximized_large')[0].style.width = "342px";

            //Adding grey bottom border for white cards
            // document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 118px 0px; height: 40px";

            //Footer
            //Eliminating menu button
            //document.getElementsByClassName('lp_actions_button lpc_composer__menu-button')[0].style.cssText = "display: none";

            //Styling of the text area
            document.getElementsByClassName('lpview_form_textarea')[0].style.cssText = "font-weight: normal; font-style: normal; color: #000; font-size: 1.1em; ";
            document.getElementsByClassName('lp_bottom_area')[0].style.cssText = "border-top: 1px solid #4CA6F3";

            //Scrolling bar height adjustment and eliminating second scrollbar and eliminating blue border popping up
            document.querySelector('.lp_location_center').style.cssText = "overflow-y: hidden; outline: none";

            //New shorter scrollbar, Needs fixing for onmouse
            document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").style.overflowY = "hidden";
            document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").style.overflowX = "hidden";

            //Function to replace input area text
            if (document.querySelector('.lpview_form_textarea.lpc_composer__text-area.lpc_desktop').placeholder !== "Enter text here") {
                document.querySelector('.lpview_form_textarea.lpc_composer__text-area.lpc_desktop').placeholder = "Escriba su mensaje";
            }

            //auto scroll to bottom
            if (document.querySelector("#lpChat") !== null) {
                if (document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop") !== null) {
                    document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").scrollTop = document.querySelector("div.lpc_transcript.lpc_transcript_maximized.lpc_desktop").scrollHeight;
                }
            }

            //olena new fixes again
            document.querySelector("div.lp_main.lpc_body.lpc_desktop").style.cssText = "outline: none";
            document.getElementById('carousel1').style.cssText = "margin-left: -2px; width: 340px";
            document.getElementsByClassName('lp_location_center')[0].style.cssText = "scroll-behavior: smooth";
            document.querySelector('.lp_location_center').style.cssText = "outline: none";
            // document.getElementsByClassName('carousel-nav')[0].style.cssText = "border-bottom: 2px solid #ECEAE9; padding: 10px 30px 0px 30px; height: 40px";
            // document.getElementsByClassName('carousel-nav dark')[0].style.cssText = "margin-left: -2px; width: 340px; margin-top: 5px";
            // document.querySelector(".carousel-nav.dark").style.marginLeft = "-2px";
            // document.querySelector(".carousel-nav.dark").style.width = "340px";
            // document.querySelector(".carousel-nav.dark").style.marginTop = "5px";
            // document.querySelector(".carousel-nav.dark").style.padding = "10px 118px 0px";

            //resize window to viewheight
            document.querySelector("#lpChat > div.lp_maximized.lpmx.lpc_window.lpc_window_maximized.lpc_desktop.lp_maximized_large").style.height = "80vh"

            //widget resize as well
            document.querySelector(".lpc_slider.lp_slider.lpc_desktop").style.height = "70vh";

            //fix IE11 style issues
            // document.getElementsByClassName('livechat-cards')[0].style.cssText = "width: 340px";
            // document.querySelector(".carousel-nav.dark").style.height = "42px";
            // document.querySelector(".carousel-nav.dark").style.outline = "none";

            /** Carousel click events **/

            //click QR code app link to open the widget
            //document.querySelector(".appLink").addEventListener("click", function (e) {
            //    var widgetIcon = document.querySelectorAll(".lp-slider-icon")[0];
            //    widgetIcon.click();
            //});

            ////clicking on right arrow
            //document.querySelector(".fas.fa-angle-right").addEventListener("click", function () {
            //    console.log("right arrow clicked!");
            //})

            //clicking on carousel
        }
    }
}

/** START: wait for sticky button before adding a click event listener and injecting SAC styles **/
var waitForStickyBtn = function (selector, callback, maxTimes) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        if (maxTimes === false || maxTimes > 0) {
            maxTimes--;
            setTimeout(function () {
                waitForStickyBtn(selector, callback, maxTimes);
            }, 500);
        }
    }
};
waitForStickyBtn("div.lp_logo_image_wrapper", function () {
    document.querySelector('img[class="LPMimage"]').onclick = function () {
        var counter = 1;
        var pushSAC = setInterval(function () {
            if (document.querySelector(".lp_logo_image_wrapper.lpc_banner-image-area__image-wrapper.lpc_banner-image-area__image-wrapper_maximized") !== null) {
                //console.log("done");
                startAConvoFn();
            }
            counter--;
            if (counter === 0) {
                clearInterval(pushSAC);
            }
        }, 1000);
    }
}, 5);
/** END: wait for sticky button before adding a click event listener and injecting SAC styles **/

/** COPA Proactive - create embedded button */
if (!document.querySelector("#copaproactive")) {
    var divElementCOPAProactive = document.createElement("Div");
    divElementCOPAProactive.id = "copaproactive";
    document.getElementsByTagName("body")[0].appendChild(divElementCOPAProactive);
} else if (document.querySelector("#copaproactive") && !document.querySelector("#copaproactive").childNodes[0]) {
    var newPageRetryCallsCounter = 20;
    var newPageRetryCalls = setInterval(function () {
        if (document.querySelector("#copaproactive") && !document.querySelector("#copaproactive").childNodes[0]) {
            if (sessionStorage.getItem("copaProactiveEngagementEligible") == "true") {
                lpTag.newPage(location.href);
            }
        }
        newPageRetryCallsCounter--;
        if (newPageRetryCallsCounter === 0) {
            clearInterval(newPageRetryCalls);
        }
    }, 1000);
}

/** COPA Proactive - clear session storage if signing off the current user */
if (document.querySelector("#signOffmainAnchor")) {
    document.querySelector("#signOffmainAnchor").addEventListener("click", function () {
        //console.log("COPA Proactive - clicked Sign Off button... clearing copaproactive session storage.");
        sessionStorage.removeItem("copaProactiveEngagementEligible");
        sessionStorage.removeItem("copaProactiveClickedCancelBtn");
        sessionStorage.removeItem("copaProactiveClickedX");
    });
}

/** START - COPA Proactive - logic */
function copaProactiveEngFn(callback) {

    //console.log("started copaProactiveEngFn");
    //console.log("inside copaProactiveEngFn - lpTag.section2 = " + lpTag.section[2]);
    //console.log("inside copaProactiveEngFn - window.location.href = " + window.location.href);

    function executeAt(time, func) {
        var currentTime = new Date().getTime();
        if (currentTime > time) {
            console.error("Time is in the Past");
            return false;
        }
        __triggerProactiveTimeout = window.setTimeout(func, time - currentTime);
        return true;
    }

    /** START: COPA proactive engagement window logic **/
    var listOfCOPAProactiveURLs = ["copa-error", "copa", "reage", "paydown", "settlement", "details", "review"];

    function triggerCOPAProactiveEngagementWindow() {
        if (document.querySelector("#lpChat") == null) { //lp window not open
            //console.log("lp window not open");
            if (sessionStorage.getItem("copaProactiveClickedX") != "true"  //didnt X out before
                && sessionStorage.getItem("copaProactiveEngagementClicked") != "true") { //didnt trigger before
                //console.log("copaProactiveClickedX is not true");

                //click copa proactive engagement
                if (document.querySelector(".LPMcontainer")) {
                    //console.log(".LPMcontainer exists");

                    //if embedded button with div id exists then click on it
                    if (document.querySelector("#copaproactive") && document.querySelector("#copaproactive").childNodes[0]) {
                        document.querySelector("#copaproactive").childNodes[0].click();
                        //console.log("COPA - clicked div id copaproactive.");
                        sessionStorage.setItem("copaProactiveEngagementClicked", "true"); 7

                    } else if (document.querySelector("#copaproactive") && !document.querySelector("#copaproactive").childNodes[0]) {
                        var newPageRetryCallsCounter = 15;
                        var newPageRetryCalls = setInterval(function () {
                            if (document.querySelector("#copaproactive") && !document.querySelector("#copaproactive").childNodes[0]) {
                                lpTag.newPage(location.href);
                            } else if (document.querySelector("#copaproactive") && document.querySelector("#copaproactive").childNodes[0]) {
                                document.querySelector("#copaproactive").childNodes[0].click();
                                //console.log("clicked div id copaproactive.");
                            }
                            newPageRetryCallsCounter--;
                            if (newPageRetryCallsCounter === 0) {
                                clearInterval(newPageRetryCalls);
                            }
                        }, 1000);
                    } else {
                        //if embedded button for copa div id doesn't exist then just click a random one
                        if (document.querySelector(".LPMcontainer")) {
                            document.querySelector(".LPMcontainer").click();
                            //console.log("COPA - random .LPMcontainer clicked");
                            sessionStorage.setItem("copaProactiveEngagementClicked", "true");
                        }
                    }
                } else {
                    //console.log("LPMcontainer does not exist.. retrying.");
                    var newPageRetryCallsCounter = 5;
                    var newPageRetryCalls = setInterval(function () {
                        if (document.querySelector("#copaproactive") && document.querySelector("#copaproactive").childNodes[0]) {
                            document.querySelector("#copaproactive").childNodes[0].click();
                            //console.log("COPA - clicked div id copaproactive.");
                            sessionStorage.setItem("copaProactiveEngagementClicked", "true"); 7

                        }
                        newPageRetryCallsCounter--;
                        if (newPageRetryCallsCounter === 0) {
                            clearInterval(newPageRetryCalls);
                        }
                    }, 1000);
                }
            }
        }
    };

    var triggerCOPAProactive90s = (function () {
        return function () {
            //console.log("COPA Proactive - page: " + window.location.href + " - waiting 90 seconds...");
            sessionStorage.setItem("copaProactiveStartedTimer90s", "true");
            /* __triggerCOPAProactive90sTimeout = window.setTimeout(function () {
                triggerCOPAProactiveEngagementWindow();
            }, 100000); */
            if (typeof __triggerProactiveTimeout !== "undefined") {
                window.clearTimeout(__triggerProactiveTimeout);
            }
            executeAt(new Date().setTime(new Date().getTime() + 90000), function () {
                triggerCOPAProactiveEngagementWindow();
            });
        };
    })();

    var triggerCOPAProactive120s = (function () {
        return function () {
            //console.log("COPA Proactive - page: " + window.location.href + " - waiting 120 seconds...");
            sessionStorage.setItem("copaProactiveStartedTimer120s", "true");
            if (__triggerProactiveTimeout) {
                window.clearTimeout(__triggerProactiveTimeout);
            }
            /* __triggerCOPAProactive120sTimeout = window.setTimeout(function () {
                triggerCOPAProactiveEngagementWindow();
            }, 130000); */
            executeAt(new Date().setTime(new Date().getTime() + 120000), function () {
                triggerCOPAProactiveEngagementWindow();
            });
        };
    })();

    if (window.location.href.indexOf("payments/forbearance/copa-error") > 0 ||
        window.location.href.indexOf("payments/forbearance/copa") > 0 ||
        window.location.href.indexOf("payments/forbearance/reage") > 0 ||
        window.location.href.indexOf("payments/forbearance/paydown") > 0 ||
        window.location.href.indexOf("payments/forbearance/settlement") > 0 ||
        window.location.href.indexOf("payments/forbearance/details") > 0 ||
        window.location.href.indexOf("payments/forbearance/review") > 0) {

        if (sessionStorage.getItem("copaProactiveEngagementEligible") != "true") {
            sessionStorage.setItem("copaProactiveEngagementEligible", "true"); //customer is proactive eligible
            //console.log("COPA - You are eligible for proactive. Flag set to true.");
        }

        if (window.location.href.indexOf("payments/forbearance/copa") > 0) {
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 90s.");
            triggerCOPAProactive90s();
        }

        if (window.location.href.indexOf("payments/forbearance/reage") > 0) {
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 120s.");
            triggerCOPAProactive120s();
        }

        if (window.location.href.indexOf("payments/forbearance/paydown") > 0) {
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 120s.");
            triggerCOPAProactive120s();
        }

        if (window.location.href.indexOf("payments/forbearance/settlement") > 0) {
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 120s.");
            triggerCOPAProactive120s();
        }

        if (window.location.href.indexOf("payments/forbearance/details") > 0) {
            //clicked on cancel button, then immediately auto trigger chat window
            $("#cancelCta").click(function () {
                //console.log("COPA Proactive - page: " + window.location.href + " - clicked Cancel button...");
                sessionStorage.setItem("copaProactiveClickedCancelBtn", "true");
                triggerCOPAProactiveEngagementWindow();
            });
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 120s.");
            triggerCOPAProactive120s();
        }

        if (window.location.href.indexOf("payments/forbearance/review") > 0) {
            //clicked on cancel button, tahen immediately auto trigger chat window
            $("#closeBtn").click(function () {
                //console.log("COPA Proactive - page: " + window.location.href + " - clicked Cancel button...");
                sessionStorage.setItem("copaProactiveClickedCancelBtn", "true");
                triggerCOPAProactiveEngagementWindow();
            });
            if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
                //console.log("timer detected. clearing it.");
                window.clearTimeout(__triggerCOPAProactive90sTimeout);
            } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
                window.clearTimeout(__triggerCOPAProactive120sTimeout);
                //console.log("timer detected. clearing it.");
            }
            //console.log("triggering proactive after 120s.");
            triggerCOPAProactive120s();
        }

        if (window.location.href.indexOf("payments/forbearance/copa-error") > 0 || window.location.href.indexOf("payments/error") > 0) { //copa-error pages
            //console.log("COPA Proactive - page: " + window.location.href + " - trigger immediately due to error page...");
            triggerCOPAProactiveEngagementWindow();
        }
    }

    //not a COPA page, but eligible for COPA proactive because they visited a COPA page
    if (window.location.href.indexOf("payments/forbearance") < 0 && sessionStorage.getItem("copaProactiveEngagementEligible") == "true" && sessionStorage.getItem("copaProactiveClickedX") != "true") {
        //console.log("COPA Proactive - not a COPA page but they visited a COPA page");
        triggerCOPAProactiveEngagementWindow();
    }
    /** END: COPA proactive engagement window logic **/
}

// COPA Proactive - Start Logic
copaProactiveEngFn();


var __triggerCOPAProactive90sTimeout;
var __triggerCOPAProactive120sTimeout;

/** detect page change */
var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    //console.log("LP detected page change - Race Condition.");

    /** START: COPA Proactive Logic */
    if (sessionStorage.getItem("copaProactiveStartedTimer90s") == "true") {
        //console.log("90s timer detected. clearing it.");
        window.clearTimeout(__triggerCOPAProactive90sTimeout);
    } else if (sessionStorage.getItem("copaProactiveStartedTimer120s") == "true") {
        //console.log("120s timer detected. clearing it.");
        window.clearTimeout(__triggerCOPAProactive120sTimeout);
    }
    setTimeout(function () {
        copaProactiveEngFn(); //start copa proactive logic
    }, 2000);
    /** END: COPA Proactive Logic */


    //trigger the Failed Funding Proactive Window
    //triggerFailedFundingProactiveWindow();

};
/** END - COPA Proactive - logic */

/** opening search panel check if embedded button is missing and if so then call newPage */
if (document.querySelectorAll("#personetics-citi-menu")[0]) {
    document.querySelectorAll("#personetics-citi-menu")[0].addEventListener("click", function () {
        function startNewPage() {
            if ((document.querySelector("#old_sp_lp_chat_button") && !document.querySelector("#old_sp_lp_chat_button").childNodes[0])
            || (document.querySelector("#sp_lp_chat_button") && !document.querySelector("#sp_lp_chat_button").childNodes[0])) {
              // console.log("new page in start new page");
              var currentSection = lpTag.section? lpTag.section: null;
              var currentCtype = lpCType? lpCType: null;
              lpTag.newPage(document.location.href, {
                "section": currentSection,
                "sdes": [
                  {
                    "type": "ctmrinfo",
                    "info": {
                      "ctype": currentCtype
                    }
                  }]
              });
            }
        }

        var waitForElSP = function (selector, callback, maxTimes) {
            if (document.querySelectorAll(selector).length > 0) {
                callback();
            } else {
                if (maxTimes === false || maxTimes > 0) {
                    maxTimes--;
                    setTimeout(function () {
                        waitForElSP(selector, callback, maxTimes);
                    }, 1000);
                }
            }
        };
        waitForElSP("#old_sp_lp_chat_button, #sp_lp_chat_button", startNewPage, 5);
    });
}


/** Start Contact Us Proactive logic */
function startContactUsProactive() {
    /** START: Contact Us Page - Proactive Project */
    /** create embedded engagement - display logic only */
    if (!document.querySelector("#contact_us_proactive")) { //if no div id exists, create one
        var divElementContactUsProactive = document.createElement("Div");
        divElementContactUsProactive.id = "contact_us_proactive";
        divElementContactUsProactive.style.display = "none";
        document.getElementsByTagName("body")[0].appendChild(divElementContactUsProactive);
    }
    /** click the button to proactive */
    if (lpTag.section[0] == "contactus") {
        document.querySelector(".lets_connect_cta").addEventListener("click", function () {
            document.querySelectorAll("#dropdown_creditCardAccounts")[0].addEventListener("click", function () {
                // console.log("LivePerson - dropdown_creditCardAccounts was clicked!");
                if (lpTag.section[0] == "contactus") { //if on Contact Us page
                    if (document.querySelector("#lpChat") == null) { //lp window not open
                        //if embedded button with div id exists then click on it
                        if (document.querySelector("#contact_us_proactive") && document.querySelector("#contact_us_proactive").childNodes[0]) {
                            //if embedded button with div id exists then click on it
                            // console.log("Contact Us Proactive - waiting 5 seconds...");
                            function executeAt(time, func) {
                                var currentTime = new Date().getTime();
                                if (currentTime > time) {
                                    console.error("Time is in the Past");
                                    return false;
                                }
                                __triggerProactiveTimeout = window.setTimeout(func, time - currentTime);
                                return true;
                            }
                            executeAt(new Date().setTime(new Date().getTime() + 5000), function () {
                                document.querySelector("#contact_us_proactive").childNodes[0].click();
                            });
                        } else if (document.querySelector("#contact_us_proactive") && !document.querySelector("#contact_us_proactive").childNodes[0]) {
                            var newPageRetryCallsCounter = 3;
                            var newPageRetryCalls = setInterval(function () {
                                if (document.querySelector("#contact_us_proactive") && document.querySelector("#contact_us_proactive").style.display != "none") {
                                    document.querySelector("#contact_us_proactive").style.display = "none";
                                }

                                if (document.querySelector("#contact_us_proactive") && !document.querySelector("#contact_us_proactive").childNodes[0]) {
                                    lpTag.newPage(location.href);

                                } else if (document.querySelector("#contact_us_proactive") && document.querySelector("#contact_us_proactive").childNodes[0]) {
                                    //if embedded button with div id exists then click on it
                                    // console.log("Contact Us Proactive - waiting 5 seconds...");
                                    function executeAt(time, func) {
                                        var currentTime = new Date().getTime();
                                        if (currentTime > time) {
                                            console.error("Time is in the Past");
                                            return false;
                                        }
                                        __triggerProactiveTimeout = window.setTimeout(func, time - currentTime);
                                        return true;
                                    }
                                    executeAt(new Date().setTime(new Date().getTime() + 5000), function () {
                                        document.querySelector("#contact_us_proactive").childNodes[0].click();
                                    });
                                }
                                newPageRetryCallsCounter--;
                                if (newPageRetryCallsCounter === 0) {
                                    clearInterval(newPageRetryCalls);
                                }
                            }, 3000);
                        }
                    }
                }
            });
        })
    }
    /** END: Contact Us Page - Proactive Project */
}

//START: wait for element to appear before invoking startContactUsProactive
var waitForElCUP = function (selector, callback, maxTimes) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        if (maxTimes === false || maxTimes > 0) {
            maxTimes--;
            setTimeout(function () {
                waitForElCUP(selector, callback, maxTimes);
            }, 500);
        }
    }
};
waitForElCUP(".lets_connect_cta", startContactUsProactive, 5);
//END: wait for element to appear before invoking startContactUsProactive
