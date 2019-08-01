import {
  NgModule
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import 'hammerjs';
import 'mousetrap';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import '../styles/styles.scss';
import { AuthService } from './core/request/auth.service';
import { ConfigurationService } from './core/configuration/configuration.service';
import { RequestService } from './core/request/request.service';
import { HomeService } from './+home/home.service';
import { HttpClientModule } from '@angular/common/http';
import { VgBufferingModule } from 'videogular2/buffering';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from 'videogular2/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonMaterialModule } from './shared/modules/common-material.module';
import { HomeComponent } from './+home/home.component';
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  RequestService,
  AuthService,
  ConfigurationService,
  HomeService
];
type StoreType = {
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    CommonMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ModalGalleryModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
}
