import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from './event.model';
import {Todolist} from './todolist.model';

@model({
  settings: {hidden: ['password']}
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @hasMany(() => Todolist)
  todolists: Todolist[];

  @hasMany(() => Event)
  events: Event[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

export type Credentials = {
  email: string;
  password: string;
}

