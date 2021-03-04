# Rocket Serverless API

Serverless Application
- create group

# Dependencies

- AWS(API Gateway + Lambda)
- Serverless Framework
- TypeScript
- Node.js 14.x

# Setup

```
$ npm i
```

# Deploy

```
$ sls deploy
```

# Call API

```
$ curl -X POST 'https://xxxx.execute-api.ap-northeast-1.amazonaws.com/prd/create_group' -d '{"name":"masato"}' -H 'Content-Type:application/json' -H 'x-api-key:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```
or
```
$ sls invoke -f createGroup --stage dev --aws-profile wod -p ./src/functions/create-group/mock.json --log
```

output
```json
{
    "statusCode": 200,
    "body": "{\"result\":{\"id\":\"01d516bc-8bde-4c62-9258-7903087ff958\",\"userId\":\"5192c975-7684-46c0-8c36-859d760d3a82\",\"user\":{\"id\":\"5192c975-7684-46c0-8c36-859d760d3a82\",\"cognito_username\":\"tmp\",\"email\":\"someone@gmail.com\",\"role\":\"teacher\",\"createdAt\":\"2021-02-25T02:28:06.382Z\",\"updatedAt\":\"2021-02-25T02:28:06.382Z\",\"__typename\":\"User\"},\"name\":\"taro\",\"english_name\":\"taro\",\"phone_number\":\"00099998888\",\"address\":\"Tokyo, Japan\",\"available_days\":{\"items\":[],\"nextToken\":null,\"__typename\":\"ModelTeacherAvailableDayConnection\"},\"biography\":null,\"nationality\":\"Japan\",\"meeting_url\":null,\"createdAt\":\"2021-02-25T02:28:06.532Z\",\"updatedAt\":\"2021-02-25T02:28:06.532Z\",\"__typename\":\"Teacher\"}}"
}
```
