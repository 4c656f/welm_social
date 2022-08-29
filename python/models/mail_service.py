import smtplib as smtp
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv


load_dotenv()












def send_activation_mail(to, link):
    mail_content = '''
    
    '''.format(link, link)

    sender_address = os.getenv("EMAIL_USER")
    sender_pass = os.getenv("EMAIL_PASSWORD")
    sender_address_full = sender_address + "@yandex.ru"
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "account activation"
    msg['From'] = sender_address_full
    msg['To'] = to

    # Create the body of the message (a plain-text and an HTML version).
    html = f"""
    <html>
      <head></head>
      <body>
        <div>
            <a href="http://{os.getenv('BACK_DOMAIN')}/activate/{link}">http://{os.getenv('BACK_DOMAIN')}/activate/{link}</a>
        </div>
      </body>
    </html>
    """

    try:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS)
        part1 = MIMEText(html, 'html')
        msg.attach(part1)
        # Create SMTP session for sending the mail
        server = smtp.SMTP_SSL('smtp.yandex.com', 465)
        # server.starttls(context=context)
        server.ehlo()
        server.login(sender_address, sender_pass)
        server.sendmail(sender_address_full, to, msg.as_string())
        server.quit()
    except Exception as e:
        print(e)
        return
    return




