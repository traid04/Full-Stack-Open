import type { JSX } from 'react';
import type { PartInfo } from '../types';


const Part = (props : PartInfo) : JSX.Element => {
    const { parts } = props;
    return (
        <>
            {parts.map(part => {
                switch (part.kind) {
                    case "basic":
                        return (
                            <div key={part.name}>
                                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                                <p>{part.description}</p>
                            </div>
                        );
                    case "group":
                        return (
                            <div key={part.name}>
                                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                                <p>project exercises {part.groupProjectCount}</p>
                            </div>
                        );
                    case "background":
                        return (
                            <div key={part.name}>
                                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                                <p>{part.description}</p>
                                <p>submit to {part.backgroundMaterial}</p>
                            </div>
                        );
                    case "special":
                        return (
                            <div key={part.name}>
                                <p><strong>{part.name} {part.exerciseCount}</strong></p>
                                <p>{part.description}</p>
                                <p>required skills: {part.requirements.map((p, index) => {
                                    return (
                                        <span key={p}>{p}{index === part.requirements.length - 1 ? '' : ', '}</span>
                                    )
                                })}</p>
                            </div>
                        );
                    default:
                        throw new Error(
                            `Unhandled discriminated union member: ${JSON.stringify(part)}`
                        );
                    }
                })
            }
        </>
    )
};

export default Part;