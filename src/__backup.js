// xport interface AppProps {
//   textBefore: string
//   keyword: string
//   textAfter: string
// }

// const RESPONSE_STATUS = {
//   PENDING: 'pending',
//   PASS: 'pass',
//   WARN: 'warn',
//   FAIL: 'fail',
// }

// const [userInput, setUserInput] = React.useState('')
//   const [responseStatus, setResponseStatus] = React.useState(RESPONSE_STATUS.PENDING)
//   const [answerWidth, setAnswerWidth] = React.useState(0)
//   const $answerRef = React.useRef<HTMLElement>(null)

//   React.useEffect(() => {
//     if ($answerRef.current) {
//       setAnswerWidth($answerRef.current.clientWidth)
//     }
//   })

//   function checkAnswer(answer: string, input: string): string {
//     const percentage = compareTwoStrings(answer, input)
//     if (percentage === 1.0) {
//       return RESPONSE_STATUS.PASS
//     } else if (percentage >= 0.75) {
//       return RESPONSE_STATUS.WARN
//     } else {
//       return RESPONSE_STATUS.FAIL
//     }
//   }

//   <h2>Review</h2>
//       <form
//         onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
//           event.preventDefault()
//           setResponseStatus(checkAnswer(keyword, userInput))
//         }}
//       >
//         <p className="review__text">
//           {textBefore}
//           <span className="review__answer-container">
//             <input
//               className={`review__textfield ${responseStatus}`}
//               type="text"
//               value={userInput}
//               onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
//                 setUserInput(event.target.value)
//               }
//               style={{ width: answerWidth }}
//               maxLength={keyword.length}
//               autoFocus
//             />
//             <span className="review__answer" ref={$answerRef}>
//               {keyword}
//             </span>
//           </span>
//           {textAfter}
//         </p>
//       </form>
