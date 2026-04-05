import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


import { AppComponent } from './app.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';

import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceAllocateComponent } from './resource-allocate/resource-allocate.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { RegisterForEventComponent } from './register-for-event/register-for-event.component';
import { AuthService } from '../services/auth.service';
import { ViewResourceComponent } from './view-resources/view-resources.component';
import { LandingComponent } from './home/home.component';
import { ViewAllocationComponent } from './view-allocation/view-allocation.component';
import { ViewStudentsComponent } from './view-students/view-students.component';
import { ViewEducatorsComponent } from './view-educators/view-educators.component';
import { ViewEventComponent } from './view-event/view-event.component';


const routes: Routes = [
  {path:'app-landing' ,component:LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'create-event', component: CreateEventComponent },  
  { path: 'add-resource', component: AddResourceComponent }, 
  { path: 'view-resource', component: ViewResourceComponent },
  { path: 'resource-allocate', component: ResourceAllocateComponent },
  {path:'view-allocations' , component:ViewAllocationComponent},  
  { path: 'view-event/:id', component: ViewEventComponent},  
  { path: 'view-events', component: ViewEventsComponent },  
  { path: 'view-students', component: ViewStudentsComponent },
  { path: 'view-educators', component: ViewEducatorsComponent },
  { path: 'booking-details', component: BookingDetailsComponent }, 
  { path: 'register-for-event', component: RegisterForEventComponent },   
  { path: '', redirectTo: '/app-landing', pathMatch: 'full' },

  { path: '**', redirectTo: '/app-landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {constructor(private auth:AuthService){}
}
