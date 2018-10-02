import { Axis, AxisType, CategoricalAxis, LinearAxis } from './interfaces';
import { axisBottom, axisLeft, min, max, scaleBand, scaleLinear } from 'd3';
import { Drawing } from '../models';


export abstract class AxisModel {
    title = '';
    tick_label_rotation = 0;
    title_offset = 35;
    tick_format: (value: any) => string;
    type: AxisType;
    data_range: [number, number] = [undefined, undefined];
    protected axis: Axis;
    protected drawing: Drawing;

    constructor(axis: Axis, drawing: Drawing) {
        if ('title' in axis) { this.title = axis.title; }
        if ('tick_label_rotation' in axis) { this.tick_label_rotation = axis.tick_label_rotation; }
        if ('title_offset' in axis) { this.title_offset = axis.title_offset; }
        if ('tick_format' in axis) { this.tick_format = axis.tick_format; }
        this.axis = axis;
        this.drawing = drawing;
    }

    abstract initialize();
    abstract draw();
}

export abstract class XAxisModel extends AxisModel {

    protected axis: Axis;
    private pegToZero = false;

    constructor(axis: Axis, drawing: Drawing) {
        super(axis, drawing);
        if ('pegToZero' in axis) { this.pegToZero = axis.pegToZero; }
    }

    peg_xaxis_to_zero() {
        if (!this.pegToZero) { return; }
        this.drawing.xaxis.transition().duration(500)
            .attr('transform', 'translate(0,' + this.drawing.y(0) + ')');
    }

    protected rotate(labels) {
        if (this.tick_label_rotation === 0) { return; }
        const rotation_str = 'rotate(' + this.tick_label_rotation + ')';
        labels.selectAll('text')
                .attr('y', 0)
                .attr('x', -9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .attr('transform', rotation_str);
    }
}

export abstract class YAxisModel extends AxisModel {

    protected axis: Axis;

    constructor(axis: Axis, drawing: Drawing) {
        super(axis, drawing);
    }

}

export class CategoricalXAxisModel extends XAxisModel {

    protected axis: CategoricalAxis;

    constructor(axis: CategoricalAxis, drawing: Drawing) {
        super(axis, drawing);
        this.type = AxisType.Categorical;
    }

    initialize() {
        const width = this.drawing.dims.width;
        this.drawing.x = scaleBand().rangeRound([0, width]).padding(0.1);
    }

    draw() {
        this.drawing.x.domain(this.labels());
        const labels = this.drawing.xaxis.select('.xaxis_labels');
        const axisFunc = axisBottom(this.drawing.x).tickFormat(this.tick_format);
        labels.transition().duration(500).call(axisFunc);
        this.rotate(labels);
    }

    private labels(): Array<string> {
        return (<CategoricalAxis>this.axis).values;
    }

}

export class LinearXAxisModel extends XAxisModel {

    protected axis: LinearAxis;

    constructor(axis: LinearAxis, drawing: Drawing) {
        super(axis, drawing);
        this.type = AxisType.Linear;
    }

    initialize() {
        const width = this.drawing.dims.width;
        this.drawing.x = scaleLinear().rangeRound([0, width]);
    }

    draw() {
        this.drawing.x.domain([this.axis.min, this.axis.max]);
        const labels = this.drawing.xaxis.select('.xaxis_labels');
        const axisFunc = axisBottom(this.drawing.x).tickFormat(this.tick_format);
        labels.transition().duration(500).call(axisFunc);
        this.rotate(labels);
    }

}


export class LinearYAxisModel extends YAxisModel {

    protected axis: LinearAxis;
    protected axisName: string;
    protected visible: boolean;

    constructor(axis: LinearAxis, drawing: Drawing, axisName = 'y', visible = true) {
        super(axis, drawing);
        this.type = AxisType.Linear;
        this.axisName = axisName;
        this.visible = visible;
    }

    initialize() {
        const height = this.drawing.dims.height;
        this.drawing[this.axisName] = scaleLinear().rangeRound([height, 0]);
    }

    draw() {
        this.drawing[this.axisName].domain(this.y_range());
        if (this.visible) {
            const axisFunc = axisLeft(this.drawing[this.axisName]).tickFormat(this.tick_format);
            this.drawing.yaxis.transition().duration(500).call(axisFunc);
        }
    }

    private y_range(): [number, number] {
        const min_y = min([this.axis.min, this.data_range[0]]);
        const max_y = max([this.axis.max, this.data_range[1]]);
        return [min_y, max_y];
    }

}
