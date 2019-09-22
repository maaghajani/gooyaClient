import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// ---Other Compnent ----
import { BaseMapComponent } from './map-view/base-map/base-map.component';
import { UserLocationComponent } from './map-view/controller/user-location/user-location.component';
import { MousePositionComponent } from './map-view/controller/mouse-position/mouse-position.component';
import { ScaleLineComponent } from './map-view/controller/scale-line/scale-line.component';
import { ZoomComponent } from './map-view/controller/zoom/zoom.component';
import { ContextMenuComponent } from './map-view/context-menu/context-menu.component';
import { AttributeLayerComponent } from './map-view/controller/attribute-layer/attribute-layer.component';
import { PopupLocationComponent } from './map-view/controller/user-location/popup-location/popup-location.component';
import { MiniMapComponent } from './map-view/controller/mini-map/mini-map.component';
import { ReportErrorComponent } from './partial/report-error/report-error.component';
import { SendFeedbackComponent } from './map-view/controller/send-feedback/send-feedback.component';
import { PopupSuccessComponent } from './partial/popup-success/popup-success.component';
import { AddMissingPlaceComponent } from './partial/add-missing-place/add-missing-place.component';
// ---Other Compnent ----
// ----utility ----
import { MoreSearchComponent } from './map-view/utility/more-search/more-search.component';
import { UtilityComponent } from './map-view/utility/utility.component';
import { MenuComponent } from './map-view/utility/menu/menu.component';
import { SearchBoxComponent } from './map-view/utility/search-box/search-box.component';
import { DirectionComponent } from './map-view/utility/direction/direction.component';
import { NavigationComponent } from './map-view/utility/navigation/navigation.component';
import { YourPlacesComponent } from './map-view/utility/navigation/your-places/your-places.component';
import { LocationSharingComponent } from './map-view/utility/location-sharing/location-sharing.component';
import { CoordinateComponent } from './map-view/utility/more-search/coordinate/coordinate.component';
import { OddEvenComponent } from './map-view/utility/navigation/odd-even/odd-even.component';
import { TrafficComponent } from './map-view/utility/navigation/traffic/traffic.component';
import { LableComponent } from './map-view/utility/navigation/lable/lable.component';
import { TerrainComponent } from './map-view/utility/navigation/terrain/terrain.component';
import { TrafficAreaComponent } from './map-view/utility/navigation/traffic-area/traffic-area.component';
import { PoiComponent } from './map-view/utility/more-search/poi/poi.component';
import { IntersectionComponent } from './map-view/utility/more-search/intersection/intersection.component';
import { StreetComponent } from './map-view/utility/more-search/street/street.component';
// ----utility ----
// ----login component ----
import { LoginComponent } from './partial/login/login.component';
import { LoginPageComponent } from './partial/login/login-page/login-page.component';
import { SigninComponent } from './partial/login/signin/signin.component';
import { ForgetPassComponent } from './partial/login/forget-pass/forget-pass.component';
import { VerificationCodeComponent } from './partial/login/verification-code/verification-code.component';
// ----login component ----
// ----directive ----
import { HoverButtonDirective } from './shared/directive/hover-button.directive';
import { TooltipsDirective } from './shared/directive/tooltips.directive';
// ----directive ----
// ----for get info user----
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SwitchPoiComponent } from './map-view/utility/navigation/switch-poi/switch-poi.component';
import { AboutUsComponent } from './map-view/utility/navigation/about-us/about-us.component';
import { FavoritHomeComponent } from './map-view/utility/navigation/your-places/favorit-home/favorit-home.component';
import { FavoritWorkComponent } from './map-view/utility/navigation/your-places/favorit-work/favorit-work.component';
// ----for get info user----
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { SearchResultComponent } from './map-view/utility/search-result/search-result.component';

@NgModule({
  declarations: [
    BaseMapComponent,
    UserLocationComponent,
    MousePositionComponent,
    UtilityComponent,
    MenuComponent,
    SearchBoxComponent,
    DirectionComponent,
    AttributeLayerComponent,
    ScaleLineComponent,
    NavigationComponent,
    ZoomComponent,
    ContextMenuComponent,
    HoverButtonDirective,
    PopupLocationComponent,
    MiniMapComponent,
    LoginComponent,
    LoginPageComponent,
    SigninComponent,
    YourPlacesComponent,
    LocationSharingComponent,
    MoreSearchComponent,
    ForgetPassComponent,
    VerificationCodeComponent,
    ReportErrorComponent,
    SendFeedbackComponent,
    TooltipsDirective,
    PopupSuccessComponent,
    AddMissingPlaceComponent,
    IntersectionComponent,
    StreetComponent,
    PoiComponent,
    CoordinateComponent,
    OddEvenComponent,
    TrafficComponent,
    LableComponent,
    TerrainComponent,
    TrafficAreaComponent,
    SwitchPoiComponent,
    AboutUsComponent,
    FavoritHomeComponent,
    FavoritWorkComponent,
    SearchResultComponent,
  ],
  imports: [
    CommonModule,
    // form
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    DeviceDetectorModule.forRoot(),
    NgxUiLoaderModule, // import NgxUiLoaderModule
    NgxUiLoaderHttpModule.forRoot({ showForeground: true  ,  exclude: ['http://place.frdid.com/api/place/nearbysearch/']}),
    // import NgxUiLoaderHttpModule. By default, it will show background loader.
    // If you need to show foreground spinner, do as follow:
    // NgxUiLoaderHttpModule.forRoot({ showForeground: true })
  ],
  exports: [
    BaseMapComponent,
  ],
  providers: [
    BaseMapComponent,
    UserLocationComponent,
    MousePositionComponent,
    UtilityComponent,
    MenuComponent,
    SearchBoxComponent,
    DirectionComponent,
    AttributeLayerComponent,
    ScaleLineComponent,
    NavigationComponent,
    ZoomComponent,
    ContextMenuComponent,
    HoverButtonDirective,
    PopupLocationComponent,
    MiniMapComponent,
    LoginComponent,
    LoginPageComponent,
    SigninComponent,
    YourPlacesComponent,
    LocationSharingComponent,
    MoreSearchComponent,
    ForgetPassComponent,
    VerificationCodeComponent,
    ReportErrorComponent,
    SendFeedbackComponent,
    TooltipsDirective,
    PopupSuccessComponent,
    AddMissingPlaceComponent,
    IntersectionComponent,
    StreetComponent,
    PoiComponent,
    CoordinateComponent,
    OddEvenComponent,
    TrafficComponent,
    LableComponent,
    TerrainComponent,
    TrafficAreaComponent,
    SwitchPoiComponent,
    AboutUsComponent,
    FavoritHomeComponent,
    FavoritWorkComponent,
    SearchResultComponent,
  ],

})
export class ApplicationModule { }

