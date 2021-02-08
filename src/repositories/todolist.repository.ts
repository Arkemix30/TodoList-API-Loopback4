import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Todolist, TodolistRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TodolistRepository extends DefaultCrudRepository<
  Todolist,
  typeof Todolist.prototype._id,
  TodolistRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Todolist.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Todolist, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
