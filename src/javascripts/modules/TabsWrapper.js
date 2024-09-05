import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import { Alert, Title, Close } from '@zendeskgarden/react-notifications'
import { Accordion } from '@zendeskgarden/react-accordions';
import SummaryItem from './SummaryItem';
import TransactionData from './TransactionData';

const TRANSACTION_DATA = "transaction_data"
const AI_SUMMARIES = "ai_summaries"
const TabsWrapper = (props) => {
  const [selectedTab, setSelectedTab] = useState(AI_SUMMARIES);
  return (
    <>
      <Tabs selectedTab={selectedTab} onChange={setSelectedTab}>
        <TabList>
          <Tab item={AI_SUMMARIES} key={AI_SUMMARIES + "_tab_key"}>Summaries</Tab>
          <Tab item={TRANSACTION_DATA} key={TRANSACTION_DATA + "_tab_key"}>Transaction Data</Tab>
        </TabList>
        <TabPanel item={AI_SUMMARIES} key={AI_SUMMARIES + "_tab_key"}>
          <Grid>
            { props.isCall === true && 
              <Alert type="info">
                <Title>Phone call summaries are not currently supported</Title>
                We are working on supporting phone calls within the Zendesk Summaries App. 
              </Alert> 
            }
            { props.isCall === false && 
              <Accordion isExpandable defaultExpandedSections={[0, 1, 2]} isCompact level={4}>
                <SummaryItem isLoading={false} title="One Sentence Summary" content={props.oneSentenceSummary} sentiment={props.clientSentiment} variant="one-sentence-summary"/>
                <SummaryItem isLoading={false} title="Action Items" content={props.actionItems} variant="action-items"/>
                <SummaryItem isLoading={false} title="Bullet Points" content={props.bulletPoints} variant="bullet-points"/>
              </Accordion>
            }
          </Grid>
        </TabPanel>
        <TabPanel item={TRANSACTION_DATA} key={TRANSACTION_DATA + "_tab_key"}>
          <Grid>
            { props.transactionData ? <TransactionData client={props.client} transactionData={props.transactionData}/> :
              <Alert type="info">
                <Title>Info</Title>
                  Unable to find what transaction this communication is related to.
              </Alert>
            }
          </Grid>
        </TabPanel>
      </Tabs>
    </>
  )
}

export default TabsWrapper;