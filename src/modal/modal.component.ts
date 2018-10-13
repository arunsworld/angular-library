import { Component, Input, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
    selector: 'ab-modal',
    template: `
        <div class="modal" tabindex="-1" role="dialog" #modal>
            <div class="modal-dialog" [class.modal-lg]="large" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ng-content select="[body]"></ng-content>
                    </div>
                    <div class="modal-footer">
                        <ng-content select="[footer]"></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent {

    @Input() title: string;
    @Input() large: boolean;

    @ViewChild('modal') modal: ElementRef;

    show() {
        $(this.modal.nativeElement).modal('show');
    }

    hide() {
        $(this.modal.nativeElement).modal('hide');
    }

}
