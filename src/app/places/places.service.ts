import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
      new Place('p1',
       'Manhatten Mansion',
        'heart of nyc',
         'https://amp.businessinsider.com/images/5ad8ae04cd862425008b4898-750-563.jpg',
          149.99,
          new Date('2019-01-01'),
           new Date('2019-12-21'),
           'abc'
           ),
      new Place('p2', 'Lamour Toujours', 'Romantic place in france',
       'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
        189.99, 
        new Date('2019-01-01'),
         new Date('2019-12-21'),
         'abc'
         ),
      new Place('p3', 'The Foggy Palace', 'Not average city trip', 'data:image/jpeg;base64,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',
       99.99, new Date('2019-01-01'), new Date('2019-12-21'), 'abc')
    ]
  );

  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));

  }

  addPlace(title: string, description: string, price: number, availableFrom: Date, availableTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://amp.businessinsider.com/images/5ad8ae04cd862425008b4898-750-563.jpg',
      price,
      availableFrom,
      availableTo,
      this.authService.userId);

      let id: string;

    return this.httpClient.post<{name: string}>(
      'https://ionic-angular-course-fc7a2.firebaseio.com/offered-places.json',
       { ...newPlace, id: null })
    .pipe(
      switchMap(resData => {
        id = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = id;
        this._places.next(places.concat(newPlace));
      })

    );

    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   // fake api time by adding delay
    //     this._places.next(places.concat(newPlace));
    // }));
  }

}
