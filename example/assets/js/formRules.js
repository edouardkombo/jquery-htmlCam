$('#btn_submit').click(function() {    
    
    validator = $("form").validate({
        rules: {          
              "name":{
                 "required": name_field_is_required,
                 "minlength": name_minlength
              },
              "firstname":{
                 "required": firstname_field_is_required,
                 "minlength": firstname_minlength
              },         
              "email": {
                 "email": email_syntax_check,
                 "required": email_field_is_required
              },
              "newsletter": {
                 "required": newsletter_field_is_required
              }
        },
        messages: {
              name: {
                  "required": whois_name_required_message,
                  "minlength": whois_name_minlength_message
              },
              firstname: {
                  "required": whois_firstname_required_message,
                  "minlength": whois_firstname_minlength_message
              },
              email: {
                  "required": whois_email_required_message,
                  "email": whois_email_valid_message                   
              },
              newsletter: whois_newsletter_required_message
        },
        errorElement: "span" ,         
        submitHandler: function (form) {
            return false;
        }
    });

    if(validator.form()){ // validation perform			

        datas = {civility:$("input[name='civility']:checked").val(), name:$("#name").val(), firstname:$("#firstname").val(), email:$("#email").val(), newsletter:$('#newsletter').val()};

        $.ajax({
            type: 'POST',
            url: "classes/form.php",
            data: datas,
            success: function(msg) {
                $('#btn_submit').hide();
                $("div.error").hide();

                goToReady();
            },
            error: function () {
                $("div.success").hide();
            }
        });              
    }      
}); 
