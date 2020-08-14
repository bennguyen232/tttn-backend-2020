import {model, property} from '@loopback/repository';
import {TimestampEntity} from '../mixin/timestamp.mixin';
import {Status} from '../../keys';

@model()
export class Color extends TimestampEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: Status.ACTIVE,
  })
  status: Status;

  constructor(data?: Partial<Color>) {
    super(data);
  }
}
