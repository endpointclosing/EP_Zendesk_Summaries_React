import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CopyIconStroke, CopyIconFill } from '../lib/icons'
import { OrderedList, Span, UnorderedList, XXL } from '@zendeskgarden/react-typography'
import { useState } from 'react'
import { Button, Anchor } from '@zendeskgarden/react-buttons'
import { Title } from "@zendeskgarden/react-notifications"
import { Paragraph } from '@zendeskgarden/react-typography'
import { Skeleton } from '@zendeskgarden/react-loaders'
import SentimentTag from './SentimentTag'
import ReactMarkdown from 'react-markdown'
import removeMarkdown from 'remove-markdown'


const SummaryItem = (props) => {
  const [isCopied, setIsCopied] = useState(false)
  const strippedText = removeMarkdown(props.content, {
    listUnicodeChar: '-'
  })

  const indicateCopied = () => {
    if (!isCopied) setIsCopied(true)
    setTimeout(function(){
      setIsCopied(false)
    },2000);
  }
  // When using the ReactMarkdown library be aware that we are using the Zendesk Garden Design system which does not map well onto it
  // Currently only bold, italics (which are both turned bold), and ul/ol are supported. 
  return <>
    <Title>{props.title}</Title>
    { props.content ? 
      <ReactMarkdown children={props.content} components={{
          ul: ({node, ...props}) => <UnorderedList {...props} />,
          ol: ({node, ...props}) => <OrderedList {...props} />,
          strong: ({node, ...props}) => <Span isBold {...props} />,
          em: ({node, ...props}) => <Span isBold {...props} />,
          a: ({node, ...props}) => <Anchor isExternal target="_blank" {...props}/>
      }}></ReactMarkdown> : <></>
    }
    { props.content === undefined && !props.isLoading ? <Paragraph>Unable to load data</Paragraph> : <></>}
    { props.content === null && !props.isLoading ? <Paragraph>No summary generated.</Paragraph> : <></>}
    { props.isLoading ? <XXL><Skeleton height="24px"/><Skeleton width="90%" height="24px"/><Skeleton width="95%" height="24px"/></XXL> : <></>}
    { props.sentiment ? <><br/><SentimentTag variant={props.sentiment}/><br/></> : <></> }
    <br/>
    <CopyToClipboard text={strippedText}>
      { isCopied ? 
        <Button isStretched size="small">
          <Button.StartIcon>
            {CopyIconFill}
          </Button.StartIcon>
          Copied!
        </Button> :
        <Button isStretched size="small" isBasic onClick={()=>indicateCopied()}>
          <Button.StartIcon>
            {CopyIconStroke}
          </Button.StartIcon>
          Copy
        </Button> 
      }
    </CopyToClipboard>
  </>;
}

export default SummaryItem