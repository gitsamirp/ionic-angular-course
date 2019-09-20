import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: 'discover', children: [
          {
            path: '',
            loadChildren: './discover/discover.module#DiscoverPageModule' // lazy loading component
          },
          {
            path: ':placeId',
            loadChildren: './discover/place-detail/place-detail.module#PlaceDetailPageModule'
          },
          {
            path: '',
            redirectTo: '/places/tabs/discover',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadChildren: './offers/offers.module#OffersPageModule'
          },
          {
            path: 'new',
            loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule'
          },
          {
            path: 'edit/:placeId',
            loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule'
          },
          {
            path: ':placeId',
            loadChildren: './offers/offer-bookings/offer-bookings.module#OfferBookingsPageModule'
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/places/tabs/discover',
    pathMatch: 'full'
  }
];
// remember to put hard coded routes first then parameter ones as it may thinkg "new" is the parameter

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutingModule {

}