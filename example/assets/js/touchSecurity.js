jQuery(document).ready(function($)
{
    
    //Disable right click
    $(document).bind("contextmenu", function(e) {
        e.preventDefault();
    });
    /*
    document.onkeydown = function(){
        if(!window.event)return
        if(window.event.keyCode == 18 || window.event.keyCode == 115 || window.event.keyCode == 16 || window.event.keyCode == 27 || window.event.keyCode == 9) 
        {
            alert(":)");
            event.returnvalue=false;
            return false;
        }
    } */  
    
});