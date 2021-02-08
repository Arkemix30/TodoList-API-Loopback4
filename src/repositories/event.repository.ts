import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Event, EventRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype._id,
  EventRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Event.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Event, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
