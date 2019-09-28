import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private _bookings: Booking[] = [
        {
            id: 'x1',
            placeId: 'p1',
            placeTitle: 'Manhatten Mansion',
            guestNumber: 2,
            userId: 'abc'
        }
    ];

    get bookings() {
        return [...this._bookings];
    }
}