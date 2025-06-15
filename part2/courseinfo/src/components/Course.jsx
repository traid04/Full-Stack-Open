const Header = ({name}) => <h1>{name}</h1>;

const Part = ({part}) => <p> {`${part.name} ${part.exercises}`} </p>;

const Content = ({parts}) => (
    <>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </>
  );

const Total = ({parts}) => (
  <strong>
    total of {parts.reduce((sum, value) => sum + value.exercises, 0)} exercises
  </strong>
);

const Course = ({ course }) => {
  const { name, parts } = course;
  return (
    <>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  )
};

export default Course;