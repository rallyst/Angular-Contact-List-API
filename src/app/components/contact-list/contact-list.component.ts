import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { ContactsService } from 'src/app/services/contacts.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})

export class ContactListComponent implements OnInit, OnDestroy {
  contacts$ = new Observable<User[]>();
  filContacts$ = new Observable<User[]>()
  _contactsSubject: Subject<any> = new Subject<any>();

  @Input() selected = '';
  searchText = '';
  totalContacts!: number;
  contactsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  filteredContacts: User[] = this.contactsService.filteredUsers;
  
  contactSub: any;
  contactLenghtSub: any;

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.contacts$ = this.contactsService.getContacts(this.contactsPerPage, this.currentPage);

    this.contactLenghtSub = this.contactsService.getContactsLength()
      .subscribe(x => this.totalContacts = x.length);

    this.contactSub = this.contacts$
      .subscribe(data => this.contactsService.userList = data); 

    this._contactsSubject
      .subscribe(data => this.contacts$ = this.contactsService.getContacts(this.contactsPerPage, this.currentPage))
  }

  filter(text: string) {
    this.filContacts$ = this.contactsService.filter(text, this.totalContacts, this.selected) 
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.contactsPerPage = pageData.pageSize;
    this.contacts$ = this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
  }

  onSort(sort: 'desc' | 'asc') {
    if (this.searchText) {
      this.filContacts$ = this.contactsService.filter(this.searchText, this.totalContacts, sort) 
    } else {
      this.contactsService.sort = sort;
      this.contacts$ = this.contactsService.getContacts(this.contactsPerPage, this.currentPage, this.contactsService.sort);
    }
  }

  onDelete(id: number) {
    this.totalContacts--;
    this.contactsService.deleteContact(id).subscribe(
      data => data,
      data => this._contactsSubject.next(data)
    )
  }

  ngOnDestroy() {
    this.contactSub.unsubscribe();
    this.contactLenghtSub.unsubscribe()
  }
}
