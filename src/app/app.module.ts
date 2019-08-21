import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PubliYourPlaceVariableService } from 'src/application/map-view/utility/navigation/your-places/public-YourPlace-variable.service';
import { ApplicationModule } from './../application/application.module';
import { IranBoundryService } from './../application/shared/services/iranBoundry.service';
import { MapService } from './../application/shared/services/map.service';
import { PublicVarService } from './../application/shared/services/publicVar.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApplicationModule,
    BrowserAnimationsModule,
  ],
  providers: [MapService, PublicVarService, IranBoundryService, PubliYourPlaceVariableService],
  bootstrap: [AppComponent],
})
export class AppModule {}
