# EP Zendesk Summaries
 A private Zendesk App intended to act as the method of display and interaction with our custom Zendesk summaries.

Setting up your Zendesk Instance
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

Setting up App Development
===============
Once your Zendesk instance has been properly configured and you have the custom field IDs to reference -- you can start setting up your development environment. 
1) If you have not already, install Zendesk Command Line Interface (ZCLI) using this [tutorial](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/#installing-and-updating-zcli). In addition, you will need a version of node that is higher than or equal to `18.12.1`. 
2) Open a terminal in the root app directory. This should be the same directory as the README.md and the package.json.
3) Run `npm install` and allow node modules to install.
4) Run `npm run build:dev`. This will populate the `/dist` folder with the compiled web app. If you would like webpack to build continuously while you develop, run `npm run watch`. This will rebuild the dev version of the application anytime a change to a source file is made. 
5) If you ran `npm run watch`, open a new terminal in the root app directory and run`npm zcli apps:server dist`. If you ran `npm run build:dev` instead, simply run `npm zcli apps:server dist` without opening a new terminal. This serves the app to your Zendesk instance when you append `?zcli_apps=true` to your Zendesk URL. 
6) As `zcli apps:server dist` runs the terminal will ask you to provide the custom field IDs of various Zendesk fields. Fill the corresponding field IDs to the ones you created in your Zendesk instance. 
![Zendesk App Prompt](/docs/images/ZCLIAppServerDevPrompt.png)
Once you fill out these fields, you should see a confirmation of the app server running. 
7) This app is created for Zendesk Support and lives in a ticket's sidebar. You can see where that is here:
![Different Support App Locations](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/app_locations.png) In order to see the app while developing, open a Zendesk instance in your internet browser and sign in. Once you open a ticket, append `?zcli_apps=true` to the browser url and press ENTER. For example the url 
`https://endpointclosing1695654615.zendesk.com/agent/tickets/4`
becomes 
`https://endpointclosing1695654615.zendesk.com/agent/tickets/4?zcli_apps=true`
8) Click the Apps icon on the right side of the ticket view and you should be able to see the custom application like in the following image:
![Custom Dev App Running](/docs/images/RunningDevApp.png)
9) At this point you should be able to make changes to files in `/src` and build those changes either manually with `npm run build:dev` or automatically with `npm run watch`. In order to see changes after building, simply refresh the Zendesk web page with the `?zcli_apps=true` appended to the url and you should be able to see your changes reflected in the app. If you are having issues, consider using a private browser mode to prevent caching or hard reload so elements are not cached. 