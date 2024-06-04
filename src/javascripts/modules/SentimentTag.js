import { Tag } from '@zendeskgarden/react-tags'
import React from 'react'

const SentimentTag = (props) => {
	switch(props.variant) {
		case 'positive':
			return <Tag isPill hue="green">Positive Sentiment</Tag>
		case 'negative':
			return <Tag isPill hue="red">Negative Sentiment</Tag>
		case 'neutral':
			return <></>
		default:
			return <></>
	}
}

export default SentimentTag