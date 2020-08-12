import {S3, config} from 'aws-sdk';
import {Request, Response, HttpErrors} from '@loopback/rest';
import {UtilitiesServiceBindings} from '../../keys';
import {inject} from '@loopback/context';
import {UtilitiesService} from '../../infrastructure/services/utilities.service';
import * as _ from 'lodash';

export class S3Service {
  private s3Instance: S3;

  constructor(
    @inject(UtilitiesServiceBindings.UTILITIES_SERVICE)
    private utilitiesService: UtilitiesService,
  ) {
    // config s3 instance
    config.update({
      apiVersion: '2006-03-01', // current API version of s3
      accessKeyId: process.env.AWS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    });
    this.s3Instance = new S3();
  }

  listObjectV2() {
    return new Promise<any[]>((resolve, reject) => {
      this.s3Instance.listObjectsV2(
        {
          Bucket: 'cravingz',
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data.Contents);
        },
      );
    });
  }

  removeFile(filePath: string): Promise<S3.Types.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3Instance.deleteObject(
        {
          Bucket: 'cravingz',
          Key: filePath,
        },
        (error, reply) => {
          if (error) reject(error);
          else resolve(reply);
        },
      );
    });
  }

  upload(
    key: string,
    body: Buffer,
    options: Object = {},
  ): Promise<S3.ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      this.s3Instance.upload(
        {
          Bucket: 'cravingz',
          Key: key,
          Body: body,
        },
        options,
        (error: Error, reply: S3.ManagedUpload.SendData) => {
          if (error) reject(error);
          else resolve(reply);
        },
      );
    });
  }

  async uploadToFolder(request: Request, response: Response, folder = '') {
    if (_.isEmpty(folder)) return {};
    const {files} = await this.utilitiesService.getFilesAndFields(
      request,
      response,
    );
    const file = _.isEmpty(files) ? null : files[0];
    if (file === null) throw new HttpErrors.BadRequest('NO_FILE_UPLOADED');
    const extension = this.utilitiesService.getFileExtension(file.originalname);
    const time = new Date().getTime();
    const key = `${folder}/CV_IMG_${time}.${extension}`;
    return this.upload(key, file.buffer).then(fileData => {
      return fileData;
    });
  }
}
