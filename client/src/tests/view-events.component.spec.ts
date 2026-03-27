import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { ViewEventsComponent } from '../app/view-events/view-events.component';

describe('ViewEventsComponent', () => {
  let component: ViewEventsComponent;
  let fixture: ComponentFixture<ViewEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEventsComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [HttpService, AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate form fields as invalid when title is empty', fakeAsync(() => {
    const nameInput = component.itemForm.controls['name'];
    const descriptionInput = component.itemForm.controls['description'];
    const materialsInput = component.itemForm.controls['materials'];

    // Set valid values
    nameInput.setValue('');
    descriptionInput.setValue('');
    materialsInput.setValue('');


    expect(component.itemForm.valid).toBeFalsy();
  }));

  it('should validate form fields as invalid when description is empty', fakeAsync(() => {
    const nameInput = component.itemForm.controls['name'];
    const descriptionInput = component.itemForm.controls['description'];
    const materialsInput = component.itemForm.controls['materials'];

    // Set valid values
    nameInput.setValue('ujjhy');
    descriptionInput.setValue('');
    materialsInput.setValue('hhhoikk');

    expect(component.itemForm.valid).toBeFalsy();
  }));
});
