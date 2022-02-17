from email.mime.text import MIMEText
from flask import request, Response, Blueprint
from app import db
from smtplib import SMTPException
from werkzeug.exceptions import BadRequest
from sqlalchemy import exc
from socket import gaierror
from io import StringIO
from email.charset import Charset
from email.mime.nonmultipart import MIMENonMultipart
import json
import csv
import requests
from app.database.models import Order
from app.database.schemas import order_schema
from app.mail_service.mail_sender import send_mail, setup_mailhost
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
bp = Blueprint("create", __name__)

comptrans_base_url = 'http://sesog0165/ReportService/api/'

# Uses HTTP POST to create a new order
# Stores the order in the database
# Sends email to creator and admins
@bp.route('/new-order', methods=['POST'])
@token_required
def add_order(user_info):
    try:

        order_details = request.get_json()
        username = user_info['token_info']['username']

        # Load order details into local variables
        project = order_details['project']
        system = order_details['system']
        sopSocop = order_details['sopSocop']
        typeOfRelease = order_details['typeOfRelease']
        status = order_details['status']
        bswVersion = order_details['bswVersion']
        relMeetingWeek = order_details['relMeetingWeek']
        filesOnServerWeek = order_details['filesOnServerWeek']
        projectMeco = order_details['projectMeco']
        projectAccountNumber = order_details['projectAccountNumber']
        delOrderADate = order_details['delOrderADate']
        delOrderAComment = order_details['delOrderAComment']
        delOrderBDate = order_details['delOrderBDate']
        delOrderBComment = order_details['delOrderBComment']
        delOrderCDate = order_details['delOrderCDate']
        delOrderCComment = order_details['delOrderCComment']
        delOrderDDate = order_details['delOrderDDate']
        delOrderDComment = order_details['delOrderDComment']
        delOrderEDate = order_details['delOrderEDate']
        delOrderEComment = order_details['delOrderEComment']
        delOrderFDate = order_details['delOrderFDate']
        delOrderFComment = order_details['delOrderFComment']
        enginesString = order_details['engines']
        customer = order_details['customer']

        enginesObj = json.loads(enginesString)
        engines = []
        for engine in enginesObj:
            engines.append({'name':engine['name'], 'power': engine['power'], 'emissionStandard': engine['emissionStandard']})

        # Create a new order object representing a row in the Order-table (in
        # the database)
        new_order = Order(
            creator=username,
            project=project,
            system=system,
            sopSocop=sopSocop,
            typeOfRelease=typeOfRelease,
            status=status,
            bswVersion=bswVersion,
            relMeetingWeek=relMeetingWeek,
            filesOnServerWeek=filesOnServerWeek,
            projectMeco=projectMeco,
            projectAccountNumber=projectAccountNumber,
            delOrderADate=delOrderADate,
            delOrderAComment=delOrderAComment,
            delOrderBDate=delOrderBDate,
            delOrderBComment=delOrderBComment,
            delOrderCDate=delOrderCDate,
            delOrderCComment=delOrderCComment,
            delOrderDDate=delOrderDDate,
            delOrderDComment=delOrderDComment,
            delOrderEDate=delOrderEDate,
            delOrderEComment=delOrderEComment,
            delOrderFDate=delOrderFDate,
            delOrderFComment=delOrderFComment,
            customer=customer,
            engines=engines)

        db.session.add(new_order)
        db.session.commit()

        smtpObj = None
        try:
            smtpObj = setup_mailhost()

        except SMTPException as e:
            raise

        # Setup mail configuration
        sender = 'noreply@scania.com'
        receivers = []

        # Add order creator's mail
        order_creator_mail = user_info['token_info']['mail']
        receivers.append(order_creator_mail)

        # TODO: Send confirmation mail to stc.ems.calcoord@scania.com

        message_subject = u'A new calibration order has been created'

        html_text = MIMEText(("""\
                                <html>
                                  <head></head>
                                  <body>
                                    <p>New Order has been Recieved</p>
                                  </body>
                                </html>
                                """).encode('utf-8'),
                             'html', _charset='utf-8')

        # Dump order information to .csv file
        stringIO = StringIO()
        csvWriter = csv.writer(stringIO)

        # Write headers based on Order Column names
        csvWriter.writerow([i for i in order_details])
        # Write order values
        csvWriter.writerow([order_details[i] for i in order_details])

        # Create the attachment of the message in text/csv.
        attachment = MIMENonMultipart('text', 'csv', charset='utf-8')
        attachment.add_header('Content-Disposition', 'attachment',
                              filename=f'OrderDetails_#{new_order.id}.csv')
        cs = Charset('utf-8')
        attachment.set_payload(stringIO.getvalue(), charset=cs)

        send_mail(sender, receivers, message_subject,
                  html_text, smtpObj, attachment)

        # Return successful
        return Response(order_schema.dumps(new_order),
                        status=201,
                        mimetype='application/json')

    # Catch and return error

    except BadRequest as e:
        return Response(str(e), status=400)

    except ValueError as e:
        return Response(str(e), status=404)

    except SMTPException as e:
        return Response(f'Mail Server Error: {e}', status=502)

    except gaierror as e:
        return Response(f'Scania Mail Host Address Error: {e}', status=405)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Query Comptrans for engines that are related to a specific system and bsw-version.
# API endpoint syntax: /engines?system=<system>&version=<version>
@bp.route('/engines', methods=['GET'])
@token_required
def get_engines(user_info):
    try:
        bsw_version = request.args.get('version')
        system = request.args.get('system')

        # Fetch engines that are associated with bsw version
        url = comptrans_base_url + 'repo?system=' + system + '&version=' + bsw_version
        engines = requests.get(url).json()
        enginesInfo = []
        for engine in engines:
            power = ''
            emissionStandard = ''
            name = engine.split(" ", 1)[0]
            otherInfo = engine.split(" ", 1)
            powerAndEmission = otherInfo[1].split(',')
            if (len(powerAndEmission) == 2):
                power = str(powerAndEmission[0]).replace('[', '')
                emissionStandard = str(powerAndEmission[1]).replace(']', '').replace(' ', '')
            elif (len(powerAndEmission) == 1):
                emissionStandard = str(powerAndEmission).replace('[', '').replace(']', '').replace('\'', '')
            engineInfo = {'name': name, 'power': power, 'emissionStandard': emissionStandard}
            enginesInfo.append(engineInfo)

        resp = Response(json.dumps(enginesInfo),
                        status=200,
                        mimetype='application/json')
        return resp

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Query Comptrans for bsw versions for a certain system.
@bp.route('/bsw-versions', methods=['GET'])
@token_required
def get_bsw_versions(user_info):
    try:
        system = request.args.get('system')
        url = comptrans_base_url + 'repo?system=' + system
        bsw_versions = requests.get(url).json()
        serialized_bsw_versions = json.dumps(bsw_versions)

        resp = Response(serialized_bsw_versions,
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)