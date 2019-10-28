import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { delay, tap, take, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {}

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string, placeImg: string, firstName: string, lastName: string, guestNum: number, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
        let newBooking: Booking;
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
              if (!userId) {
                throw new Error('No user id found!');
              }
              newBooking = new Booking(
                Math.random().toString(),
                placeId,
                userId,
                placeTitle,
                placeImg,
                firstName,
                lastName,
                guestNum,
                dateFrom,
                dateTo
              );
              return this.http.post<{ name: string }>(
                'https://ionic-angular-course.firebaseio.com/bookings.json',
                { ...newBooking, id: null }
              );
            }),
            switchMap(resData => {
              generatedId = resData.name;
              return this.bookings;
            }),
            take(1),
            tap(bookings => {
              newBooking.id = generatedId;
              this._bookings.next(bookings.concat(newBooking));
            })
          );
        }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
            this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
        }));
    }
}
