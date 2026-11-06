EMAIL SETUP
Sender Gmail: goldfishkaran@gmail.com

1. php/email.php

define('THEATRE_MAIL_FROM', 'goldfishkaran@gmail.com');

2. D:\XAMPP\sendmail\sendmail.ini
Under [sendmail], set:

[sendmail]
smtp_server=smtp.gmail.com
smtp_port=465
smtp_ssl=auto
error_logfile=error.log
auth_username=goldfishkaran@gmail.com
auth_password=elsc pecz tygl hlxv
force_sender=goldfishkaran@gmail.com


3. D:\XAMPP\php\php.ini
Under [mail function], set:

sendmail_path="\"D:\XAMPP\sendmail\sendmail.exe\" -t"

