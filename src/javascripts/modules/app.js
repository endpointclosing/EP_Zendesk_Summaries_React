/**
 *  Example app
 **/
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { Sheet } from '@zendeskgarden/react-chrome'
import { Grid, Row, Col, PaneProvider, Pane } from '@zendeskgarden/react-grid'
import { Accordion } from '@zendeskgarden/react-accordions'
import { UnorderedList, MD, XL } from '@zendeskgarden/react-typography'
import { Well, Title, Paragraph } from "@zendeskgarden/react-notifications"
import { Tag } from '@zendeskgarden/react-tags'
import I18n from '../../javascripts/lib/i18n'
import { Tiles } from '@zendeskgarden/react-forms'
import { resizeContainer, escapeSpecialChars as escape } from '../../javascripts/lib/helpers'
import { Anchor, Button } from '@zendeskgarden/react-buttons'

const MAX_HEIGHT = 2000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
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
    const currentUser = (await this._client.get('currentUser')).currentUser

    I18n.loadTranslations(currentUser.locale)

    const organizationsResponse = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    const organizations = organizationsResponse ? organizationsResponse.organizations : []
    const oneSentenceSummary = "Katie Lafferty is requested to review and advise on the settlement statement for Jim Been regarding the closing of 4934 Heritage Heights Circle Hazelwood, MO 63042, scheduled for tomorrow."
    const bulletPointsSummary = ["The email contains the settlement statement for Jim Been's property closing at 4934 Heritage Heights Circle Hazelwood, MO 63042, scheduled for tomorrow.", "Jim Been is asked to choose between a virtual signing or a live in-person notary for the closing.", "It is noted that Jim's wife must be present at the signing to sign off on the deed.​"]
    const actionItems = ["Katie Lafferty needs to confirm if Jim Been prefers a virtual signing or a live in-person notary for the closing.", "Ensure that Jim Been is aware that his wife needs to be present at the signing to sign off on the deed."]
    const appContainer = document.querySelector('.main')

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <Grid>
          <Row>
            <Col>
              <Title className="EP">{"One Sentence   "}  
                <Tag isPill>
                  <span>Neutral</span>
                </Tag>
              </Title>
              <Paragraph>
                { oneSentenceSummary }
              </Paragraph>
              <div className="EPDivider"></div>
              <Title>Bullet Points</Title>
              <UnorderedList>
                { bulletPointsSummary.map((data)=> {
                  return (
                    <UnorderedList.Item>{data}</UnorderedList.Item>
                  )
                })}
              </UnorderedList>
              <div className="EPDivider"></div>
              <Title>Action Items</Title>
              <UnorderedList>
                { actionItems.map((data)=> {
                  return (
                    <UnorderedList.Item>{data}</UnorderedList.Item>
                  )
                })}
              </UnorderedList>
              <div className="EPDivider"></div>
            </Col>
          </Row>
          <Row justifyContent='center'>
            <Col alignSelf='start'>
              <Button>Good</Button>
              <Button>Needs Work</Button>
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
