import {Chart, Margin, CategoricalAxis, LinearAxis, BarPlot, Axis, Plot, TextPlot,
    ScatterPlot, StackedBarPlot, GroupedBarPlot, PlotTypes } from './interfaces';
import { Drawing, PlotModel } from './models';
import { XAxisModel, YAxisModel, CategoricalXAxisModel, LinearXAxisModel, LinearYAxisModel } from './axis/models';
import { BarPlotModel, StackedBarModel, GroupedBarModel } from './bars/models';
import { TextPlotModel } from './text/models';
import { LinePlotModel } from './lines/models';
import { ScatterPlotModel } from './scatter/models';
import { min, max, select, scaleBand, scaleLinear } from 'd3';
import { LinePlot } from './lines/interfaces';
import { GuidePlotModel } from './guide/models';
import { GuidePlot } from './guide/interfaces';

declare var d3: any;


export class ChartModel {
    private title = '';
    private margin = {top: 30, right: 20, bottom: 50, left: 50};
    private aspectRatio = 1.5;
    private xaxisModel: XAxisModel;
    private yaxisModel: YAxisModel;
    private plotModels: Array<PlotModel> = [];
    private additionalYAxis: {[key: string]: YAxisModel} = {};

    private drawing: Drawing;

    constructor(chart: Chart, svg: any) {
        if ('title' in chart) { this.title = chart.title; }
        if ('margin' in chart) {
            const m: Margin = chart.margin;
            if ('top' in m) { this.margin.top = chart.margin.top; }
            if ('right' in m) { this.margin.right = chart.margin.right; }
            if ('bottom' in m) { this.margin.bottom = chart.margin.bottom; }
            if ('left' in m) { this.margin.left = chart.margin.left; }
        }
        if ('aspectRatio' in chart) { this.aspectRatio = chart.aspectRatio; }
        this.drawing = new Drawing();
        this.xaxisModel = ChartModel.xaxis_model_from_xaxis(chart.xaxis, this.drawing);
        this.drawing.xaxis_type = this.xaxisModel.type;
        this.yaxisModel = new LinearYAxisModel(<LinearAxis>chart.yaxis, this.drawing);
        this.setup_additional_yaxis(chart);
        chart.plots.forEach( (plot: Plot) => {
            this.plotModels.push(ChartModel.plot_model_for_plot(plot, this.drawing));
        });
        this.drawing.svg = select(svg);
        this.initialize();
        this.draw();
    }

    private static plot_model_for_plot(plot: Plot, drawing: Drawing) {
        switch (plot.type) {
            case PlotTypes.Bar: { return new BarPlotModel(<BarPlot> plot, drawing); }
            case PlotTypes.GroupedBar: { return new GroupedBarModel(<GroupedBarPlot> plot, drawing); }
            case PlotTypes.StackedBar: { return new StackedBarModel(<StackedBarPlot> plot, drawing); }
            case PlotTypes.Line: { return new LinePlotModel(<LinePlot> plot, drawing); }
            case PlotTypes.Scatter: { return new ScatterPlotModel(<ScatterPlot> plot, drawing); }
            case PlotTypes.Text: { return new TextPlotModel(<TextPlot> plot, drawing); }
            case PlotTypes.HorizontalGuide: { return new GuidePlotModel(<GuidePlot> plot, drawing, true); }
            case PlotTypes.VerticalGuide: { return new GuidePlotModel(<GuidePlot> plot, drawing, false); }
        }
    }

    private static xaxis_model_from_xaxis(xaxis: Axis, drawing: Drawing) {
        if ('values' in xaxis) {
            return new CategoricalXAxisModel(<CategoricalAxis> xaxis, drawing);
        }
        return new LinearXAxisModel(<LinearAxis> xaxis, drawing);
    }


    private initialize() {
        let width = 600;
        let height = width / this.aspectRatio;
        width = width - this.margin.left - this.margin.right;
        height = height - this.margin.top - this.margin.bottom;
        this.drawing.dims.width = width;
        this.drawing.dims.height = height;

        this.draw_title();

        this.drawing.g = this.drawing.svg.append('g').attr('class', 'drawing')
                    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        this.drawing.plotg = this.drawing.g.append('g').attr('class', 'plotg');
        this.drawing.xaxis = this.drawing.g.append('g').attr('class', 'xaxis')
                        .attr('transform', 'translate(0,' + height + ')');
        this.drawing.xaxis.append('g').attr('class', 'xaxis_labels');
        this.draw_xaxis_title(width);
        this.drawing.yaxis = this.drawing.g.append('g').attr('class', 'yaxis');
        this.draw_yaxis_title(height);

        this.xaxisModel.initialize();
        this.yaxisModel.initialize();
        this.initialize_additional_yaxis();

        this.plotModels.forEach( (plotModel: PlotModel) => {
            plotModel.initialize();
        });
    }

    draw() {
        this.yaxisModel.data_range = this.y_range('y');
        this.yaxisModel.draw();
        this.draw_additional_yaxis();
        this.xaxisModel.draw();
        this.xaxisModel.peg_xaxis_to_zero();
        this.plotModels.forEach( (plotModel: PlotModel) => {
            plotModel.draw();
        });
    }

    y_range(axis: string): [number, number] {
        const ranges = this.plotModels.filter((p: PlotModel) => p.yaxis === axis).map((p: PlotModel) => p.y_range());
        const min_y = min(ranges, (r) => r[0]);
        const max_y = max(ranges, (r) => r[1]);
        return [min_y, max_y];
    }

    private draw_title() {
        if (this.title === '') { return; }
        this.drawing.svg.append('text')
            .attr('transform', 'translate(300,15)')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text(this.title);
    }

    private draw_xaxis_title(width: number) {
        if (this.xaxisModel.title === '') { return; }
        this.drawing.xaxis.append('text')
            .attr('x', width / 2)
            .attr('y', this.xaxisModel.title_offset)
            .attr('fill', '#000')
            .attr('font-size', 15)
            .attr('text-anchor', 'middle')
            .style('font-style', 'italic')
            .text(this.xaxisModel.title);
    }

    private draw_yaxis_title(height: number) {
        if (this.yaxisModel.title === '') { return; }
        this.drawing.yaxis.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -this.yaxisModel.title_offset)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .style('font-style', 'italic')
            .attr('fill', '#000')
            .attr('font-size', 15)
            .text(this.yaxisModel.title);
    }

    private setup_additional_yaxis(chart: Chart) {
        if (!('additionalYAxis' in chart)) { return; }
        Object.keys(chart.additionalYAxis).forEach( (name: string) => {
            const newAxis = new LinearYAxisModel(<LinearAxis>chart.additionalYAxis[name], this.drawing, name, false);
            this.additionalYAxis[name] = newAxis;
        });
    }

    private initialize_additional_yaxis() {
        Object.keys(this.additionalYAxis).forEach( (name: string) => {
            this.additionalYAxis[name].initialize();
        } );
    }

    private draw_additional_yaxis() {
        Object.keys(this.additionalYAxis).forEach( (name: string) => {
            this.additionalYAxis[name].data_range = this.y_range(name);
            this.additionalYAxis[name].draw();
        } );
    }

}
