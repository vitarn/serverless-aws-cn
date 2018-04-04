# serverless-aws-cn
Serverless plugin compatible with aws cn

[![License][ico-license]][link-license]
[![NPM][ico-npm]][link-npm]
[![Build Status][ico-build]][link-build]
[![Coverage Status][ico-codecov]][link-codecov]

## Example:

```yml
service:
  name: demo
plugins:
  - serverless-aws-cn
provider:
  name: aws
  region: cn-north-1
  endpointType: REGIONAL
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello
```

## Some tips about AWS China:

1. Lambda supported in Beijing `cn-north-1` region only. [Ningxia](https://www.amazonaws.cn/about-aws/regional-product-services/) `cn-northwest-1` region is  not supported yet.

2. If you have a function named `hello` with http event. You need patch Cloud Formation API Gateway Principal like this:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - http: GET hello

resources:
  Resources:
    HelloLambdaPermissionApiGateway:
      Properties:
        Principal: apigateway.amazonaws.com
```

3. You cannot open your endpoint without [ICP Recordal](https://www.amazonaws.cn/en/about-aws/china/faqs/#new%20step). It always return `403 {"Message": null}`. Except your function authorize by IAM:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello
          authorizer: aws_iam
```

Consider try [postman](http://getpostman.com) for test your endpoint with AWS4 Authorization header.

4. Don't set environment in your provider or functions. It's not supported in `cn-north-1` region.

```yml
provider:
  name: aws
  region: cn-north-1
  endpointType: REGIONAL
  runtime: nodejs6.10
  # Lambda environment is not supported yet!
  # environment:
    # DYNAMODB_TABLE: ${self:service}-${opt:stage, self:provider.stage}
functions:
  hello:
    # environment:
    #   NODE_ENV: production
```

5. Don't waste time on Cognito User Pool (trigger or auth). Only [Federate Identities](http://docs.amazonaws.cn/en_us/aws/latest/userguide/cognito.html) available now.
```yml
functions:
  preSignUp:
    handler: preSignUp.handler
    events:
      - http:
          path: posts/create
          method: post
          # This ARN is not exists. 
          # authorizer: arn:aws-cn:cognito-idp:cn-north-1:xxx:userpool/cn-north-1_ZZZ
      # This event trigger not work!
      # - cognitoUserPool:
      #     pool: MyUserPool
      #     trigger: PreSignUp
```

6. The builtin `aws-sdk` version is `2.190.0`.  [Doc](https://docs.aws.amazon.com/zh_cn/lambda/latest/dg/current-supported-versions.html) expired.

[ico-license]: https://img.shields.io/github/license/vitarn/serverless-aws-cn.svg
[ico-npm]: https://img.shields.io/npm/v/serverless-aws-cn.svg
[ico-build]: https://travis-ci.org/vitarn/serverless-aws-cn.svg?branch=master
[ico-codecov]: https://codecov.io/gh/vitarn/serverless-aws-cn/branch/master/graph/badge.svg

[link-license]: ./blob/master/LICENSE
[link-npm]: https://www.npmjs.com/package/serverless-aws-cn
[link-build]: https://travis-ci.org/vitarn/serverless-aws-cn
[link-codecov]: https://codecov.io/gh/vitarn/serverless-aws-cn
