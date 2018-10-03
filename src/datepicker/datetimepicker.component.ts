import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'ab-datetimepicker',
  template: `
    <input class="form-control" type="text" #datetimePicker/>
  `,
  styles: []
})
export class DatetimePickerComponent implements OnInit {

  @Input() options: DatetimePickerOptions;
  @Output() selected = new EventEmitter<null | moment.Moment>();

  @ViewChild('datetimePicker') datetimePicker: ElementRef;

  private _datetimePicker: any;
  private default_options = {
    format: 'D-MMM-YYYY h:mm A',
    minDate: false,
    maxDate: false,
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down',
      previous: 'fa fa-arrow-left',
      next: 'fa fa-arrow-right',
      today: 'fa fa-bullseye',
      clear: 'fa fa-trash',
      close: 'fa fa-times'
    }
  };

  ngOnInit(): void {
    this._datetimePicker = $(this.datetimePicker.nativeElement);
    $.extend(this.default_options, this.options);
    this._datetimePicker.datetimepicker(this.default_options);
    this._datetimePicker.on('dp.change', (e) => {
      let new_date = null;
      if (e.date !== false) {
        new_date = e.date.toDate();
      }
      this.selected.emit(new_date);
    });
  }

  set(new_date: Date | null | string | moment.Moment) {
    this._datetimePicker.data('DateTimePicker').date(new_date);
  }

  reset() {
    this.set(null);
  }

}

export interface DatetimePickerOptions {
  format?: string;
  minDate?: string | Date | boolean | moment.Moment;
  maxDate?: string | Date | boolean | moment.Moment;
  useCurrent?: boolean;
  disabledDates?: Array<Date | string | moment.Moment>;
  enabledDates?: Array<Date | string | moment.Moment>;
  sideBySide?: boolean;
  daysOfWeekDisabled?: Array<number>;
  showTodayButton?: boolean;
  showClear?: boolean;
}
