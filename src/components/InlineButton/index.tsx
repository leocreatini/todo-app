import React from 'react'

import './style.scss'

type InlineButtonLinkProps = {
  title: string
  href: string
}

function InlineButtonLink(props: InlineButtonLinkProps) {
  return (
    <a className="inline-button" href={props.href} target="_blank" rel="noopener noreferrer">
      {props.title}
    </a>
  )
}

type InlineButtonProps = {
  title: string
  onClick: () => void
}

function InlineButton(props: InlineButtonProps) {
  return (
    <button className="inline-button" onClick={props.onClick}>
      {props.title}
    </button>
  )
}

export { InlineButtonLink, InlineButton }
