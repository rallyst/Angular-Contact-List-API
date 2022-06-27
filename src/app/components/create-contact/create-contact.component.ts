import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit, AfterViewChecked {
  isLoading = false;
  form!: FormGroup;
  contactId: any;
  group!: any;
  updatedPhones!: any;
  phoneNumbers: string[] = []

  _Subject = new BehaviorSubject<string[]>([]);
  numbers$: Observable<string[]> = this._Subject.asObservable();

  mode = 'create';

  constructor (
    private contactsService: ContactsService,
    private router: Router, 
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef) {
      this.group = {};
    } 

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({})

    this.isLoading = false;
    this.contactId  = +this.contactsService.totalContacts + 1;
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('contactId')) {
        this.mode = 'edit';
        this.contactId = paramMap.get('contactId');
        this.isLoading = true;

        this.contactsService.getContact(this.contactId).subscribe(contactData => {
          this.isLoading = false;

          this.phoneNumbers = [...contactData.phoneNumbers];
  
        if (this.phoneNumbers.length > 0) {
          this.group['name'] = [contactData.name, [Validators.required]];
          for (let i = 0; i < this.phoneNumbers.length; i++ ) {
            this.group['phone' + i] = [contactData.phoneNumbers[i], [Validators.required]];
          }

          this._Subject.next(this.phoneNumbers); 
        } else {
          this.mode = 'create';
        }
        this.form = this.formBuilder.group(this.group);
        })
      } else {
        this.form = this.formBuilder.group({
          name: '',
          phone: '',
          extraPhones: this.formBuilder.array([])
        });
      }
    })
  }

  inputChecker(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSaveContact() {
    if (this.form.invalid) return;

    if (this.mode === 'create') {
      const { name : name, extraPhones: extraPhones, phone: phones } = this.form.value
      const res:any[] = []

      Object.keys(extraPhones)
        .map(x => res.push(Object.values(extraPhones[x])))

      let extraNumbers = res.flat().concat(phones)
      this.contactsService.addContact(
        name,
        extraNumbers
      )
    } else {
      const { name : name, ...rest } = this.form.value
      this.updatedPhones = Object.keys(rest)
        .map(key => rest[key]);

      this.contactsService.updatePost(
        this.contactId,
        name,
        this.updatedPhones
      );
    }
    
    this.form.reset();
    this.goBack()
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
  
  get getExtraPhones() {
    return this.form.get('extraPhones') as FormArray;
  }

  addNumber() {
    if (this.mode === 'edit') {
      this.group[`phone${this.phoneNumbers.length}`] = ['', [Validators.required, Validators.minLength(3)]];
      this.form = this.formBuilder.group(this.group);
      this.phoneNumbers.push('');
      this._Subject.next(this.phoneNumbers);
    }

    if (this.mode === 'create') {  
      const extraPhones = this.form.get('extraPhones') as FormArray;
      extraPhones.push(this.createPhoneForm());
    }
  }

  removeNumber(i: number) {
    if (this.mode === 'edit') {
      this.phoneNumbers.splice(i, 1);
      this.form.removeControl(`phone${i}`)
      this._Subject.next(this.phoneNumbers);
    }
    
    if (this.mode === 'create') {
      const extraPhones = this.form.get('extraPhones') as FormArray;
      extraPhones.removeAt(i);
    }
  }

  createPhoneForm(): FormGroup {
    return new FormGroup({
      'number': new FormControl('')
    })
  }
}