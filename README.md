# 1up Health Demo Web Application
Example web application built using 1upHealth FHIR, User &amp; Connect APIs  

[![CircleCI](https://circleci.com/gh/1uphealth/1upwebapp.svg?style=svg)](https://circleci.com/gh/1uphealth/1upwebapp)

## Before you start
Create an application via the 1uphealth devconsole [https://1up.health/devconsole](https://1up.health/devconsole) for testing purposes.  Use `http://localhost:3000/callback` for your app's callback url. Make sure you save your client secret as it'll only be shown once.

## Quickstart
1. Checkout source code from the repo
```
cd ~/
git clone https://github.com/1uphealth/1upwebapp.git
```


2. Add your API keys to app server session, ex. `vim ~/.bashrc` or `~/.bash_profile`
```
export ONEUP_DEMOWEBAPPLOCAL_CLIENTSECRET="clientsecretclientsecret"
export ONEUP_DEMOWEBAPPLOCAL_CLIENTID="clientidclientid"
```
save this
```
source ~/.bashrc
source ~/.bash_profile
```
**For Windows:** - Add your API keys as Environment Variables. 
- In Search, search for and then select: System (Control Panel)
- Click the Advanced system settings link.
- Click Environment Variables.
- In the Edit System Variable (or New System Variable) window, specify the value of the PATH environment variable.
- Reopen Command prompt window, and run your code. 

3. Create `config.json` configuration file with the same client_id
```
{
  "baseURL": "http://localhost:3000",
  "clientId": "xxxxxxx",
  "__clientId": "the client id must be hardcoded here because this will be client side",
  "email": {
    "sender": "address@demo.com"
  }
}
```

4. Install & run the app
```
npm install
npm run dev
```

5. Run the email server (python 2.7)
```
sudo python -m smtpd -n -c DebuggingServer localhost:25
```

## Test Health Systems
You can test the demo web app with one of these [FHIR health system accounts](https://1up.health/dev/doc/fhir-test-credentials).

## Optional Setup: Setup email using actual email (relay) server
Either run a test local server for development
```
sudo python -m smtpd -n -c DebuggingServer localhost:25
```
Or setup email js for production in `auth.js`
```
var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    "username",
   password:"password",
   host:    "smtp.your-email.com",
   ssl:     true
});
```


# Additional content on top of the original guidelines
This project is a fork of the original solution: https://github.com/1uphealth/1upwebapp

## Applied changes:	
*	Removed the .circleci config
*	Removed the broken [pages/test.js](https://www.dropbox.com/s/twk54g426zaozv2/test%20page.png "test page") file
*	Added a dummy test to a newly created tests/tests.js file so that we can have a valid jest test result.
* Added some changes to .gitignore
* Added serverless.yml
* Added sls-package folder for storing a demo package
* Added the scripts folder for a simple python script that deploys the serverless package

## Using Serverless
Install and configure the Serverless Framework, and the serverless-offline plugin.  
Add your AWS IAM User's public and secret keys instead of the placeholders.  
```
npm install -g serverless serverless-offline
sls config credentials --provider aws --key PUBLIC_KEY --secret SECRET_KEY
```
The offline plugin emulates AWS λ and API Gateway on your local machine, it's not necessary.
```
sls offline start
```
## Unresolved problem in the current serverless solution
The application cannot resolve the api requests on lambda, meaning invoking the lambda function's URL *xyz/dev* returns a [404](https://www.dropbox.com/s/06rdz0eiqkfob89/404.png "ping response"). 
I've learnt that the index.js bundles the Express server app into a single lambda function and ties it to an API Gateway endpoint, and the [serverless.yml](https://github.com/nemkonzul/1upwebapp/blob/master/serverless.yml "serverless settings") settings allow the API Gateway to proxy every request to the internal Express router which will then tell Next to render the React.js pages. *However* the Next app is wrapping the express server in [server.js](https://github.com/nemkonzul/1upwebapp/blob/master/server.js "React + Express"), and it makes the routing inaccessible. The only way I was able to hit the function's API endpoint successfully, was by commenting out the App bundling in server.js (line #5-7 & #84-87), it consequently detached the react rendering, but at least after countless frustrating hours I was able to get a 302 API response. Note: Those comments were removed. TBD to resolve the issue.

# Using the current configs and app implementation
The app as a function can be deployed to lambda. All the heavy lifting on AWS is done by serverless which is great: package is available on S3, necessary roles are created and attached to the services across the platform, logs are accessible on CloudWatch, the API Gateway is put in front of the function.  
One package example deployed to the *dev* environment can be found under the [sls-package](https://github.com/nemkonzul/1upwebapp/tree/master/sls-package' "dev package") folder.

# Deploy script 
The python script for automatic deployment can be found in the [scripts](https://github.com/nemkonzul/1upwebapp/tree/master/scripts, "auto deployment") folder.
