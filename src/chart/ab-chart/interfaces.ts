import { Axis, LinearAxis, CategoricalAxis } from './axis/interfaces';


export interface Chart {
    readonly title?: string;
    readonly margin?: Margin;
    readonly aspectRatio?: number;
    readonly xaxis: LinearAxis | CategoricalAxis;
    readonly yaxis: LinearAxis;
    readonly additionalYAxis?: {[key: string]: (LinearAxis | CategoricalAxis)};
    readonly plots: Array<Plot>;
}

export interface Margin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export enum PlotTypes {
    Bar,
    Text,
    Line,
    Scatter,
    StackedBar,
    GroupedBar,
    HorizontalGuide,
    VerticalGuide
}

export interface Plot {
    readonly type: PlotTypes;
    readonly yaxis?: string;
}

export * from './axis/interfaces';
export * from './bars/interfaces';
export * from './lines/interfaces';
export * from './scatter/interfaces';
export * from './text/interfaces';
export * from './guide/interfaces';
