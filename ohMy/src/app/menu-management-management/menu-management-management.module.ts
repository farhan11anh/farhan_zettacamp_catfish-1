import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuManagementMainComponent } from './menu-management-main/menu-management-main.component';
import { MaterialModule } from '../material/material.module';
import { MatTableModule } from '@angular/material/table';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuUpdateComponent } from './menu-update/menu-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    MenuManagementMainComponent,
    MenuFormComponent,
    MenuUpdateComponent
  ],
  imports: [
    CommonModule,MaterialModule, ReactiveFormsModule, MatProgressSpinnerModule, TranslateModule
  ],
  exports:[
    MenuManagementMainComponent, MenuFormComponent, MenuUpdateComponent
  ]
})
export class MenuManagementManagementModule { }
