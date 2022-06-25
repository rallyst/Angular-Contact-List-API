import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list.component';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DeleteButtonModule } from 'src/app/shared/buttons/delete-button/delete-button.module';

@NgModule({
  declarations: [
    ContactListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
    DeleteButtonModule
  ],
  exports: [
    ContactListComponent
  ]
})
export class ContactListModule { }
