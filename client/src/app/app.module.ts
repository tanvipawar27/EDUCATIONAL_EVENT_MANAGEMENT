
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceAllocateComponent } from './resource-allocate/resource-allocate.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { RegisterForEventComponent } from './register-for-event/register-for-event.component';
import { ViewResourceComponent } from './view-resources/view-resources.component';
import { LandingComponent } from './home/home.component';
import { ViewAllocationComponent } from './view-allocation/view-allocation.component';
import { ViewStudentsComponent } from './view-students/view-students.component';
import { ViewEducatorsComponent } from './view-educators/view-educators.component';
import { ChatbotComponent } from './Chat-Component/chatbot.component';

/* ✅ ADD THIS */
import { FeedbackComponent } from './feedback/feedback.component';

import { HttpService } from '../services/http.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    ChatbotComponent,
    RegistrationComponent,
    DashbaordComponent,
    CreateEventComponent,
    AddResourceComponent,
    ResourceAllocateComponent,
    ViewEventsComponent,
    BookingDetailsComponent,
    ViewResourceComponent,
    RegisterForEventComponent,
    ViewAllocationComponent,
    ViewStudentsComponent,
    ViewEducatorsComponent,

    /* ✅ ADD THIS */
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,          // ✅ required for ngModel
    ReactiveFormsModule,
    HttpClientModule      // ✅ correct place
  ],
  providers: [
    HttpService           // ✅ ONLY services here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

