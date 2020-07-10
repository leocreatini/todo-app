import React from 'react'

import './style.scss'

type InlineButtonProps = {
  title: string
  href: string
}

export default function InlineButton(props: InlineButtonProps) {
  return (
    <a className="inline-button" href={props.href} target="_blank" rel="noopener noreferrer">
      {props.title}
    </a>
  )
}
