import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BookingSystemService {
  constructor(private http: HttpClient) {}
  getSeats(): Observable<any> {
    // let seat = of(seats);
    // return seat;
    return this.http.get('http://localhost:3000/seats/reserved-seats');
  }
  bookSeats(body: any): Observable<any> {
    return this.http.post('http://localhost:3000/seats/reserve-seats', body);
  }
  unreserveSeats(body: any): Observable<any> {
    return this.http.post('http://localhost:3000/seats/unreserve-seats', body);
  }
  userSeats(body: any): Observable<any> {
    return this.http.post('http://localhost:3000/seats/user-seats', body);
  }
}
