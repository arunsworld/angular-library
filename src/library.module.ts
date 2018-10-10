import { NgModule } from '@angular/core';
import { LoadingComponent } from './bootstrap-components/loading.component';
import { BootstrapNavbarComponent } from './bootstrap-components/bootstrap-navbar.component';
import { Select2Component } from './select2/select2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesComponent } from './datatables/datatables.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { BootstrapLoginComponent } from './bootstrap-login/bootstrap-login.component';
import { ChartComponent } from './chart/ab-chart/chart.component';
import { BubbleComponent } from './chart/ab-bubble/bubble.component';
import { BootstrapCardComponent } from './bootstrap-components/bootstrap-card.component';
import { DatetimePickerComponent } from './datepicker/datetimepicker.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [LoadingComponent, BootstrapNavbarComponent, Select2Component,
    BootstrapLoginComponent, ChartComponent, BubbleComponent, BootstrapCardComponent,
    DataTablesComponent, DropzoneComponent, DatetimePickerComponent, ModalComponent],
  exports: [LoadingComponent, BootstrapNavbarComponent, Select2Component,
    BootstrapLoginComponent, ChartComponent, BubbleComponent, BootstrapCardComponent,
    DataTablesComponent, DropzoneComponent, DatetimePickerComponent, ModalComponent]
})
export class LibraryModule { }
