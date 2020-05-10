# AWS SES Email Relay

Receive email from AWS SES then relay it to your desired destination.

**WARNING: Currently this does not work with attachments.**

## Install

```bash
git clone https://github.com/kdcsoftware/aws-ses-email-relay.git
cd aws-ses-email-relay
npm i
npm i serverless -g
```

## USAGE

### Create config file

Create a `config.{name}.yml` in the project root. Replace `{name}` with your deployment name. eg. `prod`

config.prod.yml:

```yml
REGION: us-east-1
PROFILE: my-aws-profile
DESTINATION: my@destination-email.com
FROM: my@receiving-email.com
```

`FROM` should be a fallback email address capable of sending emails via your AWS account.

### Deploy to AWS

Based on config above:

```bash
npm run deploy prod
```

### Set SES Rule Sets

Navigate to your SES Rule Sets in AWS Console. In you rule, select SNS. Then SNS topic as aws-ses-email-relay-prod. Hit `Save Rule` and you should ready to go.

## Uninstall

```bash
npm run remove prod
cd ..
rm -fR aws-ses-email-relay
```
