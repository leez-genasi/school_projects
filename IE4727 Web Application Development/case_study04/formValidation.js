console.log("Script Loaded");
const form = document.getElementById("form");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name_valid = false;
    var email_valid = false;
    var date_valid = false;
    var exp_valid = false;
    console.log("Button Pressed");

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var startDate = document.getElementById("startDate");
    var experience = document.getElementById("experience");
    
    // Validation Pattern
    const namePattern = /^[A-Za-z]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+(\.[a-zA-Z]{2,}){1,2}\.[a-zA-Z]{2,3}$/; 
    /*  REGEX pattern:
        / are delimiters 
        ^ start of string 
        [a-zA-Z0-9._%+-] allows these chars 
        + means multiple of the prev [] is allowed
        @ the literal symbol
        [a-zA-Z] domain name allows only alphabets
        + one or more chars long
        <\. period (. means any char, \. is just . itself (similar to \n and \\ in python))
        [a-zA-Z] 
        {2,} must contain 2 or more char> > these are bracketed together
        {2,3} 2-3 domain extensions
        [a-zA-Z]{2,3} last dom
        $ end of str anchor
    */
   const today = new Date().toISOString().split('T')[0];

    // Name validation
    console.log(name.value);
    if (!name.value) { 
        name_valid = false;
        alert("Please fill in your Name.")
    } else if (!namePattern.test(name.value)) { 
        name_valid = false;
        alert("Your Name should only have alphabets.")
    } else { name_valid = true; };

    // Email validation
    console.log(email.value);
    if (!email.value) {
        email_valid = false;
        alert("Your email is required.")
    } else if (!emailPattern.test(email.value)) {
        email_valid = false;
        alert("Enter a valid email.")
    } else { email_valid = true; };

    // Date Validation
    console.log(startDate);
    if (startDate.value && startDate.value <= today) {
        date_valid = false;
        alert("Start date cannot be in the past.")
    } else { date_valid = true; };

    // Experience Validation
    console.log(experience.value);
    if (!experience.value) {
        exp_valid = false;
        alert("Please fill in your experience.")
    } else { exp_valid = true; }
    

    if (name_valid && email_valid && date_valid && exp_valid) {
        form.submit();
    }
});