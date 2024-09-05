import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';
import { Menu, Item } from '@zendeskgarden/react-dropdowns.next';
import { Grid, Row as GridRow, Col } from '@zendeskgarden/react-grid';
import { Body, Cell, Head, HeaderCell, OverflowButton, HeaderRow, Row, Table } from '@zendeskgarden/react-tables';
import { parseName, parseValue } from '../lib/helpers';
import { MediaInput } from '@zendeskgarden/react-forms';
import SearchIcon from '@zendeskgarden/svg-icons/src/16/search-stroke.svg';
import CloseIcon from '@zendeskgarden/svg-icons/src/16/x-fill.svg';
import { Alert, Title } from '@zendeskgarden/react-notifications';
import { Anchor, Button } from '@zendeskgarden/react-buttons';

const appendText = (client, value) => { return client.invoke('ticket.comment.appendText', value) };
const copyText = (value) => { return navigator.clipboard.writeText(value) }

const OverflowMenu = (props) => {
  return (
  <Menu
    placement="bottom-end"
    button={props => (
      <OverflowButton {...props}/>
    )}
    popperModifiers={{
    preventOverflow: {
      boundariesElement: 'viewport'
    },
    flip: {
      enabled: false
    },
    offset: {
      fn: data => {
        data.offsets.popper.top -= 2;
        return data;
      }
    }
    }}
  >
    <Item value={props.id + "_item_1"} onClick={()=>appendText(props.client, props.copyOrInsertValue)}>Insert into ticket</Item>
    <Item value={props.id + "_item_2"} onClick={()=>copyText(props.copyOrInsertValue)}>Copy</Item>
  </Menu>)
};

const TransactionData = (props) => {
  const transaction_keys = [
    "Business Segment",
    "City",
    "County",
    "Customer Notes",
    "EMD Amount",
    "Loan Amount",
    "Parcel Number",
    "Property Type",
    "Purchase Price",
    "Service Role",
    "Services",
    "State",
    "Street Address",
    "Transaction Type",
    "Verse File Number",
    "ZIP Code",
    "Close Date",
    "Commitment Delivered Date",
    "Contract Executed Date",
    "EMD Due Date",
    "Escrow Opened Date",
    "Prelim Conversion Date",
    "Prelim Open Date",
    "Verse Transaction Creation Time",
    "Prelim Delivered", 
    "Status"
  ] 
  const errorMessage = props.transactionData.Error !== "" ? props.transactionData.Error : null;
  const [visibleTransactionData, setVisibleTransactionData] = useState(props.transactionData)
  const [transactionSearchInput, setTransactionSearchInput] = useState("")
  
  const filterVisibleData = (allTransactionData, searchField) => {
    return Object.keys(allTransactionData).filter((key) => {
      return key.toLowerCase().includes(searchField.toLowerCase());
    }).reduce((a, v)=> ({...a, [v]: allTransactionData[v]}), {})
  }

  const handleTransactionSearchChange = (event) => {
    setVisibleTransactionData(filterVisibleData(props.transactionData, event.target.value));
    setTransactionSearchInput(event.target.value);
  }

  return (
    <>
      <GridRow>
        <Col>
          { errorMessage ? 
            <Alert type="info" style={{paddingBottom: 16}}>
              <Title>Info</Title>
                {errorMessage}
            </Alert> : <>
              <MediaInput start={<img src={SearchIcon}/>} placeholder='Search by field name' onChange={handleTransactionSearchChange}/>
              <div style={{paddingBottom: 16}}></div>
            </>
          }
        </Col>
      </GridRow>
      <GridRow>
        <Col>
          { !errorMessage &&
            <Table size="small">
              <Head>
                <HeaderRow>
                  <HeaderCell>Field Name</HeaderCell>
                  <HeaderCell>Value</HeaderCell>
                  <HeaderCell hasOverflow></HeaderCell>
                </HeaderRow>
              </Head>
              <Body>
                { Object.keys(visibleTransactionData).sort().map((key)=> {
                  if (transaction_keys.includes(key)) {
                    const parsedName = parseName(key)
                    const parsedValue = parseValue(key, visibleTransactionData[key])
                    if (key === "Verse File Number") {
                      return (
                        <Row key={ parsedName + "_row"}>
                          <Cell>{ parsedName ? parsedName : "Error" }</Cell>
                          <Cell>
                            <Anchor isExternal target="_blank" href={"https://verse.endpointclosing.com/transaction/" + parsedValue}>
                              {parsedValue}
                            </Anchor>
                          </Cell>
                          <Cell hasOverflow>
                            <OverflowMenu id={key + "_menu"} copyOrInsertValue={parsedValue} client={props.client}/>
                          </Cell>
                        </Row>
                      )
                    } else {
                      return (
                        <Row key={ parsedName + "_row"}>
                          <Cell>{ parsedName ? parsedName : "Error" }</Cell>
                          <Cell>{ parsedValue ? parsedValue : "N/A" }</Cell>
                          <Cell hasOverflow>
                            <OverflowMenu id={key + "_menu"} copyOrInsertValue={parsedValue} client={props.client}/>
                          </Cell>
                        </Row>
                      )
                    }
                  } else {
                    return null;
                  }
                })}
                { Object.keys(visibleTransactionData).length === 0 && 
                  <Row key={"no_transaction_results_row"}><Cell>No results found</Cell></Row>
                }
              </Body>
            </Table>
          }
        </Col>
      </GridRow>
    </>
  );
};

export default TransactionData;