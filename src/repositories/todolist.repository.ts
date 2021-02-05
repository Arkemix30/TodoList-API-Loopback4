import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Todolist, TodolistRelations} from '../models';

export class TodolistRepository extends DefaultCrudRepository<
  Todolist,
  typeof Todolist.prototype._id,
  TodolistRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Todolist, dataSource);
  }
}
