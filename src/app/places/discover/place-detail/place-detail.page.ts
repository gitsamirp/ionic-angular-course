import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  public  place: Place;
  private placeSub: Subscription;
  isBookable = false;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      let fetchedUserId;
      this.authService.userId.pipe(switchMap(userId => {
        if (!userId) {
          throw new Error("Found no user");
        }
        fetchedUserId = userId;
        return this.placesService.getPlace(paramMap.get('placeId'));

      })).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
      });
    });
  }

  onBookPlace() {
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModel('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModel('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModel(mode: 'select'|'random') {
    console.log(mode);
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode }
    }).then(
      modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }
    ).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({message: "Booking Place"}).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(this.place.id, this.place.title, this.place.imageUrl, data.firstName, data.lastName, data.guestNumber, data.startDate, data.endDate).subscribe(() => {
            loadingEl.dismiss();
          });
          console.log("BOOKED!");
        });
      }
    });
  }

  //we need this to avoid memory leak, need to manage lifecycle
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
