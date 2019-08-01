import { Injectable } from '@angular/core';

const baseUrl: string = 'http://admin.nissanliveevent.com/php/';

@Injectable()
export class ConfigurationService {
  private urls: Map<string, string>;

  public initConfig() {
    this.initUrls();
  }

  public getUrl(key: string): string {
    if (this.urls.has(key)) {
      return this.urls.get(key);
    }
    return '';
  }

  private initUrls() {
    this.urls = new Map<string, string>();
    this.urls.set('Login', `${baseUrl}users.php`);
    this.urls.set('FilesList', `${baseUrl}admin.php`);
    this.urls.set('FilesFtpURl', `http://www.nissanliveevent.com/admin/ftp`);
  }
}
