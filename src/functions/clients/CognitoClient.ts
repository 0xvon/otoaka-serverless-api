'use strict';
// const AWS = require('aws-sdk');
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

const cognito = new AWS.CognitoIdentityServiceProvider();
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID ?? '';
const clientId = process.env.COGNITO_CLIENT_ID ?? '';
const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? '';

export const createUser = async (username: string, email: string, password: string): Promise<string> => {
    const isAlreadySignedIn = await signin(username, password);
    if (isAlreadySignedIn) { return isAlreadySignedIn; }
    const user = await signup(username, email);
    await setPassword(user.Username, password);
    return await signin(user.Username, password);
}

export const signup = async (username: string, email: string): Promise<AWS.CognitoIdentityServiceProvider.UserType> => {
    const params: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
        UserPoolId: cognitoUserPoolId,
        Username: username,
        ForceAliasCreation: true,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
            { Name: 'email', Value: email },
        ],
    };

    const response = await cognito.adminCreateUser(params).promise().catch(e => { throw e });
    return response.User
}

export const setPassword = async (username: string, password: string): Promise<void> => {
    const params: AWS.CognitoIdentityServiceProvider.AdminSetUserPasswordRequest = {
        UserPoolId: cognitoUserPoolId,
        Username: username,
        Password: password,
        Permanent: true,
    }

    await cognito.adminSetUserPassword(params).promise().catch(e => { throw e });
}

export const signin = async (username: string, password: string): Promise<string> => {
    const params: AWS.CognitoIdentityServiceProvider.AdminInitiateAuthRequest = {
        UserPoolId: cognitoUserPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          'USERNAME': username,
          'PASSWORD': password,
          'SECRET_HASH': crypto.createHmac('sha256', clientSecret).update(username + clientId).digest('base64'),
        },
    };

    const response = await cognito.adminInitiateAuth(params).promise().catch(e => {
        console.log(e);
        return undefined;
    })
    // console.log(JSON.stringify(response.AuthenticationResult));
    return response.AuthenticationResult.IdToken;
}
