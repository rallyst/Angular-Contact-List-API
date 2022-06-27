import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../models/user';
import { Users } from '../models/users'

@Injectable({
  providedIn: 'root'
})
export class ContactsService implements OnInit {
  search: string = "";
  sort: 'desc' | 'asc' = 'desc';

  userList: User[] = [];
  filteredUsers: User[] = [];
  totalContacts!: number;

  URL = 'http://localhost:8000';

  constructor(
    private http: HttpClient) { }

  ngOnInit() {}

  getContactsLength() {
    return this.http.get<Users>(`${this.URL}/users`)
  }

  getContacts(contactPerPage: number, currentPage: number, sort = 'desc') {
    const contactsURL = `${this.URL}/users?search=${this.search}&sort=${sort}&page=${currentPage}&quantity=${contactPerPage}`
    return this.http.get<Users>(contactsURL)
      .pipe(
        map(x => x.users)
      )
  }

  getContact(contactId: number) {
    const contactURL = `${this.URL}/userbyid/${contactId}`;
    return this.http.get<User>(contactURL);
  }

  addContact(name: string, phoneNumbers: string[]) {
    const contact = {
      name: name,
      phoneNumbers: phoneNumbers
    };

   this.http.post(`${this.URL}/adduser`, contact)
    .subscribe(
      data => data,
      err => err
    );  
  }

  updatePost(id: string, name: string, phoneNumbers: string[]) {
    const contact = {
      name: name,
      phoneNumbers: phoneNumbers
    };
    
    this.http.put(`${this.URL}/updateuser/${id}`, contact)
      .subscribe( 
        data => data,
        err => err
      );
  }

  deleteContact(contactId: number) {
    const deleteUrl = `${this.URL}/deleteuser/${contactId}`;
    return this.http.delete(deleteUrl)
  }

  filter($event: string, totalContacts: number, sort: string) {
    const contactsURL = `${this.URL}/users?search=${$event}&sort=${sort}&page=1&quantity=${totalContacts}`
    return this.http.get<Users>(contactsURL)
    .pipe(
      map(x => x.users)
    )
  }
}
