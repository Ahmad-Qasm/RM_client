from flask import request, Response, Blueprint
from werkzeug.exceptions import BadRequest
from app.routes.helpers import token_required
from jira.client import JIRA

# Create a blueprint for easier access across the application
jirabp = Blueprint("JiraCreate", __name__)

# Creates Jiras
@jirabp.route('/new-jira', methods=['POST'])
@token_required
def add_jira(user_info):
    try:
        jira_issue_details = request.get_json()
        jira_session = jira_issue_details[0]['jira_session']
        if jira_session == None:
            jira_session = ""

        # Construct a Jira client instance.
        options = {'server': 'https://jira.scania.com', 'verify': True, 'cookies': jira_session}
        jira = JIRA(options)

        fixVersion = jira_issue_details[1]['fixVersion'] # Will be used when the correct project is used.
        reporter = jira_issue_details[1]['reporter']
        issuetype = jira_issue_details[1]['type']
        description = jira_issue_details[1]['description'] 
        storyDate = jira_issue_details[1]['date']
        summary = jira_issue_details[1]['summary']
        assignee = jira_issue_details[1]['assignee'] 

        jira_story = {}
        jira_story['project'] = {'key': 'PTCTST'}
        jira_story['issuetype'] = {'name': issuetype }
        jira_story['fixVersions'] = [{'name': 'v1442'}] # change to the correct fix version when using the correct project!
        jira_story['summary'] = summary
        jira_story['components'] = [{'name': 'NES Kalibrering'}] # Should be changed into "Kalibrering" when using correct project!
        jira_story['reporter'] = {'name': reporter}
        jira_story['description'] = description
        jira_story['duedate'] = storyDate
        jira_story['assignee'] = {'name': assignee}

        newStoryIssue = jira.create_issue(fields=jira_story,preftech=True)
        storyLink = 'http://jira.scania.com/browse/'+ newStoryIssue.key
        print ('Created Story: ' + storyLink)
        storyId = newStoryIssue.key

        for jiraIssue in jira_issue_details:
            if jiraIssue['type'] != 'session' and jiraIssue['type'] != 'Story':
                # Load jira details into local variables
                fixVersion = jiraIssue['fixVersion'] # Will be used when the correct project is used.
                reporter = jiraIssue['reporter']
                issuetype = jiraIssue['type']
                taskDate = jiraIssue['date']
                description = jiraIssue['description']
                if description == None:
                    description = ""
                assignee = jiraIssue['assignee']
                summary = jiraIssue['summary']

                jira_task = {}
                jira_task['project'] = {'key': 'PTCTST'}
                jira_task['issuetype'] = {'name': issuetype }
                jira_task['fixVersions'] = [{'name': 'v1442'}] # change to the correct fix version when using the correct project!
                jira_task['summary'] = summary
                jira_task['components'] = [{'name': 'NES Kalibrering'}] # Should be changed into "Kalibrering" when using correct project!
                jira_task['reporter'] = {'name': reporter}
                jira_task['duedate'] = taskDate
                jira_task['description'] = description
                jira_task['assignee'] = {'name': assignee }

                newIssue = jira.create_issue(fields=jira_task,preftech=True)
                print ('Created issue: ' + 'http://jira.scania.com/browse/'+ newIssue.key)
                jira.create_issue_link(type='Parent/Child Link', inwardIssue=newIssue.key, outwardIssue = storyId)
        
        # Return response
        response = Response(storyLink,
                            status= 200,
                            mimetype='application/json')
        return response

    # Catch and return error
    except BadRequest as e:
        return Response(str(e), status=400)

    except ValueError as e:
        return Response(str(e), status=404)

    except Exception as e:
        if e.args[0].__contains__('The reporter specified is not a user.'):
            return Response(f'The reporter specified is not a user.', status=500)
        if e.args[0] == 'Reporter is required.':
            return Response(f'Reporter is required.', status=500)
        if e.args[0].__contains__("Field 'summary' cannot be set. It is not on the appropriate screen, or unknown."):
            return Response(f'You could not be automatically logged in to Jira. Try logging out and in to this website again.', status=500)
        return Response(f'Server error: {e}', status=500)