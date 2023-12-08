import React from 'react';

const SCOPES = [
    'incoming-webhook',
    'commands',
    'links:read',
    'reactions:read',
    'channels:history',
    'groups:history',
    'mpim:history',
    'im:history',
    'users:read',
    'links:write',
]

const USER_SCOPES = [
    'users:read',
]

export const SLACK_CALLBACK_URL = `${process.env.NEXTAUTH_URL}/api/slack/callback`

export const AddToSlackButton: React.FC = (props) => {

    return (
        <a href={`https://slack.com/oauth/v2/authorize?scope=${SCOPES.join(',')}&user_scope=${USER_SCOPES.join(',')}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${SLACK_CALLBACK_URL}`}>
            <img
                alt="Add to Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
                srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
        </a>

    );
}