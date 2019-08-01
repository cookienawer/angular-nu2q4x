import { Injectable } from '@angular/core';
import { RequestService } from '../core/request/request.service';
import { ConfigurationService } from '../core/configuration/configuration.service';
import { HttpParams } from '@angular/common/http';
import { FtpFile } from '../shared/models/ftp-file';
import { FtpFileType } from '../shared/models/ftp-file.type';
import { FtpFiles } from '../shared/models/ftp-files';
import { Image } from 'angular-modal-gallery';
import { FtpDir } from '../shared/models/ftp-dir';
import { FtpFolder } from '../shared/models/ftp-folder';

@Injectable()
export class HomeService {
  constructor(private requestService: RequestService,
              private configurationService: ConfigurationService) {
  }

  public getFilesList(path) {
    const filesUrl = this.configurationService.getUrl('FilesList');
    let params = new HttpParams();
    params = params.set('dir', 'true');
    params = params.set('path', path);
    return this.requestService.post(filesUrl, params);
  }

  public buildDir(result: any) {
    let ftpDir: FtpDir = new FtpDir();
    ftpDir.path = result.path;
    for (let i = 0, l = result.files.length; i < l; i++) {
      const file = result.files[i];
      if (file.type === 1) {
        let ftpFolder = new FtpFolder();
        ftpFolder.name = file.title;
        ftpDir.folders.push(ftpFolder);
      } else if (file.type === 0) {
        this.addItem(ftpDir, file);
      }
    }
    return ftpDir;
  }

  public addItem(ftpDir: FtpDir, item: any) {
    let ftpFile = new FtpFile();
    ftpFile.name = item.title;
    ftpFile.src = `${this.configurationService.getUrl('FilesFtpURl')}${ftpDir.path}/${ftpFile.name}`;
    let fileType = this.getFileType(ftpFile.name);
    if (fileType === FtpFileType.Image) {
      let image = new Image(ftpFile.src);
      ftpDir.ftpFiles.images.push(image);
    } else if (fileType === FtpFileType.Video) {
      ftpDir.ftpFiles.videos.push(ftpFile);
    }
  }

  private getFileType(fileName: string): FtpFileType {
    let fileType: FtpFileType = FtpFileType.NotSupported;
    if (fileName) {
      fileName = fileName.toLowerCase();
      if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        fileType = FtpFileType.Image;
      }
      if ((/\.(mp4|xvid|avi|mp3|mkv|avi)$/i).test(fileName)) {
        fileType = FtpFileType.Video;
      }
    }
    return fileType;
  }
}
