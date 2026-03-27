import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { CreateEventComponent } from '../app/create-event/create-event.component';

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEventComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [HttpService, AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate form fields', fakeAsync(() => {
    const nameInput = component.itemForm.controls['name'];
    const descriptionInput = component.itemForm.controls['description'];
    const materialsInput = component.itemForm.controls['materials'];

    // Set values to empty
    nameInput.setValue('');
    descriptionInput.setValue('');
    materialsInput.setValue('');

    // Trigger change detection
    fixture.detectChanges();
    tick();

    // Expect the form to be invalid
    expect(component.itemForm.valid).toBeFalsy();

    // Set valid values
    nameInput.setValue('Test Title');
    descriptionInput.setValue('Test Description');
    materialsInput.setValue('Aed');

    // Trigger change detection
    fixture.detectChanges();
    tick();

    // Expect the form to be valid
    expect(component.itemForm.valid).toBeTruthy();
  }));

  it('should validate form fields as invalid', fakeAsync(() => {
    const nameInput = component.itemForm.controls['name'];
    const descriptionInput = component.itemForm.controls['description'];
    const materialsInput = component.itemForm.controls['materials'];

    // Set valid values
    nameInput.setValue('Test Title');
    descriptionInput.setValue('Test Description');
    materialsInput.setValue('Aed');

    // Trigger change detection
    fixture.detectChanges();
    tick();

    // Expect the form to be valid
    expect(component.itemForm.valid).toBeTruthy();

    // Set empty values for all fields
    nameInput.setValue('');
    descriptionInput.setValue('');
    materialsInput.setValue('');

    // Trigger change detection
    fixture.detectChanges();
    tick();

    // Expect the form to be invalid
    expect(component.itemForm.valid).toBeFalsy();

    // Set valid value for one field and keep others empty
    nameInput.setValue('Test Title');
    descriptionInput.setValue('');
    materialsInput.setValue('');

    // Trigger change detection
    fixture.detectChanges();
    tick();

    // Expect the form to be invalid
    expect(component.itemForm.valid).toBeFalsy();
  }));
});
