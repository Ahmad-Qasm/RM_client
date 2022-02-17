from email.mime.multipart import MIMEMultipart
from email.utils import COMMASPACE
import smtplib

def send_mail(sender, rec, msg_sub, html_text, smtpObj, attachment):
    # Construct the email
    message = MIMEMultipart()
    message.attach(html_text)
    message.attach(attachment)
    message['Subject'] = msg_sub
    message['From'] = sender
    message['To'] = COMMASPACE.join(rec)

    # Convert message object to string
    string_message = message.as_string()

    smtpObj.sendmail(sender, rec, string_message)
    smtpObj.quit()

def setup_mailhost():
    # Set up scania mailhost
    smtpObj = smtplib.SMTP('mailhost.scania.com')
    return smtpObj