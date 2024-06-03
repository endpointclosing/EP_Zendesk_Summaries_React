/**
 *  Example app
 **/
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Grid, Row, Col, PaneProvider, Pane } from '@zendeskgarden/react-grid'
import { Well, Title, Paragraph } from "@zendeskgarden/react-notifications"
import { Tag } from '@zendeskgarden/react-tags'
import I18n from '../../javascripts/lib/i18n'
import { Dots, Skeleton } from '@zendeskgarden/react-loaders'
import { resizeContainer, escapeSpecialChars as escape, generateCustomTicketKey } from '../../javascripts/lib/helpers'
import { Anchor, Button } from '@zendeskgarden/react-buttons'
import { IconButton } from '@zendeskgarden/react-buttons'
import { SM, XXL } from '@zendeskgarden/react-typography'
import { CopyToClipboard } from 'react-copy-to-clipboard'
const MAX_HEIGHT = 2000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

// These need to be replaced with the customFieldIds of ai_assistant values of the production level the app is being deployed
const customFieldIds = {
  ai_assistant_summary: '27081359103380',
  ai_assistant_sentiment: '27081365391508',
  ai_assistant_bulletpoints: '27081393965076',
  ai_assistant_actionitems: '27081419354260',
  ai_assistant_feedback: '27081431860756',
}

// For some reason, this webpack refuses to move SVGs into the dist folder. For now just defining svgs inline. 
const CopyIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <path fill="currentColor" d="M11 4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6zm0 1H5v6h6V5zM7 0a1 1 0 011 1v1.5a.5.5 0 01-1 0V1H1v6h1.5a.5.5 0 010 1H1a1 1 0 01-1-1V1a1 1 0 011-1h6z"/>
</svg>

const ThumbsDownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <g fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.23 7.5a.73.73 0 01-.73-.73C.57 5 .79.5 2 .5h5a.5.5 0 01.5.5v6.5s-1 .5-1 3a1 1 0 01-2 0v-3z"/>
    <rect width="2" height="7" x="9.5" y=".5" rx=".5" ry=".5"/>
  </g>
</svg>

const ThumbsUpIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <g fill="none" stroke="currentColor">
    <path strokeLinejoin="round" d="M10.77 4.5a.73.73 0 01.73.73C11.43 7 11.21 11.5 10 11.5H5a.5.5 0 01-.5-.5V4.5s1-.5 1-3a1 1 0 012 0v3z"/>
    <rect width="2" height="7" x=".5" y="4.5" rx=".5" ry=".5"/>
  </g>
</svg>

const SmileIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
<g fill="none" stroke="currentColor">
  <circle cx="6" cy="6" r="5.5"/>
  <path strokeLinecap="round" d="M3.5 7.5C4 8.4 4.9 9 6 9s2-.6 2.5-1.5"/>
</g>
<g fill="currentColor">
  <circle cx="4" cy="5" r="1"/>
  <circle cx="8" cy="5" r="1"/>
</g>
</svg>

const dateTimeOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
  month: "numeric",
  day: "numeric",
  year: "numeric",
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

    // Query various AI assistant generated fields
    // TODO: Merge these queries into one so there is no unnecessary rendering
    // Get the one sentence summary
    const oneSentenceResponse = await this._client.get(generateCustomTicketKey(customFieldIds['ai_assistant_summary'])).catch(this._handleError.bind(this))
    // Get the bullet point summary
    const bulletPointsResponse = await this._client.get(generateCustomTicketKey(customFieldIds['ai_assistant_bulletpoints'])).catch(this._handleError.bind(this))
    // Get the sentiment
    const sentimentResponse = await this._client.get(generateCustomTicketKey(customFieldIds['ai_assistant_sentiment'])).catch(this._handleError.bind(this))
    // Get the action items 
    const actionItemsResponse = await this._client.get(generateCustomTicketKey(customFieldIds['ai_assistant_actionitems'])).catch(this._handleError.bind(this))
    // Get the last time the ticket was updated
    const lastUpdatedResponse = await this._client.get('ticket.updatedAt').catch(this._handleError.bind(this))
    // Get the feedback (if it exists)
    const summaryFeedbackResponse = await this._client.get(generateCustomTicketKey(customFieldIds['ai_assistant_feedback'])).catch(this._handleError.bind(this))

    // Define query for setting feedback
    const setFeedback = (feedback) => {
      this._client.set(generateCustomTicketKey(customFieldIds['ai_assistant_feedback']), feedback).catch(this._handleError.bind(this));
    }

    // Set the state of the field depending on whether we have data yet
    const bulletPointsSummary = bulletPointsResponse ? bulletPointsResponse[generateCustomTicketKey(customFieldIds['ai_assistant_bulletpoints'])] : ""
    const actionItems = actionItemsResponse ? actionItemsResponse[generateCustomTicketKey(customFieldIds['ai_assistant_actionitems'])] : ""
    const oneSentenceSummary = oneSentenceResponse ? oneSentenceResponse[generateCustomTicketKey(customFieldIds['ai_assistant_summary'])] : ""
    const sentiment = sentimentResponse ? sentimentResponse[generateCustomTicketKey(customFieldIds['ai_assistant_sentiment'])] : ""
    const lastUpdatedTimeStamp = lastUpdatedResponse ? lastUpdatedResponse['ticket.updatedAt'] : ""
    const appContainer = document.querySelector('.main')

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <Grid>
          <Row>
            <Col>
            <Title>Bullet Points</Title>
            {bulletPointsSummary ? <Paragraph>{ bulletPointsSummary }</Paragraph> : <XXL><Skeleton height="24px"/><Skeleton width="90%" height="24px"/><Skeleton width="95%" height="24px"/></XXL>}
            <CopyToClipboard text={bulletPointsSummary}>
              <Button isStretched size="small" isBasic>
                <Button.StartIcon>
                  {CopyIcon}
                </Button.StartIcon>
                Copy
              </Button>
            </CopyToClipboard>
            <div className="EPDivider"></div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Title>Action Items</Title>
              {actionItems ? actionItems : <XXL><Skeleton height="24px"/><Skeleton width="95%" height="24px"/><Skeleton width="90%" height="24px"/></XXL>}
              <CopyToClipboard text={actionItems}>
                <Button isStretched size="small" isBasic>
                  <Button.StartIcon>
                    {CopyIcon}
                  </Button.StartIcon>
                Copy
                </Button>
              </CopyToClipboard>
              <div className="EPDivider"></div>
            </Col>
          </Row>
          <Row>
            <Col>
            <Title className="EP">Quick Summary</Title>
              {oneSentenceSummary ? <Paragraph>{ oneSentenceSummary }</Paragraph> : <XXL><Skeleton height="48px"/></XXL>}
              <CopyToClipboard text={oneSentenceSummary}>
                <Button isStretched size="small" isBasic>
                  <Button.StartIcon>
                    {CopyIcon}
                  </Button.StartIcon>
                Copy
                </Button>
              </CopyToClipboard>
              <div className="EPDivider"></div>
            </Col>
          </Row>
          <Row style={{marginBottom: 16}}>
            <Col>
              <IconButton size="small" isBasic={false} isPill={false} style={{ marginRight: 8}} onClick={() => setFeedback("positive")}>
                {ThumbsUpIcon}
              </IconButton>
              <IconButton size="small" isBasic={false} isPill={false} onClick={() => setFeedback("negative")}>
                {ThumbsDownIcon}
              </IconButton>
            </Col>
          </Row>
          <Row>
            <Col textAlign="center">
              { lastUpdatedTimeStamp ? <SM><Paragraph size="small">Last Updated: {lastUpdatedTimeStamp}</Paragraph></SM> : <></> }
            </Col>
          </Row>
        </Grid>
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
