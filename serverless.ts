import type { AWS } from '@serverless/typescript';

import createGroup from '@functions/create-group';

const serverlessConfiguration: AWS = {
  service: 'rocket-serverless-api',
  frameworkVersion: '2',
  custom: {
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
  },
  plugins: [
    'serverless-webpack',
    'serverless-layers',
    'serverless-add-api-key',
],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { createGroup },
};

module.exports = serverlessConfiguration;
