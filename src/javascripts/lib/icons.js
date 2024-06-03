import React from 'react'
// For some reason, this webpack refuses to move node module SVGs into the dist folder. For now just defining svgs inline. 
export const CopyIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <path fill="currentColor" d="M11 4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6zm0 1H5v6h6V5zM7 0a1 1 0 011 1v1.5a.5.5 0 01-1 0V1H1v6h1.5a.5.5 0 010 1H1a1 1 0 01-1-1V1a1 1 0 011-1h6z"/>
</svg>

export const ThumbsDownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <g fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.23 7.5a.73.73 0 01-.73-.73C.57 5 .79.5 2 .5h5a.5.5 0 01.5.5v6.5s-1 .5-1 3a1 1 0 01-2 0v-3z"/>
    <rect width="2" height="7" x="9.5" y=".5" rx=".5" ry=".5"/>
  </g>
</svg>

export const ThumbsUpIcon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
  <g fill="none" stroke="currentColor">
    <path strokeLinejoin="round" d="M10.77 4.5a.73.73 0 01.73.73C11.43 7 11.21 11.5 10 11.5H5a.5.5 0 01-.5-.5V4.5s1-.5 1-3a1 1 0 012 0v3z"/>
    <rect width="2" height="7" x=".5" y="4.5" rx=".5" ry=".5"/>
  </g>
</svg>
