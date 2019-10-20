import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { delay, tap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService) {}

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string, placeImg: string, firstName: string, lastName: string, guestNum: number, dateFrom: Date, dateTo: Date) {
        const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, placeImg, firstName, lastName, guestNum, dateFrom, dateTo);   
        
        return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
            this._bookings.next(bookings.concat(newBooking));
        }));
    }
}
