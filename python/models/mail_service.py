import smtplib as smtp
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv


load_dotenv()












def send_activation_mail(to, link):
    mail_content = '''
    
    '''.format(link, link)

    sender_address = os.getenv('MAIL_USER')
    sender_pass = os.getenv('MAIL_PASSWORD')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "account activation"
    msg['From'] = sender_address
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



    part1 = MIMEText(html, 'html')
    msg.attach(part1)
    # Create SMTP session for sending the mail
    server = smtp.SMTP_SSL('smtp.yandex.com', 587, "0.0.0.0")
    server.starttls()
    server.ehlo()
    try:
        server.login(sender_address, sender_pass)

        server.sendmail(sender_address, to, msg.as_string())
        server.quit()
    except Exception as e:
        print(e)

