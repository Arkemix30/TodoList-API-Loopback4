import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Event, EventRelations} from '../models';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype._id,
  EventRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Event, dataSource);
  }
}
