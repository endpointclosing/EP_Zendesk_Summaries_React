import React from 'react'
import SummaryItem from './SummaryItem'
import { Accordion } from '@zendeskgarden/react-accordions';

const MacroRecommendations = (props) => {
    const macroRecommendations = JSON.parse(props.macroRecommendations);
    const bulletPoints = macroRecommendations.macro_recommendations
        .map(item => `* ${item.macro_name}`)
        .join('\n');
    return (
        <Accordion isExpandable defaultExpandedSections={[0, 1, 2]} isCompact level={4}>
            <SummaryItem title="Macro Recommendations" content={bulletPoints} variant="bullet-points" />
        </Accordion>
    )
}

export default MacroRecommendations