import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';
 
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;
 
  constructor(private http: HttpClient, private authService: AuthService) {}
 
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
 
  // ---------------- STUDENT ----------------
  getBookingDetails(studentId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/student/registration-status/${studentId}`,
      { headers: this.getHeaders() }
    );
  }
 
  registerForEvent(eventId: any, details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/student/register/${eventId}`,
      details,
      { headers: this.getHeaders() }
    );
  }
  // ✅ NEWLY ADDED: Get all students
  getAllUsers(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/student/all`,
      { headers: this.getHeaders() }
    );
  }
 
  // ---------------- EDUCATOR ----------------
  getAllEventAgenda(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/educator/agenda`,
      { headers: this.getHeaders() }
    );
  }
 
  updateEvent(details: any, eventId: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/educator/update-material/${eventId}`,
      details,
      { headers: this.getHeaders() }
    );
  }
 
  // ---------------- INSTITUTION ----------------
  GetAllevents(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/institution/events`,
      { headers: this.getHeaders() }
    );
  }
 
  GetAllResources(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/institution/resources`,
      { headers: this.getHeaders() }
    );
  }
 
  createEvent(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/institution/event`,
      details,
      { headers: this.getHeaders() }
    );
  }
 
  // ✅ NEWLY ADDED: Delete event
  deleteEvent(eventId: any): Observable<any> {
    return this.http.delete(
      `${this.serverName}/api/institution/event/${eventId}`,
      { headers: this.getHeaders() }
    );
  }
 
  addResource(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/institution/resource`,
      details,
      { headers: this.getHeaders() }
    );
  }
 
  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/institution/event/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`,
      details,
      { headers: this.getHeaders() }
    );
  }
 
  // ---------------- USER (AUTH) ----------------
  Login(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, details, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
 
  registerUser(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/user/register`,
      details,
      { headers: this.getHeaders() }
    );
  }
  // ✅ Get all allocations (events with resources)
getAllAllocations(): Observable<any> {
  return this.http.get(
    `${this.serverName}/api/institution/allocations`,
    { headers: this.getHeaders() }
  );
}
// ---------------- STUDENT ----------------
getRegistrationStatus(studentId: any): Observable<any> {
  return this.http.get(
    `${this.serverName}/api/student/registration-status/${studentId}`,
    { headers: this.getHeaders() }
  );
}

// ---------------- OTP ----------------
sendOtp(email: string): Observable<object> {
  return this.http.post(
    `${this.serverName}/api/otp/send?email=${encodeURIComponent(email)}`,
    null,
    { headers: this.getHeaders(), responseType: 'text' as 'json' } // ✅ expect text
  );
}
 
verifyOtp(email: string, otp: string): Observable<object> {
  return this.http.post(
    `${this.serverName}/api/otp/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
    null,
    { headers: this.getHeaders(), responseType: 'text' as 'json' } // ✅ expect text
  );
}

// ---------------- INSTITUTION ----------------

// Get event by ID
getEventById(eventId: any): Observable<any> {
  return this.http.get(
    `${this.serverName}/api/institution/event/${eventId}`,
    { headers: this.getHeaders() }
  );
}


  getStudentRegistrations(studentId: number): Observable<any> {

  return this.http.get(

    `${this.serverName}/api/student/registrations/${studentId}`,

    { headers: this.getHeaders() }

  );

}
 

 sendMessage(message: string): Observable<string> {
  return this.http.post(
    `${this.serverName}/api/chat/message`,
    message,
    {
      headers: this.getHeaders(),
      responseType: 'text' // ✅ correct for plain text
    }
  );
}
// ✅ Delete Resource
deleteResource(resourceId: any): Observable<any> {
  return this.http.delete(
    `${this.serverName}/api/institution/resource/${resourceId}`,
    { headers: this.getHeaders() }
  );
}
  
sendFeedback(feedback: any) {

  return this.http.post(`${this.serverName}/api/feedback`, feedback);

}

getFeedback(): Observable<any[]> {

    return this.http.get<any[]>(`${this.serverName}/api/feedback`);

  }
  deleteFeedback(feedbackId:any){}
 
}

 
 
