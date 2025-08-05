import type { JSX } from 'react';
import type { PartInfo } from '../types';
import Part from './Part';

const Content = (props: PartInfo) : JSX.Element => {
    return (
        <Part parts={props.parts}/>
    )
};

export default Content;