import React, { useEffect } from 'react'
import { IconButton } from '@zendeskgarden/react-buttons'
import { ThumbsDownIcon, ThumbsUpIcon } from '../lib/icons'
import { useState } from 'react'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms'
import { useToast } from '@zendeskgarden/react-notifications'
import { SM, Paragraph } from '@zendeskgarden/react-typography'

const POSITIVE = "positive"
const NEGATIVE = "negative"

const FeedbackSection = (props) => {
  // Because we only have one text field to store multiple versions of feedback, I had to get creative
  // Feedback will be appended to this text field in the following format (timestamp is the unixTime)
  // timestamp>>>positive_or_negative>>>additional_text_feedback
  // e.g., 818035920000>>>negative:::This ai summary sucks,,,
  // Because newline characters can be used in feedback, I can't reliably use that to delimit
  const feedbackIsEmpty = props.feedback === "" || props.feedback === null
  const allFeedbacks = feedbackIsEmpty || props.feedback === undefined ? [] : props.feedback.split(',,,')
  const newestFeedback = feedbackIsEmpty || allFeedbacks[allFeedbacks.length - 2] === undefined ? [] : allFeedbacks[allFeedbacks.length - 2].split('>>>')
  const newestDatetime = feedbackIsEmpty ? props.timestamp : new Date(Number(newestFeedback[0]))
  const timestampMatch = feedbackIsEmpty ? false : +newestDatetime === +props.timestamp
  const newestPositiveOrNegative = timestampMatch ? newestFeedback[1] : ""
  const newestTextFeedback = timestampMatch ? newestFeedback[2] : ""
  const [feedback, setFeedback] = useState(newestPositiveOrNegative)
  const [textFeedback, setTextFeedback] = useState(newestTextFeedback)
  const [feedbackTextInputVisible, setFeedbackTextInputVisible] = useState(newestTextFeedback.length > 0);
  // Used to notify user if they successfully submitted. 
  const { addToast } = useToast();  

  /** TODO: These are poorly written functions that use local and global variables but save space*/
  const editFeedbackItem = (timestampOfEdit, posOrNeg, additionalFeedback) => {
    // In order to make an edit to an existing feedback, we need to change the delimited feedbacks array and then join it again
    let editedFeedback = allFeedbacks
    editedFeedback[allFeedbacks.length - 2] = timestampOfEdit + ">>>" + posOrNeg + ">>>" + additionalFeedback
    console.log(editedFeedback.join(",,,"))
    props.setFeedback(editedFeedback.join(",,,"))
  }

  /** TODO: These are poorly written functions that use local and global variables but save space*/
  const appendFeedbackItem = (timestampOfAppend, posOrNeg, additionalFeedback) => {
    if (props.feedback) {
      props.setFeedback(props.feedback + timestampOfAppend + ">>>" + posOrNeg + ">>>" + additionalFeedback + ",,,")
      console.log(props.feedback + timestampOfAppend + ">>>" + posOrNeg + ">>>" + additionalFeedback + ",,,")
    } 
    else {
      props.setFeedback(timestampOfAppend + ">>>" + posOrNeg + ">>>" + additionalFeedback + ",,,")
      console.log(timestampOfAppend + ">>>" + posOrNeg + ">>>" + additionalFeedback + ",,,")
    }
  }
  
  const handleFeedbackClicked = ( positiveOrNegative ) => {
    // This case handles when thumbs up is clicked
    switch (positiveOrNegative) {
      case POSITIVE:
        setFeedback(POSITIVE)
        // Set value
        if (timestampMatch) editFeedbackItem(newestDatetime.getTime(), POSITIVE, "")
        else appendFeedbackItem(props.timestamp.getTime(), POSITIVE, "")
        if (feedbackTextInputVisible) setFeedbackTextInputVisible(false)
        break;
      case NEGATIVE:
        setFeedback(NEGATIVE)
        // Set value
        if (timestampMatch) {editFeedbackItem(newestDatetime.getTime(), NEGATIVE, textFeedback)} 
        else {appendFeedbackItem(props.timestamp.getTime(), NEGATIVE, textFeedback)}
        if (!feedbackTextInputVisible) setFeedbackTextInputVisible(true)
        break;
      default:
        console.error("Invalid parameter provided.")
    }
  }

  const handleTextFeedbackChange = (event) => {
    setTextFeedback(event.target.value);
    if (timestampMatch) {editFeedbackItem(newestDatetime.getTime(), NEGATIVE, event.target.value)}
    else {appendFeedbackItem(props.timestamp.getTime(), NEGATIVE, event.target.value)}
  }
  
  const StartingStateButtons = () => {
    return (
      <>
      { feedback == POSITIVE ? 
        <IconButton isSelected size="small" isBasic={false} isPill={false} style={{ marginRight: 8}} onClick={() => handleFeedbackClicked(POSITIVE)}>
          {ThumbsUpIcon}
        </IconButton> :
        <IconButton size="small" isBasic={false} isPill={false} style={{ marginRight: 8}} onClick={() => handleFeedbackClicked(POSITIVE)}>
          {ThumbsUpIcon}
        </IconButton>
      }
      { feedback  == NEGATIVE ? 
        <IconButton isSelected size="small" isBasic={false} isPill={false} onClick={() => handleFeedbackClicked(NEGATIVE)}>{ThumbsDownIcon}</IconButton> :
        <IconButton size="small" isBasic={false} isPill={false} onClick={() => handleFeedbackClicked(NEGATIVE)}>{ThumbsDownIcon}</IconButton>
      }  
      </>
    )
  }
  return (
    <>
      { props.timestamp && props.timestamp.toDateString() && props.timestamp.toLocaleTimeString() ? 
      <SM><Paragraph size="small">Last Updated: {props.timestamp.toDateString() + " " + props.timestamp.toLocaleTimeString('en-US')}</Paragraph></SM> : 
      <></> 
      }
      { feedbackTextInputVisible ? 
      <>
        <Field style={{marginBottom: 16, marginTop: 16}}>
          <Label hidden isRegular>Additional Feedback</Label>
          <Textarea value={textFeedback} placeholder="Enter additional feedback for the team and submit ticket" onChange={handleTextFeedbackChange} minRows={3} maxRows={5}/>
        </Field>
      </> : 
      <></>}
      <div style={{marginTop: 16}}>
        <StartingStateButtons/>
      </div>
      { !feedbackTextInputVisible &&
        <div id="bottom-of-AI-app" style={{height: 96}}>
        </div>
      }
    </>
  )
}

export default FeedbackSection