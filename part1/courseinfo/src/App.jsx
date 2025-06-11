const Part = props => {
  const { part, exercises } = props;
  return (
    <>
      <p>{part} {exercises}</p>
    </>
  )
}

const Header = props => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Content = props => {
  const { part, exercises } = props;
  return (
    <>
      <Part part={part[0]} exercises={exercises[0]} />
      <Part part={part[1]} exercises={exercises[1]} />
      <Part part={part[2]} exercises={exercises[2]} />
    </>
  )
}

const Total = props => {
  return(
    <>
      <p>Number of exercises {props.exercisesTotal}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
      <div>
        <Header course={course} />
        <Content part={[part1, part2, part3]} exercises={[exercises1, exercises2, exercises3]} />
        <Total exercisesTotal={exercises1 + exercises2 + exercises3} />
      </div>
  )
}
export default App