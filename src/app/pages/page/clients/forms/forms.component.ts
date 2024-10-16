import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { BasicConfirmModalComponent } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-forms',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.less'
})
export class FormsComponent extends BasicConfirmModalComponent implements OnInit {
  @Input('params')
  data: NzSafeAny;

  getCurrentValue(): NzSafeAny {
    console.log('hhaha');
    return {};
  }

  ngOnInit(): void {
    this.data = this.modalRef.getConfig().nzData;
  }
}
