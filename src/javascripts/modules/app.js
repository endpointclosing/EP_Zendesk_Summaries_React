/**
 *  Endpoint Custom Zendesk Summary App
 **/
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import I18n from '../../javascripts/lib/i18n'
import { resizeContainer } from '../../javascripts/lib/helpers'
import SummaryItem from './SummaryItem'
import FeedbackSection from './FeedbackSection'
import { ToastProvider } from '@zendeskgarden/react-notifications'
import { ThumbsDownIcon, ThumbsUpIcon } from '../lib/icons'
import { IconButton } from '@zendeskgarden/react-buttons'
import { Accordion } from '@zendeskgarden/react-accordions'

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
      'ai_feedback': appMetadata.settings['AI Feedback Field ID']
    }

    // List all of the initial get queries we are going to make
    const ticketDataFields = [
      'ticket.updatedAt',
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['one_sentence_summary'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['client_sentiment'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['bullet_points'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['action_items'],
      TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['ai_feedback'], 
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
    const appContainer = document.querySelector('.main')

    // Define query for setting feedback
    const setFeedback = (feedback) => {
      if (feedback !== aiFeedback) {
        this._client.set(TICKET_CUSTOM_FIELD_PREFIX + EndpointFieldIds['ai_feedback'], feedback).catch(this._handleError.bind(this))
      }
    }

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <ToastProvider placementProps={placementProps} zIndex={1}>
          <div id="ep-summary-frame">
            <Accordion isExpandable defaultExpandedSections={[0, 1, 2]} isCompact level={4}>
              <SummaryItem isLoading={false} title="One Sentence Summary" content={oneSentenceSummary} sentiment={clientSentiment} variant="one-sentence-summary"/>
              <SummaryItem isLoading={false} title="Action Items" content={actionItems} variant="action-items"/>
              <SummaryItem isLoading={false} title="Bullet Points" content={bulletPoints} variant="bullet-points"/>
            </Accordion>
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
