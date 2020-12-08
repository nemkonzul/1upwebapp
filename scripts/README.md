# 1up Health Demo Web Application Releaser Script 
This script can upload the application to AWS Lambda using the Serverless framwork.  
It executes git, npm, and serverless commands.

## Prerequisits
Python 3.5+ is installed.  
You have gone through the setups described in the root.

## Guideline
1. Run the script
```
$ python3 ./webapp_releaser.py
```

2. You will be promted to use one of the numbers tied to the below commands.
```
- 1) Basic flow: Check master for changes, build, test, and deploy to dev
- 2) Build, test, deploy to dev
- 3) Build, test, deploy to prod
```

3. Basic flow: Check master for changes, build, test, and deploy to dev
* Basic flow will check the origin/master for changes. 
* Proceed if found any, and kick off a react build, and the jest tests.
* Upon success, serverless creates a new package and deploys it to the *dev* environment on Lambda. 

4. Build, test, deploy to *dev
* In this flow you can initiate the deployment without checking the remote changes.
* Kick off a react build, and the jest tests.
* Upon success, serverless creates a new package and deploys it to the *dev* environment on Lambda.

5. Build, test, deploy to *prod
* In this flow you can initiate the deployment without checking the remote changes.
* Kick off a react build, and the jest tests.
* Upon success, serverless creates a new package and deploys it to the *prod* environment on Lambda.

**Note**: Deployment happens only if the build and test steps are passing.
