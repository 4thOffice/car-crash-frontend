import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteParticipantsComponent } from './invite-participants.component';
import { RouterModule } from "@angular/router";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { QRCodeModule } from "angularx-qrcode";
import { PhoneNumberControlModule } from "@app/shared/form-controls/phone-number-control/phone-number-control.module";
import { ApiModule } from "@app/shared/api/api.module";



@NgModule({
  declarations: [
    InviteParticipantsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: InviteParticipantsComponent,
      }
    ]),
    FooterButtonsModule,
    QRCodeModule,
    PhoneNumberControlModule,
    ApiModule
  ]
})
export class InviteParticipantsModule { }
