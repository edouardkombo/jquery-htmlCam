/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    
    $("body").fitText(11);
    
    var securityState = false;

    if ($.browser.msie || $.browser.mozilla) {
        //alert("For optimum compatibility, this application will work better on Google Chrome! Please, download and use Google Chrome.");
    }

    function securityStateSwitcher()
    {
        return securityState = (securityState === true) ? false : true ;
    }

    function printingTest(){

        var w = window.open();
        var html = "<!DOCTYPE HTML>";
          html += '<html lang="en-us">';
          html += '<head><style></style></head>';
          html += "<body>";
          html += "</body>";

          w.document.write(html);
          w.window.print();
          w.document.close();
    }        


    //If javascript is enabled, hide alert
    $('#javascript_security').hide();
    securityStateSwitcher();

    if (has_print) {
        if (securityState === true) {
            if( window.print() ) {
                startPlan();
            } else {
                securityStateSwitcher(); 
            }
        }
    } else {
        if (securityState === true) {
            startPlan();
        } else {
            $('#black_screen').show();
            $('#webcam_security').show();
            $('#javascript_security').show();
            $('#printer_security').show();
        }            
    }


    function startPlan() {
        $('#printer_security').hide();
        $('#black_screen').hide();
        $('#content').hide();

        //We set background
        $('#media').anystretch(background_picture);            
        $.anystretch(background_picture);                          
    }

    /**
     * Init initial show/hide
     */
        $('#whois_screen').hide();
        $('#experience_screen').hide();
        $('#actions_screen').hide();
        $('#end_screen').hide();
        $('#actions').hide();
        $('#up').hide();    

    /**
     * 
     * DEFINE ALL ALIASES (TEXT, DEPENDING ON YOUR LANGUAGE)
     * 
     */

    /**
     * All other messages
     */
    var message_adjust      = adjust_message;
    var message_shot        = shot_message;    
    var message_launch      = ready_message;
    var message_filter      = realize_message;
    var message_end         = get_message;
    var message_end2        = get_message2;
    var message_end3        = get_message3; 

    /**
     * Home screen
     */
    $('#hello_screen h1').html(hello_message);
    $('#hello_screen div#hmiddle div').html(hello_message2);
    $('#end_screen h3').html(message_end);
    $('#end_screen div#middle div').html(message_end2);
    $('#end_screen div#low_middle div').html(message_end3);    

    /**
     * Form labels
     */
    $('#whois_screen h2').html(whois_message);
    $('#civilityLabel').html(whois_civility_message);
    $('#civility0').html(whois_civility_0_message);
    $('#civility1').html(whois_civility_1_message);
    $('#civility2').html(whois_civility_2_message);     
    $('#nameLabel').html(whois_name_message);
    $('#firstnameLabel').html(whois_firstname_message);
    $('#emailLabel').html(whois_email_message);
    $('label span').html(whois_newsletter_message);
    $('textarea').val(whois_conditions_message);
    $('#btn_submit').html(whois_submit_message); 
});


  
