import type { AWS } from '@serverless/typescript';
import {
    createGroup,
    customOgpHtml,
    fetchPiaLives,
    createLive,
} from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'rocket-serverless-api',
    frameworkVersion: '2',
    custom: {
        stage: '${opt:stage, self:provider.stage}',
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
        apiKeys: [
            {
                name: 'gas',
            },
        ],
        'serverless-layers': {
            layersDeploymentBucket: 'rocket-dev-lambda',
            dependenciesPath: './package.json',
        },
        customDomain: {
            hostsZoneId: 'Z065429716SVGDQANMG6Z',
            domainName: 'serverless-${self:custom.stage}.rocketfor.band',
            certificateName: '*.rocketfor.band',
            certificateArn: 'arn:aws:acm:us-east-1:960722127407:certificate/cb96c11f-08b0-4eef-b01c-b780ebc5ecc5',
            basePath: '',
            stage: '${self:custom.stage}',
            createRoute53Record: true
        },
    },
    plugins: [
        'serverless-webpack',
        'serverless-layers',
        'serverless-add-api-key',
        'serverless-domain-manager',
        'serverless-offline',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'ap-northeast-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
        lambdaHashingVersion: '20201221',
        iam: {
            role: {
                statements: [
                    {
                        Effect: "Allow",
                        Action: [
                            "s3:PutObject",
                            "logs:CreateLogGroup",
                            "logs:CreateLogStream",
                            "logs:PutLogEvents",
                        ],
                        Resource: "*",
                    },
                ]
            }
        },
    },
    functions: { createGroup, customOgpHtml, fetchPiaLives, createLive },
};

module.exports = serverlessConfiguration;
