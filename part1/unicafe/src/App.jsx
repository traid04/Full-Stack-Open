import { useState } from 'react'

const Button = props => {
  const { onClick, text } = props;
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const StatisticLine = props => {
  const { text, value } = props;
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}


const Statistics = props => {
  const { good, neutral, bad, all, avg, positive } = props;
  if (all === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={avg} />
          <StatisticLine text="positive" value={positive + ' %'} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  let average = 0;
  if (all !== 0) {
    average = (good - bad) / all;
  }
  let positive = 0;
  if (all !== 0) {
    positive = (good / all) * 100;
  }

  const handleClickGood = () => {
    setGood(good + 1);
  }

  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
  }

  const handleClickBad = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleClickGood} text='good' />
      <Button onClick={handleClickNeutral} text='neutral' />
      <Button onClick={handleClickBad} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={average} positive={positive}/>
    </div>
  )
}

export default App
