import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactListModule } from './components/contact-list/contact-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchInputModule } from './components/search-input/search-input.module';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { CreateContactModule } from './components/create-contact/create-contact.module';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ContactListModule,
    BrowserAnimationsModule,
    SearchInputModule,
    FormsModule, 
    ReactiveFormsModule,
    CreateContactModule,
    AngularMaterialModule 
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
