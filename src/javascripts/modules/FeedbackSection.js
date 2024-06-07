import React, { HTMLAttributes} from 'react'
import { IconButton, Button } from '@zendeskgarden/react-buttons'
import { ThumbsDownIcon, ThumbsUpIcon } from '../lib/icons'
import { useState } from 'react'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms'
import { Notification, Title, Close, useToast } from '@zendeskgarden/react-notifications'
import { SM, Paragraph } from '@zendeskgarden/react-typography'

const FeedbackSection = (props) => {
  // Because we only have one text field to store multiple versions of feedback, I had to get creative
  // Feedback will be appended to this text field in the following format (timestamp is the unixTime)
  // timestamp>>>positive_or_negative>>>additional_text_feedback
  // e.g., 818035920000>>>negative:::This ai summary sucks,,,
  // Because newline characters can be used in feedback, I can't reliably use that to delimit
  const feedbackIsEmpty = props.feedback == ""
  const allFeedbacks = feedbackIsEmpty ? [] : props.feedback.split(',,,')
  const newestFeedback = feedbackIsEmpty ? [] : allFeedbacks[allFeedbacks.length - 2].split('>>>')
  const newestDatetime = feedbackIsEmpty ? props.timestamp : new Date(Number(newestFeedback[0]))
  const timestampMatch = feedbackIsEmpty ? false : +newestDatetime == +props.timestamp
  const newestPositiveOrNegative = timestampMatch ? newestFeedback[1] : ""
  const newestTextFeedback = timestampMatch ? newestFeedback[2] : ""
  const [feedback, setFeedback] = useState(newestPositiveOrNegative)
  const [textFeedback, setTextFeedback] = useState(newestTextFeedback)
  const [feedbackTextInputVisible, setFeedbackTextInputVisible] = useState(newestTextFeedback.length > 0)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(true)
  // Used to notify user if they successfully submitted. 
  const { addToast } = useToast();  

  /** TODO: These are poorly written functions that use local and global variables but save space*/
  const editFeedbackItem = (timestampOfEdit, posOrNeg, additionalFeedback) => {
    // In order to make an edit to an existing feedback, we need to change the delimited feedbacks array and then join it again
    let editedFeedback = allFeedbacks
    editedFeedback[allFeedbacks.length - 2] = timestampOfEdit + ">>>" + posOrNeg + ">>>" + additionalFeedback
    props.setFeedback(editedFeedback.join(",,,"))
  }

  /** TODO: These are poorly written functions that use local and global variables but save space*/
  const appendFeedbackItem = (timestampOfAppend, posOrNeg, additionalFeedback) => {
    props.setFeedback(props.feedback + timestampOfAppend + ">>>" + posOrNeg + ">>>" + additionalFeedback + ",,,")
  }
  
  const handleFeedbackClicked = ( positiveOrNegative ) => {
    // This case handles when thumbs up is clicked
    switch (positiveOrNegative) {
      case "positive":
        setFeedback("positive")
        // Set value
        if (timestampMatch) {editFeedbackItem(newestDatetime.getTime(), "positive", "")}
        else {appendFeedbackItem(props.timestamp.getTime(), "positive", "")}
        if (feedbackTextInputVisible) setFeedbackTextInputVisible(false);
        break;
      case "negative":
        setFeedback("negative")
        // Set value
        if (timestampMatch) {editFeedbackItem(newestDatetime.getTime(), "negative", textFeedback)} 
        else {appendFeedbackItem(props.timestamp.getTime(), "negative", textFeedback)}
        if (!feedbackTextInputVisible) setFeedbackTextInputVisible(true);
        break;
      default:
        console.error("Invalid parameter provided.")
    }
  }
  const handleFeedbackSubmitted = () => {
    if (timestampMatch) {editFeedbackItem(newestDatetime.getTime(), "negative", textFeedback)} 
    else {appendFeedbackItem(props.timestamp.getTime(), "negative", textFeedback)}
    setFeedbackSubmitted(true)
    addToast(({ close }) => (
      <Notification type ="success">
        <Title>Successly submmited feedback</Title>
        Thank you for providing feedback to the team.
        <Close onClick={close} aria-label="Close" />
      </Notification>
    ), {'placement': 'bottom-end'})
  }

  const handleTextFeedbackChange = (event) => {
    setTextFeedback(event.target.value);
    if (newestFeedback[2] != event.target.value) {if (feedbackSubmitted) setFeedbackSubmitted(false)}
    else {if (!feedbackSubmitted) setFeedbackSubmitted(true)}
  }
  
  const StartingStateButtons = () => {
    return (
      <>
      { feedback == "positive" ? 
        <IconButton isSelected size="small" isBasic={false} isPill={false} style={{ marginRight: 8}} onClick={() => handleFeedbackClicked("positive")}>
          {ThumbsUpIcon}
        </IconButton> :
        <IconButton size="small" isBasic={false} isPill={false} style={{ marginRight: 8}} onClick={() => handleFeedbackClicked("positive")}>
          {ThumbsUpIcon}
        </IconButton>
      }
      { feedback  == "negative" ? 
        <IconButton isSelected size="small" isBasic={false} isPill={false} onClick={() => handleFeedbackClicked("negative")}>{ThumbsDownIcon}</IconButton> :
        <IconButton size="small" isBasic={false} isPill={false} onClick={() => handleFeedbackClicked("negative")}>{ThumbsDownIcon}</IconButton>
      }  
      </>
    )
  }
  return (
    <>
      { props.timestamp ? <SM><Paragraph size="small">Last Updated: {props.timestamp.toDateString() + " " + props.timestamp.toLocaleTimeString('en-US')}</Paragraph></SM> : <></> }
      <div style={{marginBottom: 16, marginTop: 16}}>
        <StartingStateButtons/>
      </div>
      { feedbackTextInputVisible ? 
      <>
        <Field style={{marginBottom: 4}}>
          <Label hidden isRegular>Additional Feedback</Label>
          <Textarea value={textFeedback} placeholder="Enter additional feedback for the team" onChange={handleTextFeedbackChange} minRows={3} maxRows={5}/>
        </Field>
        { feedbackSubmitted ? 
          <Button size="small" disabled isStretched onClick={()=>handleFeedbackSubmitted()} isPrimary>Submit</Button> :
          <Button size="small" isStretched onClick={()=>handleFeedbackSubmitted()} isPrimary>Submit</Button>
        }
      </> : 
      <></>}
    </>
  )
}

export default FeedbackSection