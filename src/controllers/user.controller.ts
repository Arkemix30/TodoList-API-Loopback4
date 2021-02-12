import {authenticate, TokenService, UserService} from "@loopback/authentication";
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {
  PasswordHasherBindings, TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {Credentials, User} from '../models';
import {UserRepository} from '../repositories';
import {PasswordHasher} from '../services';

type AuthResponse = {
  token: string,
  expires: Date
  user: User,
}
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public expiresIn: number,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>
  ) { }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id',],
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const password = await this.passwordHasher.hashPassword(
      user.password,
    );

    return this.userRepository.create({
      ...user,
      password
    });
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance and JWT token',
        content: {
          'application/json': {
            schema: {
              token: 'string',
              expires: 'date',
              user: getModelSchemaRef(User, {exclude: ['password']})
            },
          }
        }
      }
    }
  })
  async auth(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              }
            }
          }
        }
      }
    }) creds: Credentials,
  ): Promise<AuthResponse> {

    const user = await this.userService.verifyCredentials(creds);

    const profile = this.userService.convertToUserProfile(user);

    const token = await this.tokenService.generateToken(profile);

    const expires = new Date();
    expires.setTime(expires.getTime() + (this.expiresIn * 1000));
    return {
      token,
      expires,
      user
    }
  }



  @authenticate('jwt')
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate('jwt')
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @authenticate('jwt')
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @authenticate('jwt')
  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate('jwt')
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
