import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CopyIconStroke, CopyIconFill, ThumbsDownIcon, ThumbsUpIcon } from '../lib/icons'
import { OrderedList, Span, UnorderedList, XXL } from '@zendeskgarden/react-typography'
import { useState } from 'react'
import { Button, Anchor } from '@zendeskgarden/react-buttons'
import { Title, Paragraph } from "@zendeskgarden/react-notifications"
import { Skeleton } from '@zendeskgarden/react-loaders'
import ReactMarkdown from 'react-markdown'

const SummaryItem = (props) => {
  const [isCopied, setIsCopied] = useState(false)
  // When using the ReactMarkdown library be aware that we are using the Zendesk Garden Design system which does not map well onto it
  // Currently only bold, italics (which are turned bold), and ul/ol are supported. 
  return <>
    <Title>{props.title}</Title>
    { props.content ? 
      <ReactMarkdown children={props.content} components={{
          ul: ({node, ...props}) => <UnorderedList {...props} />,
          ol: ({node, ...props}) => <OrderedList {...props} />,
          strong: ({node, ...props}) => <Span isBold {...props} />,
          em: ({node, ...props}) => <Span isBold {...props} />,
          a: ({node, ...props}) => <Anchor isExternal target="_blank" {...props}/>
      }}></ReactMarkdown> : 
      <XXL><Skeleton height="24px"/><Skeleton width="90%" height="24px"/><Skeleton width="95%" height="24px"/></XXL>
    }
    <br/>
    <CopyToClipboard text={props.content}>
      { isCopied ? 
        <Button isSelected isStretched size="small" isBasic>
          <Button.StartIcon>
            {CopyIconFill}
          </Button.StartIcon>
          Copied!
        </Button> :
        <Button isStretched size="small" isBasic onClick={()=>{setIsCopied(true)}}>
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