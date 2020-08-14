// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  bind,
  BindingScope,
  config,
  ContextTags,
  Provider,
} from '@loopback/context';
import * as multer from 'multer';
import {FileUploadServiceBindings, FileUploadHandler} from '../../keys';

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@bind({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FileUploadServiceBindings.FILE_UPLOAD_HANDLER},
})
export class FileUploadService implements Provider<FileUploadHandler> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      this.options.storage = multer.memoryStorage();
    }
  }

  value(): FileUploadHandler {
    return multer(this.options).any();
  }
}
