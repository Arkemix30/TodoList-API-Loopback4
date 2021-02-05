import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserRelations, Todolist, Event} from '../models';
import {TodolistRepository} from './todolist.repository';
import {EventRepository} from './event.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {

  public readonly todolists: HasManyRepositoryFactory<Todolist, typeof User.prototype._id>;

  public readonly events: HasManyRepositoryFactory<Event, typeof User.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('TodolistRepository') protected todolistRepositoryGetter: Getter<TodolistRepository>, @repository.getter('EventRepository') protected eventRepositoryGetter: Getter<EventRepository>,
  ) {
    super(User, dataSource);
    this.events = this.createHasManyRepositoryFactoryFor('events', eventRepositoryGetter,);
    this.registerInclusionResolver('events', this.events.inclusionResolver);
    this.todolists = this.createHasManyRepositoryFactoryFor('todolists', todolistRepositoryGetter,);
    this.registerInclusionResolver('todolists', this.todolists.inclusionResolver);
  }
}
