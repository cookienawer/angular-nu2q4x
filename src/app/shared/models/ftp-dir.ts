import { FtpFiles } from './ftp-files';
import { FtpFolder } from './ftp-folder';

export class FtpDir {
  public ftpFiles: FtpFiles = new FtpFiles();
  public folders: FtpFolder[] = [];
  public name: string;
  public path: string;
}
