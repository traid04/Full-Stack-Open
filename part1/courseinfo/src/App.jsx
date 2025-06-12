const Part = props => {
  const { name, exercises } = props.part;
  return (
    <>
      <p>{name} {exercises}</p>
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
  return (
    <>
      <Part part={props.part[0]}/>
      <Part part={props.part[1]}/>
      <Part part={props.part[2]}/>
    </>
  )
}

const Total = props => {
  return(
    <>
      <p>Number of exercises {props.exercisesTotal[0].exercises + props.exercisesTotal[1].exercises + props.exercisesTotal[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
      <div>
        <Header course={course.name} />
        <Content part={course.parts} />
        <Total exercisesTotal={course.parts} />
      </div>
  )
}
export default App