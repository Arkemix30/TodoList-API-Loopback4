import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Task} from './task.model';
import {User} from './user.model';

@model()
export class Todolist extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    default: 'Mi lista de pendientes',
  })
  title?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  completed?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'array',
    itemType: Task,
  })
  tasks: object[];

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Todolist>) {
    super(data);
  }
}

export interface TodolistRelations {
  // describe navigational properties here
}

export type TodolistWithRelations = Todolist & TodolistRelations;
