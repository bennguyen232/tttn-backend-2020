import {model, Entity, property} from '@loopback/repository';

@model()
export class TimestampEntity extends Entity {
  @property({type: 'date'})
  createdAt?: Date;

  @property({type: 'date'})
  updatedAt?: Date;
}
