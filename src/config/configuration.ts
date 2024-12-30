// config/configuration.ts
export default () => ({
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      region: process.env.AWS_REGION,
    },
  });
  