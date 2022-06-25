import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContactComponent } from './create-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DeleteButtonModule } from 'src/app/shared/buttons/delete-button/delete-button.module';

@NgModule({
  declarations: [
    CreateContactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    DeleteButtonModule
  ],
  exports: [
    CreateContactComponent
  ]
})
export class CreateContactModule { }
