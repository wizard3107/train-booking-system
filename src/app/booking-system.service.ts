import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BookingSystemService {
  constructor(private https: HttpClient) {}
  URL = 'https://ticket-booking-sytem.onrender.com';
  getSeats(): Observable<any> {
    // let seat = of(seats);
    // return seat;
    return this.https.get(
      `https://ticket-booking-sytem.onrender.com/seats/reserved-seats`
    );
  }
  bookSeats(body: any): Observable<any> {
    return this.https.post(
      `https://ticket-booking-sytem.onrender.com/seats/reserve-seats`,
      body
    );
  }
  unreserveSeats(body: any): Observable<any> {
    return this.https.post(
      `https://ticket-booking-sytem.onrender.com/seats/unreserve-seats`,
      body
    );
  }
  userSeats(body: any): Observable<any> {
    return this.https.post(
      `https://ticket-booking-sytem.onrender.com/seats/user-seats`,
      body
    );
  }
}
