import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { FormModalModule } from "../../../shared/components/form-modal/form-modal.module";


@NgModule({
  declarations: [
    CrashComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    TranslocoModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: CrashComponent
          }
        ]
      }
    ]),
    FormModalModule
  ]
})
export class CrashModule { }