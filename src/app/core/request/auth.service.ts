import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-vars';
import { tokenNotExpired } from 'angular2-jwt';
import { RequestService } from './request.service';
import { HttpParams } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  constructor(public router: Router,
              private requestService: RequestService,
              private configurationService: ConfigurationService) {
  }

  public login(login: string, password: string) {
    let params = new HttpParams();
    params = params.set('dologin', 'true');
    params = params.set('login', login);
    params = params.set('password', password);
    params = params.set('rol', '0');
    const url = this.configurationService.getUrl('Login');
    return this.requestService.post(url, params);
  }

  public logout(): void {
    localStorage.removeItem('id_token');
  }

  public getSession() {
    return localStorage.getItem('id_token');
  }

  public setSession(id): void {
    localStorage.setItem('id_token', id);
  }
}
