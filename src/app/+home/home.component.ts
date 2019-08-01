import {
  Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { HomeService } from './home.service';
import { User } from '../shared/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/request/auth.service';
import { FtpFile } from '../shared/models/ftp-file';
import { Image } from 'angular-modal-gallery';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FtpDir } from '../shared/models/ftp-dir';
import { FtpFolder } from '../shared/models/ftp-folder';
import { DataFolder } from './data-folder';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public ftpUserRootDir: FtpDir;
  public userFolder: DataFolder = new DataFolder();
  public ftpSharedRootDir: FtpDir;
  public sharedFolder: DataFolder = new DataFolder();
  public ftpUserVideoFiles: FtpFile[] = [];
  public ftpUserImageFiles: Image[] = [];
  public ftpSharedVideoFiles: FtpFile[] = [];
  public ftpSharedImageFiles: Image[] = [];
  public loginForm: FormGroup;
  private user: User = new User();

  constructor(private homeService: HomeService,
              public authService: AuthService,
              private fb: FormBuilder) {
    this.sharedFolder.base = 'shared';
  }

  public ngOnInit() {
    this.buildForm();
    if (this.authService.getSession()) {
      this.isAuthenticated.next(true);
      this.userFolder.base = this.authService.getSession();
      this.getData();
    }
  }

  public onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      let user = this.loginForm.value;
      this.authService.login(user.login, user.password).subscribe((response) => {
        if (response) {
          this.authService.setSession(response);
          this.isAuthenticated.next(true);
          this.userFolder.base = this.authService.getSession();
          this.getData();
        }
      });
    }
  }

  public logout() {
    this.isAuthenticated.next(false);
    this.authService.logout();
  }

  public goToSharedFolder(index: number) {
    this.sharedFolder.paths = this.sharedFolder.paths.slice(0, index);
    this.getData();
  }

  public selectSharedFolder(folder: FtpFolder | string) {
    if (folder instanceof FtpFolder) {
      folder.selected = true;
      this.sharedFolder.paths.push(folder.name);
    } else {
      this.sharedFolder.paths.push(folder);
    }
    this.getData();
  }

  public goToUserFolder(index: number) {
    this.userFolder.paths = this.userFolder.paths.slice(0, index);
    this.getData();
  }

  public selectUserFolder(folder: FtpFolder | string) {
    if (folder instanceof FtpFolder) {
      folder.selected = true;
      this.userFolder.paths.push(folder.name);
    } else {
      this.userFolder.paths.push(folder);
    }
    this.getData();
  }

  public downloadFile(file: FtpFile) {
    let link = document.createElement('a');
    link.href = `http://admin.nissanliveevent.com/php/download.php?file=${file.name}&path=${file.src.replace('http://www.nissanliveevent.com/admin/ftp/', '')}`;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public downloadAll(ftpDir: FtpDir, shared: boolean) {
    let name: string = this.getPathName(ftpDir.path);
    if (this.sharedFolder.paths.length === 0 && shared) {
      name = 'Shared';
    } else if (this.userFolder.paths.length === 0 && !shared) {
      name = 'Private';
    }
    let link = document.createElement('a');
    link.href = `http://admin.nissanliveevent.com/php/download.php?dir=${ftpDir.path}&name=${name}`;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getPathName(path: string) {
    return path.substring(path.lastIndexOf('/') + 1);
  }

  private getUserActualPath() {
    let path = this.userFolder.base;
    if (this.userFolder.paths.length > 0) {
      path += '/' + this.userFolder.paths.join('/');
    }
    return path;
  }

  private getSharedActualPath() {
    let path = this.sharedFolder.base;
    if (this.sharedFolder.paths.length > 0) {
      path += '/' + this.sharedFolder.paths.join('/');
    }
    return path;
  }

  private getData() {
    this.homeService.getFilesList(this.getUserActualPath()).subscribe((files: any[]) => {
      this.ftpUserRootDir = this.homeService.buildDir(files);
      this.ftpUserImageFiles = this.ftpUserRootDir.ftpFiles.images;
      this.ftpUserVideoFiles = this.ftpUserRootDir.ftpFiles.videos;
    });
    this.homeService.getFilesList(this.getSharedActualPath()).subscribe((files: any[]) => {
      this.ftpSharedRootDir = this.homeService.buildDir(files);
      this.ftpSharedImageFiles = this.ftpSharedRootDir.ftpFiles.images;
      this.ftpSharedVideoFiles = this.ftpSharedRootDir.ftpFiles.videos;
    });
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      login: [this.user.Login, [Validators.required]],
      password: [this.user.Password, Validators.required]
    });
  }
}
