interface CoursePartBase {
    name: string;
    exerciseCount: number;
}

interface CoursePartDesc extends CoursePartBase {
    description: string;
}

interface CoursePartBasic extends CoursePartDesc {
    kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group";
}

interface CoursePartSpecial extends CoursePartDesc {
    requirements: string[];
    kind: "special";
}

interface CoursePartBackground extends CoursePartDesc {
    backgroundMaterial: string;
    kind: "background";
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

export interface PartInfo {
    parts: CoursePart[];
}