import type { JSX } from 'react';

interface Total {
    totalExercises: number;
}

const Total = (props: Total) : JSX.Element => {
    return(
        <p>Number of exercises {props.totalExercises}</p>
    )
};

export default Total;