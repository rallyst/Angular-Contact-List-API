import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { CreateContactComponent } from './components/create-contact/create-contact.component'

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'create', component: CreateContactComponent },
  { path: 'edit/:contactId', component: CreateContactComponent },
  { path: '**', component: ContactListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
