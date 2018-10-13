import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[abDataTable]'
})
export class DataTableDirective implements AfterViewInit {

  @Input() options: {[key: string]: any};

  private dataTable: any;

  constructor(private dataTableElement: ElementRef) { }

  ngAfterViewInit() {
    this.dataTable = $(this.dataTableElement.nativeElement);
    this.dataTable = this.dataTable.dataTable(this.options);
  }

}
