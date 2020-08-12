import {Request, Response} from '@loopback/rest';
import {v4 as uuidV4} from 'uuid';
import {inject} from '@loopback/context';

import {FileUploadServiceBindings, FileUploadHandler} from '../../keys';

interface FilesAndFields {
  files: Express.Multer.File[];
  fields: any;
}

export class UtilitiesService {
  constructor(
    @inject(FileUploadServiceBindings.FILE_UPLOAD_HANDLER)
    private fileUploadHandler: FileUploadHandler,
  ) {}

  sleep = (second: number) =>
    new Promise(resolve => setTimeout(resolve, second));

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private handleFilesAndFields(request: Request): FilesAndFields {
    const uploadedFiles = request.files;
    let files: any[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles;
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename]);
      }
    }
    return {files, fields: request.body};
  }

  getFilesAndFields(request: Request, response: Response) {
    return new Promise<FilesAndFields>((resolve, reject) => {
      this.fileUploadHandler(request, response, err => {
        if (err) reject(err);
        else {
          resolve(this.handleFilesAndFields(request));
        }
      });
    });
  }

  createUUID(prefix = '') {
    const pre = prefix ? prefix + '_' : '';
    return `${pre}${uuidV4(v4options)}`;
  }

  getFileExtension(filename: string) {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }
}

const v4options = {
  random: [
    0x10,
    0x91,
    0x56,
    0xbe,
    0xc4,
    0xfb,
    0xc1,
    0xea,
    0x71,
    0xb4,
    0xef,
    0xe1,
    0x67,
    0x1c,
    0x58,
    0x36,
  ],
};
