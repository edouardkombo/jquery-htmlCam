
var blurInitiated = false;


$(document).ready(function()
{
    $('form').submit(false);           

    $('#hello_screen').click(function(){         
        goToForm();
    });

    $('#take_snapshot').click(function(){
        goToExperienceScreen();
    });           

    $('#replayExperience').click(function(){
        goToReplayExperienceScreen();
    });

    $('#valid').click(function(){
        goToValidAndEndScreen();
    });

    $('#print').click(function(){
        actionPrint();
    });          
}); 

//Blurring
var vague = '';

//$('#hello_screen').hide();
//goToBlurringScreen();

function animation(div, type, slide) 
{
    slide = ((slide === '') || (slide === null)) ? 0 : slide ;

    if (type === 'show') {
        $(div).show();
        $(div).fadeIn('slow');
        $(div).animate({"margin-top":""+slide+"%"},1500);                    
    } else if (type === 'hide') {
        $(div).fadeOut('fast');
        $(div).animate({"margin-top":""+slide+"%"},1500);
        $(div).hide();            
    }
}

function goToForm()
{   
    animation('#hello_screen', 'hide', '25'); 
    animation('#whois_screen', 'show', '5');

    $('#end_screen').hide();

    //Navigation actions
    $('#actions').show();
    $('#replayExperience').hide();
    $('#valid').hide();        
    $('#take_snapshot').hide();        

    //Reset form values
    $("#civility[value=0]").attr('checked', 'checked');
    $('#name').val('');
    $('#name').focus();
    $('#firstname').val('');
    $('#email').val('');

    $('ul.mailtip').css('margin', '174px 0 0 159px');
    $('#email').mailtip({
        mails: emails_providers_allowed,
        afterselect: $.noop,
        width: null,
        offsettop: 0,
        offsetleft: 0,
        zindex: 1000
    });

    detectBodyClick(0);     
} 


/**
 * Reset all show/hide actions for each step
 * 
 * @returns {undefined}
 */
function hideAll()
{
    $('hello_screen').show();
    $('#whois_screen').hide();
    $('#experience_screen').hide();
    $('#actions_screen').hide();        

    $('#end_screen').hide();

    $('#content').hide();
    $('#vid').hide();

    //Filters screen
    $('#polaroid').hide();
    $('#allFilters').hide();
    $('#blur').hide();        

    //Navigation actions
    $('#actions').show();
    $('#replayExperience').hide();
    $('#valid').hide();        
    $('#take_snapshot').hide();

    //Hide phantomVintage image
    $('#polaroid p').hide();
}


/**
 * Reset all show/hide actions for each step
 * 
 * @returns {undefined}
 */
function general()
{
    detectBodyClick(0);

    animation('#whois_screen', 'hide', '25');               
    animation('#experience_screen', 'show', '1');
    animation('#actions_screen', 'show', '1');

    $('#end_screen').hide();

    //Show adapted message and cam
    $('#vid').css({'width' : webcam_width});
    $('#vid').css({'height': webcam_height});     
    $('#canvas').css({'width' : webcam_width});
    $('#canvas').css({'height': webcam_height});        
    $('#content').show();
    animation('#content', 'show', '5');
    $('#vid').hide();
    $('#canvas').hide();

    $('#experience_screen h2').fadeIn('slow');

    //Alert
    $("#up").hide();

    //Filters screen
    $('#polaroid').hide();
    $('#allFilters').hide();
    $('#blur').hide();        

    //Navigation actions
    $('#actions').show();
    $('#replayExperience').hide();
    $('#valid').hide();        
    $('#take_snapshot').hide();

    //Hide phantomVintage image
    $('#polaroid p').hide();
}   

/**
 * 
 */
function goToReady()
{
    general();    

    //We set background
    $('#media').anystretch(background_second);            
    $.anystretch(background_second);

    $('#experience_screen h2').html(message_adjust);

    if (vague !== '') {
        vague.toggleblur();
    }

    //Blur the webcam screen
    animation('#vid', 'show', '1');

    var timer1 = setInterval( function() 
    {
        clearInterval(timer1);

    }, 4000);

    var timer2 = setInterval( function() 
    {
        prepareUser();
        clearInterval(timer2);

    }, 7000);

    var timer3 = setInterval( function() 
    {
        goToBlurringScreen();
        clearInterval(timer3);

    }, 14000);
}

/**
 * Blur element
 * 
 * @param something Id to blur
 * 
 * @returns {counter|Number}
 */
function blurring(something) 
{
    vague = $(something).Vague({
        intensity:      40,      // Blur Intensity
        forceSVGUrl:    false   // Force absolute path to the SVG filter
    });
    vague.blur();

    blurInitiated = true;
}        

function prepareUser() {               

    general();

    $('#experience_screen h2').html(message_launch);

    $('#up').show();
    $('#up').fadeIn('slow');
    $('#up').fadeOut('slow');

    $('#up').fadeIn('slow');
    $('#up').fadeOut('slow');

    $('#up').fadeIn('slow');
    $('#up').fadeOut('slow');

    var timer = setInterval( function() 
    {
        blurring('#vid');
        clearInterval(timer);
    }, 800);        

    $('#up').fadeIn('slow');
    $('#up').fadeOut('slow');

    $('#up').fadeIn('slow');
    $('#up').fadeOut('slow');       

    //Show video and snapshot button
    animation('#vid', 'show', '1');           
}

function goToBlurringScreen() {               

    general();

    $('#experience_screen h2').html(message_shot);

    //Show video and snapshot button
    animation('#vid', 'show', '1');

    $('#take_snapshot').show();

    $('#take_snapshot').fadeIn('slow');
    $('#take_snapshot').fadeOut('slow');

    $('#take_snapshot').fadeIn('slow');
    $('#take_snapshot').fadeOut('slow');

    $('#take_snapshot').fadeIn('slow');
    $('#take_snapshot').fadeOut('slow');

    var timer = setInterval( function() 
    {
        blurring('#vid');
        clearInterval(timer);
    }, 800);

    $('#take_snapshot').fadeIn('slow');       
}

/**
 * Init counter and take snapshot
 * 
 * @returns {undefined}
 */
function goToExperienceScreen()
{
    general();

    //We set background
    $('#media').anystretch(background_second);            
    $.anystretch(background_second);         

    $('#experience_screen h2').html(message_launch);

    //Show video and snapshot button
    animation('#vid', 'show', '1');
    blurring('#vid');

    var myCounter = setInterval( function() 
    {
        if(counter <= 0) {

            counter = 0;

            animation('#counter', 'hide', '0');

            clearInterval(myCounter);

            //Take picture
            snapshotExperience();

            //Reduce number of attempts
            attemptsUpdate();
            counter = resetCounter();

        } else {
            $('#counter').show();
            $('#counter').html('<img src="assets/img/decompte-'+counter+'.png" class="imgs">');
            counter--;
        }
    }, 1000);
}   

function snapshotExperience() 
{
    $(canvas).show();

    var video = document.querySelector("#vid");

    canvas.width = $('#vid').width();
    canvas.height = $('#vid').height();
    canvas.getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height);

    //Hide webcam screen
    $('#content').hide();

    var imgName = $.now();
    var img = document.createElement("img");
    img.src = canvas.toDataURL('image/'+app_img_format);

    $(canvas).hide();

    $.post('classes/photoUpload.php',{image: img.src, name: imgName},function(data){

        experienceScreenResult(data);
    });                             
}

function flashScreen()
{
    if (has_flash) {
        $("body").fadeTo(1000, 0.1).fadeTo(1000, 1.0);        
    }
}

/**
 * 
 * @returns {undefined}
 */
function experienceScreenResult(media)
{
    general();

    //We set background
    $('#media').anystretch(background_second);            
    $.anystretch(background_second);         

    $('#experience_screen h2').html(message_filter);                 

    //Show Replay and Valid buttons
    //We allow replay experience attempts time
    if (attempts > 0) {
        animation('#replayExperience', 'show', '1');
    }

    animation('#valid', 'show', '1');

    //Show Result content
    animation('#polaroid', 'show', '1');

    $('#allFilters').show();

    //Apply images
    $('#imgToFilter').html("<img src='"+media+"' width='auto' height='auto' id='vintage'><br/>");
    $('#polaroid p').html("<img src='"+media+"' width='auto' height='auto' id='phantomVintage'><br/>");
}


function goToReplayExperienceScreen()
{
    general();

    //We set background
    $('#media').anystretch(background_second);            
    $.anystretch(background_second);          

    $('#experience_screen h2').html(message_launch);           

    //Delete current image
    deleteImg('#vintage');
    $('#phantomVintage').hide();

    //Show video and snapshot button
    animation('#vid', 'show', '1');
    blurring('#vid');           

    //Directly return to experience
    goToExperienceScreen();
}


function attemptsUpdate()
{
    attempts--;

    if (attempts >= 1) {
        message_filter = realize_message + " (" + attempts + " essais).";
    } else {
        message_filter = filter_message; 
    } 
}

function resetCounter()
{
    return counter = 3;
}

function resetAttempts()
{
    return attempts = 4;
}                                    

function deleteImg(id)
{
    var imgUrl = $(id).attr('src');
    //console.log('Delete IMG: '+ imgUrl);
    $.post('classes/deletePhoto.php',{image: imgUrl},function(data){

    });            
}

function actionPrint()
{
    $("#imgToFilter" ).print();
    console.log('Printed!');          
}        

function goToValidAndEndScreen()
{           
    general();

    //Hide adapted message
    $('#experience_screen h2').hide();

    //We set background
    $('#media').anystretch(background_picture);            
    $.anystretch(background_picture);              

    $('#vid').show();
    $('#vid').css('top', '100%');

    //Show end message
    animation('#end_screen', 'show', '5');

    var timery = setTimeout(function(){

        //Reset blurring
        vague.toggleblur();                

        $('#canvas').show();

        //Save the current picture
        saveFilteredImage();

        $('#vid').hide();
        $('#vid').css('top', '2%');            

    }, 100);

    var timery2 = setTimeout(function(){

        //Hide end message
        animation('#end_screen', 'hide', '0');

        //Print if it has been defined as option
        if (has_print) {
            actionPrint();
        }

    }, 6400);

    //We log off user and restart a session
    var timery3 = setTimeout(function(){

        //Reinitialise attempts and counter
        resetAttempts();
        resetCounter();

        //Log off user
        $.post('classes/logOff.php',{},function(data){});

        //Return to home experience
        $('#container').load('sequential_snapshot.php');

    }, 6600);             
}        


function saveFilteredImage() 
{
    var video = document.querySelector("#vid");
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');     

    canvas.width = $('#vid').width();
    canvas.height = $('#vid').height();

    var imageName = vintageSrc;

    var img = document.querySelector('#vintage');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var picture = canvas.toDataURL("image/"+app_img_format);
    $.post('classes/photoUpload.php',{image: picture,name: imageName},function(data){
    });             
}    