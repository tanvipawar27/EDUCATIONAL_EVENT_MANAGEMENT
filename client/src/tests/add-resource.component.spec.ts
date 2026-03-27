import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddResourceComponent } from '../app/add-resource/add-resource.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '../services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';

describe('AddResourceComponent', () => {
  let component: AddResourceComponent;
  let fixture: ComponentFixture<AddResourceComponent>;
  let formBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddResourceComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [HttpService, AuthService]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResourceComponent);
    component = fixture.componentInstance;
    component.itemForm = formBuilder.group({
      description: ['', [Validators.required]],
      resourceType: ['', [Validators.required]],
      availability: ['', [Validators.required]] // Add the 'availability' field to the form
    });
    fixture.detectChanges();
  });

  it('should require description field', () => {
    const descriptionControl = component.itemForm.get('description');
    descriptionControl?.setValue('');
    expect(descriptionControl?.valid).toBeFalsy();
    expect(descriptionControl?.errors?.['required']).toBeTruthy();
  });

  it('should require resourceType field', () => {
    const resourceTypeControl = component.itemForm.get('resourceType');
    const descriptionControl = component.itemForm.get('description');
    descriptionControl?.setValue('Test Description');
    resourceTypeControl?.setValue('');
    expect(resourceTypeControl?.valid).toBeFalsy();
    expect(resourceTypeControl?.errors?.['required']).toBeTruthy();

    resourceTypeControl?.setValue('Test Type');
    expect(resourceTypeControl?.valid).toBeTruthy();
  });

  it('should require availability field', () => {
    const availabilityControl = component.itemForm.get('availability');
    availabilityControl?.setValue('');
    expect(availabilityControl?.valid).toBeFalsy();
    expect(availabilityControl?.errors?.['required']).toBeTruthy();
  });
});
