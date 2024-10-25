/**
 *  Endpoint Custom Zendesk Summary App
 **/
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import I18n from '../../javascripts/lib/i18n'
import { resizeContainer } from '../../javascripts/lib/helpers'

import FeedbackSection from './FeedbackSection'
import { ToastProvider } from '@zendeskgarden/react-notifications'
import { ThumbsDownIcon, ThumbsUpIcon } from '../lib/icons'
import { Anchor, IconButton } from '@zendeskgarden/react-buttons'
import TabsWrapper from './TabsWrapper'
import MacroRecommendations from './MacroRecommendations'

const MAX_HEIGHT = 2000
const TICKET_CUSTOM_FIELD_PREFIX = 'ticket.customField:custom_field_'
const bottomProps = {
  style: { bottom: DEFAULT_THEME.space.base * 8 }
};
const placementProps = {
  'bottom-end': bottomProps
}

class App {
  constructor (client, _appData) {
    this._client = client
    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
    this.hasOpenedInSession = false;
  }

  async checkWindowOpen () {
    if (!this.hasOpenedInSession) {
      FS('trackEvent', {
        name: "EP Assistant Opened"
      });
      console.info("Sending EP Assistant Open Event...")
      this.hasOpenedInSession = true;
    }
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    // Get currentUser is only used for localization
    const currentUser = (await this._client.get('currentUser')).currentUser
    I18n.loadTranslations(currentUser.locale)

    // Get metadata
    const appMetadata = await this._client.metadata().catch(this._handleError.bind(this))
    const EndpointFieldIds = {
      'one_sentence_summary': appMetadata.settings['One Sentence Summary Field ID'],
      'client_sentiment': appMetadata.settings['Client Sentiment Field ID'],
      'bullet_points': appMetadata.settings['Bullet Points Summary Field ID'],
      'action_items': appMetadata.settings['Action Items Field ID'],
      'ai_feedback': appMetadata.settings['AI Feedback Field ID'],
      'transaction_data': appMetadata.settings['Transaction Data Field ID'],
      'macro_recommendations': appMetadata.settings['Macro Recommendations Field ID'],
      'file_number': appMetadata.settings['File Number Field ID']
    }

    // List all of the initial get queries we are going to make
    const ticketDataFields = [
      'ticket.updatedAt',
      'ticket.via',
      'ticket.id',
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['one_sentence_summary'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['client_sentiment'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['bullet_points'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['action_items'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['ai_feedback'], 
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['transaction_data'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['macro_recommendations'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['file_number']
    ]

    // Query various AI assistant generated fields
    const ticketAPIResponse = await this._client.get(ticketDataFields).catch(this._handleError.bind(this))
    // Pulling each field for less writing in JSX later
    // If the response has an error, these fields will become undefined. EMPTY FIELDS ARE A NULL.
    const bulletPoints = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['bullet_points']] : undefined
    const actionItems = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['action_items']] : undefined
    const oneSentenceSummary = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['one_sentence_summary']] : undefined
    const clientSentiment = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['client_sentiment']] : undefined
    const aiFeedback = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['ai_feedback']] : undefined
    const lastUpdatedTimeStamp = ticketAPIResponse ? new Date(Date.parse(ticketAPIResponse['ticket.updatedAt'])) : undefined
    const macroRecommendations = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['macro_recommendations']] : undefined
    // Used to provide data for fullstory
    const ticketID = ticketAPIResponse ? ticketAPIResponse['ticket.id'] : undefined
    // I use the file number field instead of getting it through the transaction data because it is more reliable
    const fileNumber = ticketAPIResponse ? ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['file_number']] : undefined
    // Get transaction data in JSON format
    const transactionData = (ticketAPIResponse && ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['transaction_data']]) ? 
        JSON.parse(ticketAPIResponse[TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['transaction_data']]) : undefined
    // Checking whether it is a call to throw an alert that we don't currently support calls
    //const ticketIsCall = ticketAPIResponse ? (ticketAPIResponse['ticket.via'].channel === "voice_outbound"|| 
    //    ticketAPIResponse['ticket.via'].channel === "voice_voicemail" || ticketAPIResponse['ticket.via'].channel === "voice_inbound") : undefined
    const appContainer = document.querySelector('.main')

    // This is the listener that checks whether the window is open because the EP Assistant App resizes everytime it is opened.
    onresize = () => this.checkWindowOpen();

    if (ticketAPIResponse && ticketID && currentUser && currentUser.id) {
      // This script allows fullstory to identify which ticket is being reviewed.
      console.info("Sending identification information to Fullstory...")
      FS('setIdentity', {
        uid: currentUser.id,
        properties: {
          displayName: currentUser.name ? currentUser.name : undefined,
          email: currentUser.email ? currentUser.email : undefined
        }
      });
    } else {
      console.warn("Unable to find ticket ID.")
    }

    if (ticketAPIResponse && ticketID && currentUser && currentUser.id) {
      // This script allows fullstory to identify which ticket is being reviewed.
      console.info("Sending page information to Fullstory...")
      FS('setProperties', {
        type: 'page',
        properties: {
          pageName: "EP Assistant for ticket "+ String(ticketID),
          zendeskTicketID: ticketID,
        }
      });
    } else {
      console.warn("Unable to find ticket ID.")
    }

    // Define query for setting feedback
    const setFeedback = (feedback) => {
      if (feedback !== aiFeedback) {
        this._client.set(TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['ai_feedback'], feedback).catch(this._handleError.bind(this))
      }
    }

    // Are there any macro recommendations to display?
    const displayMacroRecommendations = macroRecommendations && JSON.parse(macroRecommendations).macro_recommendations.length > 0 ? true : false

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <ToastProvider placementProps={placementProps} zIndex={1}>
          <div id="ep-summary-frame">
            { displayMacroRecommendations && !displayMacroRecommendations &&
              <Grid>
                <Row>
                  <Col>
                    <MacroRecommendations macroRecommendations={macroRecommendations}></MacroRecommendations>
                  </Col>
                </Row>
              </Grid>
            }
            { fileNumber && 
              <Grid style={{paddingTop: 8, paddingBottom: 8}}>
                <Anchor isExternal externalIconLabel={"Link to Verse Transaction"} target="_blank" href={"https://verse.endpointclosing.com/transaction/" + fileNumber}>
                  {fileNumber + " in Verse"}
                </Anchor>
              </Grid>
            }
            <TabsWrapper oneSentenceSummary={oneSentenceSummary} bulletPoints={bulletPoints} 
                actionItems={actionItems} clientSentiment={clientSentiment} transactionData={transactionData} client={this._client}></TabsWrapper>
            <Grid>
              <Row>
                <Col>
                  <br/>
                  { lastUpdatedTimeStamp && (aiFeedback !== undefined) ? 
                  <FeedbackSection feedback={aiFeedback} setFeedback={setFeedback} timestamp={lastUpdatedTimeStamp}></FeedbackSection> : 
                  <div>
                    <IconButton title="Unable to leave feedback" size="small" isBasic={false} isPill={false} disabled>{ThumbsUpIcon}</IconButton>
                    <IconButton title="Unable to leave feedback" size="small" isBasic={false} isPill={false} disabled>{ThumbsDownIcon}</IconButton>
                  </div>
                  }
                </Col>
              </Row>
            </Grid>
          </div>
        </ToastProvider>
      </ThemeProvider>,
      appContainer
    )
    return resizeContainer(this._client, MAX_HEIGHT)
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
