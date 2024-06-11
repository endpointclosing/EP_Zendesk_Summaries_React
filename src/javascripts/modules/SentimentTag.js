import { Tag } from '@zendeskgarden/react-tags'
import React from 'react'

const SentimentTag = (props) => {
	if (props.variant && props.variant.toLowerCase()) {
		switch(props.variant) {
			case 'positive':
				return <Tag isPill hue="green">Positive Sentiment</Tag>
			case 'negative':
				return <Tag isPill hue="red">Negative Sentiment</Tag>
			case 'neutral':
				return <Tag isPill hue="grey">Neutral Sentiment</Tag>
			default:
				console.error("Incorrect variant entered for sentiment: " + props.variant);
				return <></>
		}
	}
	else console.error ("No variant provided.")
}

export default SentimentTag
