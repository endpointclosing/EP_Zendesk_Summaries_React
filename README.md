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
5) If you ran `npm run watch`, open a new terminal in the root app directory and run`zcli apps:server dist`. If you ran `npm run build:dev` instead, simply run `zcli apps:server dist` without opening a new terminal. This serves the app to your Zendesk instance when you append `?zcli_apps=true` to your Zendesk URL. 
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


## Folder structure

The folder and file structure of the App Scaffold is as follows:

| Name                                    | Description                                                                                  |
|:----------------------------------------|:---------------------------------------------------------------------------------------------|
| [`.github/`](#.github)                  | The folder to store PULL_REQUEST_TEMPLATE.md, ISSUE_TEMPLATE.md and CONTRIBUTING.md, etc     |
| [`dist/`](#dist)                        | The folder in which webpack packages the built version of your app                            |
| [`docs/`](#docs)                        | The folder in which all document related files (like images used in readme) exist         |
| [`spec/`](#spec)                        | The folder in which all of your test files live                                              |
| [`src/`](#src)                          | The folder in which all of your source JavaScript, CSS, templates and translation files live |
| [`webpack/`](#src)                      | translations-loader and translations-plugin to support i18n in the application               |
| [`.babelrc`](#packagejson)              | Configuration file for Babel.js                                                              |
| [`.browserslistrc`](#packagejson)       | Configuration file for browserslist                                                           |
| [`jest.config.js`](#packagejson)        | Configuration file for Jest                                                                  |
| [`package.json`](#packagejson)          | Configuration file for Project metadata, dependencies and build scripts                      |
| [`postcss.config.js`](#packagejson)     | Configuration file for PostCSS                                                               |
| [`webpack.config.js`](#webpackconfigjs) | Configuration file that webpack uses to build your app                                       |

#### dist
The dist directory is created when you run the app building scripts. You will need to package this folder when submitting your app to the Zendesk Apps Marketplace, It is also the folder you will have to serve when using [ZCLI](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/). It includes your app's manifest.json file, an assets folder with all your compiled JavaScript and CSS as well as HTML and images.

#### spec
The spec directory is where all your tests and test helpers live. Tests are not required to submit/upload your app to Zendesk and your test files are not included in your app's package, however it is good practice to write tests to document functionality and prevent bugs.

#### src
The src directory is where your raw source code lives. The App Scaffold includes different directories for JavaScript, stylesheets, templates, images and translations. Most of your additions will be in here (and spec, of course!).

#### webpack
This directory contains custom tooling to process translations at build time:

- translations-loader.js is used by Webpack to convert .json translation files to JavaScript objects, for the app itself.
- translations-plugin.js is used to extract compulsory translation strings from the en.json file that are used to display metadata about your app on the Zendesk Apps Marketplace.


#### .babelrc
[.babelrc](https://babeljs.io/docs/en/babelrc.html) is the configuration file for babel compiler.

#### .browserslistrc
.browserslistrc is a configuration file to specify browsers supported by your application, some develop/build tools read info from this file if it exists in your project root. At present, our scaffolding doesn't reply on this file, [default browserslist query](https://github.com/browserslist/browserslist#queries) is used by [Babel](https://babeljs.io/docs/en/babel-preset-env/) and [PostCSS](https://github.com/csstools/postcss-preset-env#browsers)

#### jest.config.js
[jest.config.js](https://jestjs.io/docs/en/configuration.html) is the configuration file for Jest

#### package.json
package.json is the configuration file for [Yarn](https://yarnpkg.com/), which is a package manager for JavaScript. This file includes information about your project and its dependencies. For more information on how to configure this file, see [Yarn package.json](https://yarnpkg.com/en/docs/package-json).

#### postcss.config.js
postcss.config.js is the configuration file for [PostCSS](https://postcss.org/)

#### webpack.config.js
webpack.config.js is a configuration file for [webpack](https://webpack.github.io/). Webpack is a JavaScript module bundler. For more information about webpack and how to configure it, see [What is webpack](http://webpack.github.io/docs/what-is-webpack.html).

## Helpers
The App Scaffold provides some helper functions in `/src/javascripts/lib/helpers.js` to help building apps.

### I18n
The I18n (internationalization) module in `/src/javascripts/lib/i18n.js` provides a `t` method to look up translations based on a key. For more information, see [Using the I18n module](https://github.com/zendesk/app_scaffolds/blob/master/packages/react/doc/i18n.md).

## Parameters and Settings
If you need to test your app with a `parameters` section in `dist/manifest.json`, foreman might crash with a message like:

> Would have prompted for a value interactively, but zcli is not listening to keyboard input.

To resolve this problem, set default values for parameters or create a `settings.yml` file in the root directory of your app scaffold-based project, and populate it with your parameter names and test values. For example, using a parameters section like:

```json
{
  "parameters": [
    {
      "name": "myParameter"
    }
  ]
}
```

create a `settings.yml` containing:

```yaml
myParameter: 'some value!'
```

## Testing

The App Scaffold is currently setup for testing with [Jest](https://jestjs.io/). To run specs, open a new terminal and run

```
yarn test
```

Specs live under the `spec` directory.

## Deploying

To check that your app will pass the server-side validation check, run

```
zcli apps:validate dist
```

If validation is successful, you can upload the app into your Zendesk account by running

```
zcli apps:create dist
```

To update your app after it has been created in your account, run

```
zcli apps:update dist
```

Or, to create a zip archive for manual upload, run

```
zcli apps:package dist
```

taking note of the created filename.

For more information on the Zendesk CLI please see the [documentation](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/).

## External Dependencies
External dependencies are defined in [webpack.config.js](https://github.com/zendesk/app_scaffolds/blob/master/packages/react/webpack.config.js). This ensures these dependencies are included in your app's `index.html`.

## Useful Links
Links to maintaining team, confluence pages, Datadog dashboard, Kibana logs, etc
- https://developer.zendesk.com/
- https://github.com/zendesk/zendesk_apps_tools
- https://webpack.github.io
- https://developer.zendesk.com/documentation/apps/build-an-app/using-react-in-a-support-app/