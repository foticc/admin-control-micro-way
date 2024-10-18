import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Clients, ClientService } from '@app/api/client.service';
import { fnCheckForm } from '@utils/tools';
import { BasicConfirmModalComponent } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-forms',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    FormsModule,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzRowDirective,
    ReactiveFormsModule,
    NzDatePickerComponent
  ],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.less'
})
export class FormsComponent extends BasicConfirmModalComponent implements OnInit {
  addEditForm!: FormGroup;
  private fb = inject(FormBuilder);
  private api = inject(ClientService);

  readonly nzModalData: Clients = inject(NZ_MODAL_DATA);

  override modalRef = inject(NzModalRef);

  getCurrentValue(): NzSafeAny {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    return this.api.save(this.addEditForm.value).pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

  initForm(): void {
    this.addEditForm = this.fb.group({
      clientId: [null, [Validators.required]],
      clientIdIssuedAt: [null, [Validators.required]],
      clientSecret: [null, [Validators.required]],
      clientSecretExpiresAt: [null, [Validators.required]],
      clientName: [null, [Validators.required]],
      clientAuthenticationMethods: [null, [Validators.required]],
      authorizationGrantTypes: [null, [Validators.required]],
      redirectUris: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.modalRef);
    if (!!this.nzModalData) {
      this.addEditForm.patchValue(this.nzModalData);
    }
  }
}
