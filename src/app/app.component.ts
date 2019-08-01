import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import { ConfigurationService } from './core/configuration/configuration.service';

@Component({
  selector: 'ftp-viewer-app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor( private configurationService: ConfigurationService) {
    this.configurationService.initConfig();
  }
}
