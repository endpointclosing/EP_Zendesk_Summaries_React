
Configuring Zendesk
===============
This app relies on the following requirements in your Zendesk instance:
1) Creation of several custom Zendesk Ticket Fields
2) Finding the IDs of these custom Zendesk Ticket Fields
3) Inclusion of the AI Feedback Custom Ticket Field in the Support Form being used (this is due to a limitation of Zendesk where you can only read ticket fields that are not present in the support form being used, and we need to edit the AI Feedback field)

These custom fields are:
* **Client Sentiment**: Used to store the AI analysis of client sentiment in a ticket
* **Bullet Point Summary**: Used to store an AI summary of a ticket in bullet point form
* **Action Item Summary**: Used to store an AI summary of the action items in a ticket 
* **One Sentence Summary**: Used to store a once sentence form of a AI summary 
* **AI Feedback**: Used to store feedback for the various AI summary formats

You can configure the requirements of this application by following tutorials to create these fields, view their IDs, and add them to the support form being used.

* [Adding custom fields to your tickets and support request form](https://support.zendesk.com/hc/en-us/articles/4408883152794-Adding-custom-fields-to-your-tickets-and-support-request-form)
* [Viewing your ticket fields](https://support.zendesk.com/hc/en-us/articles/4408832419738-Viewing-your-ticket-fields)


Deploying the App
===============
This will guide you to deploy this custom app into a Zendesk instance. Before completing these steps, you need to make sure to have completed the previous section. Without configuring your Zendesk instance correctly, your app will not work. In addition, you will need admin access to the Zendesk instance where you are uploading the app. 

1) If you have not already, install Zendesk Command Line Interface (ZCLI) using this [tutorial](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/#installing-and-updating-zcli). 
2) If you have not already, open a terminal and run `npm install` from the root directory of the project. This is the folder with `package.json` and `README.md`
3) Once `npm install` has finished, run `npm run build`. This will populate the `/dist` folder with a minimized version of the app. 
4) Once the build is finished, run `cd dist/` and then run `zcli apps:validate` to check whether there will be any initial problems with the app. 
5) After the app has been successfully validated, run `zcli apps:package`. This will create a `tmp` folder inside of `dist/` with a zip file with a name like `app-#################.zip`. 
6) Once you have the zip file, go to the Admin Center in your Zendesk instance. You should be able to find it while browsing Zendesk apps.
![Admin Center Location](/docs/images/ZendeskAdminCenterLocation.png)
7) If you have admin access you should see a menu like this in the Admin Center. ![Admin Center Menu](/docs/images/AdminCenterMenu.png) Click Apps and Integrations and click "Zendesk Support Apps".
8) _If you are updating an app_, find it in the dashboard, hover your mouse over the app and click Update as shown below.
![Updating App](/docs/images/UpdatingZendeskApp.png)
From here you will be prompted to upload the zip file that was created in the `tmp` folder from step 5. Upload the file and you should recieve a notification that the app was successfully updated. If you were just updating, stop following the guide here. 
9) _If you are uploading the app for the first time_, Click "Upload private app" then fill out the app name and upload the zip file that was created in step 5. You will receive a confirmation modal. Click "Upload".
10) Once the upload is complete, you will receive a page that allows you to change the title of the app, app permissions, and fields for the custom field IDs you should have created to support the app. It will look like this:
![App initial settings](/docs/images/NewAppFields.png)
Complete this page using the fields you created for the Zendesk instance and click install to finish installing the app. 

Changing App Settings
===============
Once the app is uploaded, it is possible to change settings like name, permissions, and which custom fields the app uses. In order to do so, follow these steps.

1) Go to the Admin Center in your Zendesk instance. You should be able to find it while browsing Zendesk apps.
![Admin Center Location](/docs/images/ZendeskAdminCenterLocation.png)
2) If you have admin access you should see a menu like this in the Admin Center. ![Admin Center Menu](/docs/images/AdminCenterMenu.png) Click Apps and Integrations and click "Zendesk Support Apps".
3) Find the app you want to change settings for and hover over the App to see your options with regards to the app. Click "Change Settings". 
![Updating App](/docs/images/UpdatingZendeskApp.png)
4) You should now be able to change the settings of the app and press update to confirm. 

To run the tests
===============
TODO: E2E Tests have not been built for this application
