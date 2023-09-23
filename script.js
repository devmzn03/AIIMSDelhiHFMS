$(function() {
    // 		  $(document).ready(function() { 
    $("#forgot")
            .click(
                    function() {
                        //alert("inside forgot password");
/* 							openURLInPopup( "/AHIMSG5/hislogin/initForgetPasswordLgnFtr.action", "600", "300") ;*/
                        //openURLInPopupWithoutClose('/AHIMSG5/hislogin/initForgetPasswordLgnFtr.action','600','400');
                        
                        //Changed by Rahul for extension change on 02-03-2021
                        openURLInPopupWithoutClose('/AHIMSG5/hislogin/initForgetPasswordLgnFtr','600','400');
                    });
    // 		  });
});

function WebPortal(){
    
    var check = confirm("Are you sure you want to leave?");
    //alert("check"+check);
  if (check == true) { window.open("http://jrhms.jharkhand.gov.in/");
      return true;
  }
  else {   window.location.reload();
      return false;
  }
}

/*$.datepicker.setDefaults( 
    {	showOn: 'both',
        defaultDate: new Date(),
        buttonImageOnly: true, 
        buttonText : "",
        buttonImage: ""
        });
var age = 18;
var maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - age);
$("#varDob").datepicker({changeMonth: true, changeYear: true, maxDate: maxBirthDate, dateFormat: 'dd-M-yy'}).datepicker("setDate", new Date());
*/

function submitPayslip(){
var adharNoVar=$("#varAdharNo").val();
var DobVar=$("#varDob").val();
var dateTime = /\d\d-\d\d-\d\d\d\d/;
var testdob = dateTime.test(DobVar);
var resultdobarr = DobVar.split("-");
if(testdob == true && resultdobarr[1] >= 1 && resultdobarr[1] <= 12 ){
//document.getElementById("payslipAnchor").href = "/HISPayroll/paybill/reports/ReportSalarySlip.action?mode=printExternal&adharNo="+adharNoVar+"&dob="+DobVar+"&empNo=NA&month=NA&year=NA&hospitalCode=33101";
    document.getElementById("ErrorTxtpaydob").innerHTML = "";
var action 	= "/HISPayroll/paybill/reports/ReportSalarySlip.action?mode=printExternal&adharNo="+adharNoVar+"&dob="+DobVar+"&empNo=NA&month=NA&year=NA&hospitalCode=33101";
$.post(action,null, function (data) {  
    if(data.length==0){
        document.getElementById("ErrorTxt").innerHTML = "Adhar No doesnot Match";
    }
    else{
        document.getElementById("ErrorTxt").innerHTML = "";
        window.open(action);
    }  
});
}
else{
    document.getElementById("ErrorTxtpaydob").innerHTML = "Date of Birth format doesnot Match";
}

}

function adharvalidation(){
$('[name="varAdharNo"]').validatebox({required: true,	validType: ['numeric','maxLength[12]','minLength[12]']});
}

function openURLInPopupWithoutClose(url,width,height) {
var myWindow = window.open(url, "", "top=100,left=400,width="+width+",height="+height);
}

function validate()
{

if (document.getElementById("varUserName").value == "" || document.getElementById("varPassword").value == "")
{
    //alert("inside validate2");
    document.getElementById("divElementErrorsId").innerHTML = "User Name / Password is empty!";
    return false;
}

//alert("inside validate ()" +checkValidUserId());

    
document.getElementById("divElementErrorsId").innerHTML = "";
// Changed by NV dated 18 Aug 2021 to trim trailing and after space
document.getElementById("varUserName").value=document.getElementById("varUserName").value.trim();
document.getElementById("varPassword").value=document.getElementById("varPassword").value.trim();
//alert("inside validate1");
//var specialChars = "#,+,~,\`,=,\,,.,@,!,~,*,^,\`,&,$,(,),[,],{,},:,;,>,<,%,?,<,>,\",\'";

//if (!validateAlphaNumWithUnderscoreValue(document.getElementById("varUserName").value))
    //	|| (!isValidAlphaNumericInput(document.getElementById("passwd").value, ""))) //specialChars ) ) )
    
if (!validateAlphaNumWithSpecialCharValue(document.getElementById("varUserName").value))
{  
    //alert("inside validate3");
    document.getElementById("divElementErrorsId").innerHTML = "User Name should be Alphabnumeric with Special character for email only...";
    //document.getElementById("divElementErrorsId").innerHTML = "User Name / Password is not an Alpha Numeric...";
    return false;
}

if(!securePassword())
{
    //alert("inside validate4");
    document.getElementById("divElementErrorsId").innerHTML = "Faced Some Unknown Problem. Please try Again!";
    document.getElementById("varUserName").value = "";
    document.getElementById("varPassword").value = "";
    return false;
}
    
if(!checkCapcha())
{
    return false;
}

if(!checkValidUserId())
{
    //alert(checkValidUserId());
    return false;
}

// Setting window.name property
//alert("inside validate5");
window.name = sessionToken;
//alert(window.name);
return true;

}


//Added By Rahul on 28-04-2021 for captcha implementation
function checkCapcha(){	  
var enteredcaptcha= document.getElementById('strCaptchaCode').value;
var generatedcaptcha= document.getElementById('captchaText').innerHTML;

if(enteredcaptcha==""){
    alert("Please Enter Captcha Code");
    return false;
}

if(generatedcaptcha==enteredcaptcha){		
    return true;
}
else
 {
    alert("Incorrect Captcha!", "Please Enter Correct Captcha!", "error")
    document.getElementById("strCaptchaCode").value = "";
    return false;
  }

}


function securePassword()
{
var hashValue = "";
var objPassHash = new jsSHA(document.getElementById("varPassword").value+document.getElementById("varUserName").value, "ASCII");
//---var objPassHash = new jsSHA(document.getElementById("varUserName").value+document.getElementById("varUserName").value, "ASCII");
try 
{
    hashValue = objPassHash.getHash("SHA-1", "HEX");
} 
catch(e)
{
    return false;
}

objPassHash = new jsSHA(hashValue + sessionToken, "ASCII");
try
{
    hashValue = objPassHash.getHash("SHA-1", "HEX");
}
catch(e)
{
    return false;
}
document.getElementById("varPassword").value = hashValue;
return true;
}

function checkValidUserId()
{
var flag=true;
var userId = document.getElementById("varUserName").value;
//var dd = document.getElementById("varEmailOtp").value;
//	var action 	= "/AHIMSG5/hissso/attendancedtlotpLogin?a="+aa+"&d="+dd;


var result="";
var action 	= "/AHIMSG5/hissso/getValidUserIdLogin?"+
"modeVal=1&recId1="+userId;
$.ajax({url: action,type:"POST",async:false,dataType:"json" ,success:function(data)
{
    
    
    var arrRecordJsonObj=data['Data'];
     var countVal=arrRecordJsonObj.length;
    //	alert(countVal);
    
    if(arrRecordJsonObj!="")
    {				
         if(countVal==1)
         {
             var username=	arrRecordJsonObj[0]['username'];
             document.getElementById("varUserName").value=username;
             flag=true;
         }
         else
             {
             //alert("You have multiple registration entries.Please contact Administrator..!");
             document.getElementById("divElementErrorsId").innerHTML="You have multiple registration entries.Please contact Administrator..!";
                
                $("#varUserName")[0].value="";
                $("#varPassword")[0].value="";
                //$("#varName")[0].value="";
                //$("#varSignPassword")[0].value="";
                $("#strCaptchaCode")[0].value="";
                //document.getElementById("divElementErrorsId").innerHTML="";
                
                flag=false;
             }
         
    }	
            
    else
        {
        document.getElementById("divElementErrorsId").innerHTML="Please Enter Valid Username / Email id / Mobile No ..!";
        
        //alert("Please Enter Valid Username / Email id / Mobile No ..!");
        $("#varUserName")[0].value="";
        $("#varPassword")[0].value="";
        //$("#varName")[0].value="";
        //$("#varSignPassword")[0].value="";
        $("#strCaptchaCode")[0].value="";
        //document.getElementById("divElementErrorsId").innerHTML="";
        
        flag=false;
        }
        //showAlert ("1", "Please Enter Valid Username / Email id / Mobile No ..!");
        
    
},error: function(errorMsg,textstatus,errorthrown) 
{
    alert('getRecordDetails '+errorMsg+" textstatus::"+textstatus+" errorthrown::"+errorthrown);
    flag=false;
}
});

return flag;


}


function submitFormOnValidate(flg, actionURL)
{
                    
                if(flg)
                {
                    submitForm(actionURL);
                }
                
                else
                    return false;
        


}

function submitForm(actionURL)
{
//document.forms[0].action = actionURL + ".action";

//changed by Rahul on 01-03-2021 for sso main page login extension change
document.forms[0].action = actionURL;

document.forms[0].submit();

}

function validateSignUp(){

document.getElementById("divElementErrorsId").innerHTML = "";
//var specialChars = "#,+,~,\`,=,\,,.,@,!,~,*,^,\`,&,$,(,),[,],{,},:,;,>,<,%,?,<,>,\",\'";
if (document.getElementById("varMobNo").value == "" || document.getElementById("varName").value == "" || document.getElementById("varSignPassword").value == "" || document.getElementById("varEmail").value == "")
{
    document.getElementById("divElementSignUpErrorsId").innerHTML = "Mobile No. / Name / Password/ Email is empty!";
    return false;
}
    else{
    document.getElementById("divElementSignUpErrorsId").innerHTML = "";
}
if (!validateMobileNum(document.getElementById("varMobNo").value))
{
    document.getElementById("divElementSignUpErrorsId").innerHTML = "Mobile no. should be Numeric only...";
    return false;
}
    else{
    document.getElementById("divElementSignUpErrorsId").innerHTML = "";
}


if(!secureSignUpPassword())
{
    document.getElementById("divElementSignUpErrorsId").innerHTML = "Faced Some Unknown Problem. Please try Again!";
    document.getElementById("varMobNo").value = "";
    document.getElementById("varSignPassword").value = "";
    return false;
}

window.name = sessionToken;
return true;

}

function secureSignUpPassword()
{
//alert("secureSignUpPassword");

var hashedPass = "";
var hashObj = new jsSHA(document.getElementById("varSignPassword").value+document.getElementById("varMobNo").value, "ASCII");
try 
{
    var hashedPass = hashObj.getHash("SHA-1", "HEX");
}
catch(e)
{
    isSuccess = false;	
}


document.getElementById("varSignPassword").value = hashedPass;
//alert("secureSignUpPassword1");
 return true;
}
function clearSignUpFields(){
$("#varMobNo")[0].value="";
$("#varEmail")[0].value="";
$("#varName")[0].value="";
$("#varSignPassword")[0].value="";
$("#varOTP")[0].value="";
document.getElementById("divElementSignUpErrorsId").innerHTML="";


}
function validateOTP(){

//alert("validateOTP");


$('#OTPDiv').show();
$('#submitId1').hide();
$('#finalSubmit').show();
$('#resendotp').show();



}




function submitSignUpForm(flg)
{
if(flg)
{
    submitFormOnSignUp1();
}
}

/**
* Purpose : To ensure to enter a Alphanumeric Value with Underscore Only
* Calling On Event : onkeypress
* Parameters : 	1.	this	&	2.	event
* Return Type : boolean

* Ascii Code allowed A-65, Z-90, a-97, z-122, Underscore - 95
*/
function validateAlphaNumWithUnderscoreOnly(obj,e)
{
//alert("Char Code = "+e.charCode+"   Key Code = "+e.keyCode);
var charCode;
if(typeof e.charCode != 'undefined')	// Other
    charCode=e.charCode;
else									// IE
    charCode=e.keyCode;
//alert(charCode);
if( charCode==0 || 
    charCode==95 || 
    (charCode>=65 && charCode<=90) || 
    (charCode>=97 && charCode<=122) ||
    (charCode>=48 && charCode<=57) )
    return true;
else
    return false;
}


/**
* Purpose : To validate whether a given String is Alphanumeric having Underscore Only
* Calling On Event : onchange, user-defined way
* Parameters : 	1.	val/string to validate
* Return Type : boolean
*/
function validateAlphaNumWithUnderscoreValue(val)
{
//alert("validateAlphaNumWithUnderscoreValue");
var pattern=/^[a-zA-Z0-9_]*$/;
return pattern.test(val);
}

function validateAlphaNumWithSpecialCharValue(val)
{
//alert("validateAlphaNumWithUnderscoreValue");
var pattern=/^[a-zA-Z0-9_.@]*$/;
return pattern.test(val);
}
function validateMobileNum(val)
{
var pattern=/^[0-9]*$/;
return pattern.test(val);
}

$(window).on("load.loading1", function(){
//alert("onload");
//onBaordData(); commneted by NV dated 16 Novemeber for AIIMS delhi
var passField = document.getElementById("varPassword");

var captchaField = document.getElementById("strCaptchaCode");
passField.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        submitFormOnValidate(validate(),'loginLogin');
    }
});
captchaField.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        submitFormOnValidate(validate(),'loginLogin');
    }
});
}); 




function onBaordData(){

//alert("onBaordData");

//var a = document.getElementById("varMobNo").value;
//var d = document.getElementById("varEmail").value;
var action 	= "/AHIMSG5/hissso/onBaordDataLogin";//Changed .action to none for extension change by rahul on 01-03-21
 $.ajax({url: action,type:"POST",async:true,dataType:"json" , success:function(data){
              var jsonArray = data;
              
              if(data!="")
                  {
                  $(jsonArray).each(function (index, item) {

                       // each iteration
                      
                      document.getElementById("emponboard").innerHTML=item.emponboard;
                      document.getElementById("districtonboard").innerHTML=item.districtonboard;
                      document.getElementById("blockonboard").innerHTML=item.blockonboard;
                      
                      document.getElementById("facilityonoboard").innerHTML=item.facilityonoboard;
                        
                   });

                  }
              
           
                else
                    {
                      document.getElementById("emponboard").innerHTML='0';
                      document.getElementById("districtonboard").innerHTML='0';
                      document.getElementById("blockonboard").innerHTML='0';
                      document.getElementById("facilityonoboard").innerHTML='0';
                       }
            
              
      
    },error: function(errorMsg,textstatus,errorthrown) {
        alert('onBaordData '+errorMsg+" textstatus::"+textstatus+" errorthrown::"+errorthrown);
        
    }});
}

function displayDiv(flag){

//alert("flag"+flag);

if(flag==1)
    {
    document.getElementById("sighnInDiv").style.display = "inline";
document.getElementById("sighnUpDiv").style.display = "none";
document.getElementById("paySlipDiv").style.display = "none";
    }
else if(flag==2)
    {
    document.getElementById("sighnInDiv").style.display = "none";
    document.getElementById("sighnUpDiv").style.display = "inline";
    document.getElementById("paySlipDiv").style.display = "none";
    }
else
    {
    document.getElementById("sighnInDiv").style.display = "none";
    document.getElementById("sighnUpDiv").style.display = "none";
    document.getElementById("paySlipDiv").style.display = "inline";
    }
    

}






function showdivpass(){
$('#passbasediv').show();
$('#otpbasediv').hide();
$('#signinpass').show();
$('#signinotp').hide();
$('#capthadiv').show();
}
function showdivotp(){
$('#passbasediv').hide();
$('#otpbasediv').show();
$('#signinpass').hide();
$('#signinotp').show();
$('#capthadiv').hide();
}
var j = 120;
function onTimer() {
document.getElementById('mycountersign').innerHTML = j;
j--;
if (j < 0) {
j = 120;
}
else {
setTimeout(onTimer, 1000);
}
}
function OTP_sign() {
alert("OTP sent to Mobile Number");
$('#otpdivsign').show();
$('#capthadiv').show();
$('#signotpsndbtn').hide();
   $('#signresendotpbtn').hide();
   $('#otpsigntimer').show();
   onTimer();
   setTimeout(function(){
        $('#signresendotpbtn').show();
        $('#otpsigntimer').hide();
        $('#signotpsndbtn').hide();
    }, 120000);
     
}



function submitFormOnValidateOtp(flg, actionURL)
{
$('#otperrorsign').hide();
var sessOtpsign = document.getElementById("varsessOtpSign").value;
var txtOtpsign = document.getElementById("varOTPsign").value;



if(flg)
{
    if(txtOtpsign==sessOtpsign){
        submitForm(actionURL);
    }
    else{
        $('#otperrorsign').show();
        document.getElementById("otperrorsign").innerHTML ="Incorrect OTP";
    }
}

else
    return false;
}

function validateSignOtp()
{
document.getElementById("divElementErrorsId").innerHTML = "";
if (document.getElementById("varUserMobnoSign").value == "")
{
    //alert("inside validate2");
    document.getElementById("divElementErrorsId").innerHTML = "Mobile Number is empty!";
    return false;
}

if(!checkCapcha())
{
    return false;
}

// Setting window.name property
window.name = sessionToken;
//alert(window.name);
return true;
} 


function generateCaptchaText(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstucwxyz0123456789";
     let captchaText = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captchaText += characters.charAt(randomIndex);
    }
  
    return captchaText;
  }
  
  // Function to draw the CAPTCHA image
  function drawCaptcha(text) {
    const canvas = document.getElementById("captchaCanvas");
    const ctx = canvas.getContext("2d");
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Set the background color (white)
    ctx.fillStyle = " rgba(255,255,255,.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Set the text color (black)
     
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  
    // Position the text in the center of the canvas
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    ctx.fillText(text, textX, textY);
  }
  
  // Function to generate a new CAPTCHA and draw the image
  function generateCaptcha() {
    const captchaText = generateCaptchaText();
    drawCaptcha(captchaText);
  }
  
  // Generate and draw the initial CAPTCHA on page load
  generateCaptcha();


  // Generate a random CAPTCHA string

// Validate the user's input
function validateCaptcha() {
    const userInput = document.getElementById("userInput").value;
    const captchaText = document.getElementById("captcha").textContent;

    if (userInput === captchaText) {
        alert("CAPTCHA validation successful. You are a human!");
        // Proceed with the desired action (e.g., form submission, login, etc.)
    } else {
        alert("CAPTCHA validation failed. Please try again.");
        // Optionally, you can regenerate a new CAPTCHA here: showCaptcha();
    }
}

/* the name of the given person with the same consultancy the name of  the name given by the  */
    Windows.onload = drawCaptcha;

  