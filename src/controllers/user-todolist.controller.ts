import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Todolist, User
} from '../models';
import {UserRepository} from '../repositories';

@authenticate('jwt')
export class UserTodolistController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/todolists', {
    responses: {
      '200': {
        description: 'Array of User has many Todolist',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todolist)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Todolist>,
  ): Promise<Todolist[]> {
    return this.userRepository.todolists(id).find(filter);
  }

  @post('/users/{id}/todolists', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todolist)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todolist, {
            title: 'NewTodolistInUser',
            exclude: ['_id'],
            optional: ['userId']
          }),
        },
      },
    }) todolist: Omit<Todolist, '_id'>,
  ): Promise<Todolist> {
    return this.userRepository.todolists(id).create(todolist);
  }

  @patch('/users/{id}/todolists', {
    responses: {
      '200': {
        description: 'User.Todolist PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todolist, {partial: true}),
        },
      },
    })
    todolist: Partial<Todolist>,
    @param.query.object('where', getWhereSchemaFor(Todolist)) where?: Where<Todolist>,
  ): Promise<Count> {
    return this.userRepository.todolists(id).patch(todolist, where);
  }

  @del('/users/{id}/todolists', {
    responses: {
      '200': {
        description: 'User.Todolist DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Todolist)) where?: Where<Todolist>,
  ): Promise<Count> {
    return this.userRepository.todolists(id).delete(where);
  }
}
