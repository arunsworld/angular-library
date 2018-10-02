

export interface Axis {
    readonly title?: string;
    readonly title_offset?: number;
    readonly tick_label_rotation?: number;
    readonly tick_format?: (value: any, idx?: number) => any;
    readonly pegToZero?: boolean;
}

export enum AxisType {
    Linear = 0,
    Categorical
}

export interface LinearAxis extends Axis {
    min?: number;
    max?: number;
}

export interface CategoricalAxis extends Axis {
    values: Array<string>;
}

