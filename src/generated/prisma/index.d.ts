
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Repertoire
 * 
 */
export type Repertoire = $Result.DefaultSelection<Prisma.$RepertoirePayload>
/**
 * Model Chapter
 * 
 */
export type Chapter = $Result.DefaultSelection<Prisma.$ChapterPayload>
/**
 * Model Play
 * A saved chess game / play belonging to a user.
 */
export type Play = $Result.DefaultSelection<Prisma.$PlayPayload>
/**
 * Model Puzzle
 * 
 */
export type Puzzle = $Result.DefaultSelection<Prisma.$PuzzlePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.repertoire`: Exposes CRUD operations for the **Repertoire** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Repertoires
    * const repertoires = await prisma.repertoire.findMany()
    * ```
    */
  get repertoire(): Prisma.RepertoireDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chapter`: Exposes CRUD operations for the **Chapter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chapters
    * const chapters = await prisma.chapter.findMany()
    * ```
    */
  get chapter(): Prisma.ChapterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.play`: Exposes CRUD operations for the **Play** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plays
    * const plays = await prisma.play.findMany()
    * ```
    */
  get play(): Prisma.PlayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.puzzle`: Exposes CRUD operations for the **Puzzle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Puzzles
    * const puzzles = await prisma.puzzle.findMany()
    * ```
    */
  get puzzle(): Prisma.PuzzleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Repertoire: 'Repertoire',
    Chapter: 'Chapter',
    Play: 'Play',
    Puzzle: 'Puzzle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "repertoire" | "chapter" | "play" | "puzzle"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Repertoire: {
        payload: Prisma.$RepertoirePayload<ExtArgs>
        fields: Prisma.RepertoireFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RepertoireFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RepertoireFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          findFirst: {
            args: Prisma.RepertoireFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RepertoireFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          findMany: {
            args: Prisma.RepertoireFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>[]
          }
          create: {
            args: Prisma.RepertoireCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          createMany: {
            args: Prisma.RepertoireCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RepertoireCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>[]
          }
          delete: {
            args: Prisma.RepertoireDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          update: {
            args: Prisma.RepertoireUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          deleteMany: {
            args: Prisma.RepertoireDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RepertoireUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RepertoireUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>[]
          }
          upsert: {
            args: Prisma.RepertoireUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RepertoirePayload>
          }
          aggregate: {
            args: Prisma.RepertoireAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepertoire>
          }
          groupBy: {
            args: Prisma.RepertoireGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepertoireGroupByOutputType>[]
          }
          count: {
            args: Prisma.RepertoireCountArgs<ExtArgs>
            result: $Utils.Optional<RepertoireCountAggregateOutputType> | number
          }
        }
      }
      Chapter: {
        payload: Prisma.$ChapterPayload<ExtArgs>
        fields: Prisma.ChapterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChapterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChapterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          findFirst: {
            args: Prisma.ChapterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChapterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          findMany: {
            args: Prisma.ChapterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          create: {
            args: Prisma.ChapterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          createMany: {
            args: Prisma.ChapterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChapterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          delete: {
            args: Prisma.ChapterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          update: {
            args: Prisma.ChapterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          deleteMany: {
            args: Prisma.ChapterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChapterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChapterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>[]
          }
          upsert: {
            args: Prisma.ChapterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChapterPayload>
          }
          aggregate: {
            args: Prisma.ChapterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChapter>
          }
          groupBy: {
            args: Prisma.ChapterGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChapterGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChapterCountArgs<ExtArgs>
            result: $Utils.Optional<ChapterCountAggregateOutputType> | number
          }
        }
      }
      Play: {
        payload: Prisma.$PlayPayload<ExtArgs>
        fields: Prisma.PlayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          findFirst: {
            args: Prisma.PlayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          findMany: {
            args: Prisma.PlayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>[]
          }
          create: {
            args: Prisma.PlayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          createMany: {
            args: Prisma.PlayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>[]
          }
          delete: {
            args: Prisma.PlayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          update: {
            args: Prisma.PlayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          deleteMany: {
            args: Prisma.PlayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>[]
          }
          upsert: {
            args: Prisma.PlayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayPayload>
          }
          aggregate: {
            args: Prisma.PlayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlay>
          }
          groupBy: {
            args: Prisma.PlayGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayCountArgs<ExtArgs>
            result: $Utils.Optional<PlayCountAggregateOutputType> | number
          }
        }
      }
      Puzzle: {
        payload: Prisma.$PuzzlePayload<ExtArgs>
        fields: Prisma.PuzzleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PuzzleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PuzzleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          findFirst: {
            args: Prisma.PuzzleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PuzzleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          findMany: {
            args: Prisma.PuzzleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>[]
          }
          create: {
            args: Prisma.PuzzleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          createMany: {
            args: Prisma.PuzzleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PuzzleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>[]
          }
          delete: {
            args: Prisma.PuzzleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          update: {
            args: Prisma.PuzzleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          deleteMany: {
            args: Prisma.PuzzleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PuzzleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PuzzleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>[]
          }
          upsert: {
            args: Prisma.PuzzleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzlePayload>
          }
          aggregate: {
            args: Prisma.PuzzleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePuzzle>
          }
          groupBy: {
            args: Prisma.PuzzleGroupByArgs<ExtArgs>
            result: $Utils.Optional<PuzzleGroupByOutputType>[]
          }
          count: {
            args: Prisma.PuzzleCountArgs<ExtArgs>
            result: $Utils.Optional<PuzzleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    repertoire?: RepertoireOmit
    chapter?: ChapterOmit
    play?: PlayOmit
    puzzle?: PuzzleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    plays: number
    repertoires: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plays?: boolean | UserCountOutputTypeCountPlaysArgs
    repertoires?: boolean | UserCountOutputTypeCountRepertoiresArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlaysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRepertoiresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepertoireWhereInput
  }


  /**
   * Count Type RepertoireCountOutputType
   */

  export type RepertoireCountOutputType = {
    chapters: number
  }

  export type RepertoireCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapters?: boolean | RepertoireCountOutputTypeCountChaptersArgs
  }

  // Custom InputTypes
  /**
   * RepertoireCountOutputType without action
   */
  export type RepertoireCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepertoireCountOutputType
     */
    select?: RepertoireCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RepertoireCountOutputType without action
   */
  export type RepertoireCountOutputTypeCountChaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    plays?: boolean | User$playsArgs<ExtArgs>
    repertoires?: boolean | User$repertoiresArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plays?: boolean | User$playsArgs<ExtArgs>
    repertoires?: boolean | User$repertoiresArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      plays: Prisma.$PlayPayload<ExtArgs>[]
      repertoires: Prisma.$RepertoirePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plays<T extends User$playsArgs<ExtArgs> = {}>(args?: Subset<T, User$playsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    repertoires<T extends User$repertoiresArgs<ExtArgs> = {}>(args?: Subset<T, User$repertoiresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.plays
   */
  export type User$playsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    where?: PlayWhereInput
    orderBy?: PlayOrderByWithRelationInput | PlayOrderByWithRelationInput[]
    cursor?: PlayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayScalarFieldEnum | PlayScalarFieldEnum[]
  }

  /**
   * User.repertoires
   */
  export type User$repertoiresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    where?: RepertoireWhereInput
    orderBy?: RepertoireOrderByWithRelationInput | RepertoireOrderByWithRelationInput[]
    cursor?: RepertoireWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RepertoireScalarFieldEnum | RepertoireScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Repertoire
   */

  export type AggregateRepertoire = {
    _count: RepertoireCountAggregateOutputType | null
    _min: RepertoireMinAggregateOutputType | null
    _max: RepertoireMaxAggregateOutputType | null
  }

  export type RepertoireMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    side: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepertoireMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    side: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RepertoireCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    side: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RepertoireMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    side?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepertoireMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    side?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RepertoireCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    side?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RepertoireAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repertoire to aggregate.
     */
    where?: RepertoireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repertoires to fetch.
     */
    orderBy?: RepertoireOrderByWithRelationInput | RepertoireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RepertoireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repertoires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repertoires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Repertoires
    **/
    _count?: true | RepertoireCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepertoireMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepertoireMaxAggregateInputType
  }

  export type GetRepertoireAggregateType<T extends RepertoireAggregateArgs> = {
        [P in keyof T & keyof AggregateRepertoire]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepertoire[P]>
      : GetScalarType<T[P], AggregateRepertoire[P]>
  }




  export type RepertoireGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RepertoireWhereInput
    orderBy?: RepertoireOrderByWithAggregationInput | RepertoireOrderByWithAggregationInput[]
    by: RepertoireScalarFieldEnum[] | RepertoireScalarFieldEnum
    having?: RepertoireScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepertoireCountAggregateInputType | true
    _min?: RepertoireMinAggregateInputType
    _max?: RepertoireMaxAggregateInputType
  }

  export type RepertoireGroupByOutputType = {
    id: string
    userId: string
    name: string
    side: string
    description: string
    createdAt: Date
    updatedAt: Date
    _count: RepertoireCountAggregateOutputType | null
    _min: RepertoireMinAggregateOutputType | null
    _max: RepertoireMaxAggregateOutputType | null
  }

  type GetRepertoireGroupByPayload<T extends RepertoireGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepertoireGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepertoireGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepertoireGroupByOutputType[P]>
            : GetScalarType<T[P], RepertoireGroupByOutputType[P]>
        }
      >
    >


  export type RepertoireSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    side?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapters?: boolean | Repertoire$chaptersArgs<ExtArgs>
    _count?: boolean | RepertoireCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repertoire"]>

  export type RepertoireSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    side?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repertoire"]>

  export type RepertoireSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    side?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repertoire"]>

  export type RepertoireSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    side?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RepertoireOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "side" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["repertoire"]>
  export type RepertoireInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapters?: boolean | Repertoire$chaptersArgs<ExtArgs>
    _count?: boolean | RepertoireCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RepertoireIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RepertoireIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RepertoirePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Repertoire"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chapters: Prisma.$ChapterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      side: string
      description: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["repertoire"]>
    composites: {}
  }

  type RepertoireGetPayload<S extends boolean | null | undefined | RepertoireDefaultArgs> = $Result.GetResult<Prisma.$RepertoirePayload, S>

  type RepertoireCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RepertoireFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RepertoireCountAggregateInputType | true
    }

  export interface RepertoireDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Repertoire'], meta: { name: 'Repertoire' } }
    /**
     * Find zero or one Repertoire that matches the filter.
     * @param {RepertoireFindUniqueArgs} args - Arguments to find a Repertoire
     * @example
     * // Get one Repertoire
     * const repertoire = await prisma.repertoire.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RepertoireFindUniqueArgs>(args: SelectSubset<T, RepertoireFindUniqueArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Repertoire that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RepertoireFindUniqueOrThrowArgs} args - Arguments to find a Repertoire
     * @example
     * // Get one Repertoire
     * const repertoire = await prisma.repertoire.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RepertoireFindUniqueOrThrowArgs>(args: SelectSubset<T, RepertoireFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repertoire that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireFindFirstArgs} args - Arguments to find a Repertoire
     * @example
     * // Get one Repertoire
     * const repertoire = await prisma.repertoire.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RepertoireFindFirstArgs>(args?: SelectSubset<T, RepertoireFindFirstArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Repertoire that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireFindFirstOrThrowArgs} args - Arguments to find a Repertoire
     * @example
     * // Get one Repertoire
     * const repertoire = await prisma.repertoire.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RepertoireFindFirstOrThrowArgs>(args?: SelectSubset<T, RepertoireFindFirstOrThrowArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Repertoires that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repertoires
     * const repertoires = await prisma.repertoire.findMany()
     * 
     * // Get first 10 Repertoires
     * const repertoires = await prisma.repertoire.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repertoireWithIdOnly = await prisma.repertoire.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RepertoireFindManyArgs>(args?: SelectSubset<T, RepertoireFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Repertoire.
     * @param {RepertoireCreateArgs} args - Arguments to create a Repertoire.
     * @example
     * // Create one Repertoire
     * const Repertoire = await prisma.repertoire.create({
     *   data: {
     *     // ... data to create a Repertoire
     *   }
     * })
     * 
     */
    create<T extends RepertoireCreateArgs>(args: SelectSubset<T, RepertoireCreateArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Repertoires.
     * @param {RepertoireCreateManyArgs} args - Arguments to create many Repertoires.
     * @example
     * // Create many Repertoires
     * const repertoire = await prisma.repertoire.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RepertoireCreateManyArgs>(args?: SelectSubset<T, RepertoireCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Repertoires and returns the data saved in the database.
     * @param {RepertoireCreateManyAndReturnArgs} args - Arguments to create many Repertoires.
     * @example
     * // Create many Repertoires
     * const repertoire = await prisma.repertoire.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Repertoires and only return the `id`
     * const repertoireWithIdOnly = await prisma.repertoire.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RepertoireCreateManyAndReturnArgs>(args?: SelectSubset<T, RepertoireCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Repertoire.
     * @param {RepertoireDeleteArgs} args - Arguments to delete one Repertoire.
     * @example
     * // Delete one Repertoire
     * const Repertoire = await prisma.repertoire.delete({
     *   where: {
     *     // ... filter to delete one Repertoire
     *   }
     * })
     * 
     */
    delete<T extends RepertoireDeleteArgs>(args: SelectSubset<T, RepertoireDeleteArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Repertoire.
     * @param {RepertoireUpdateArgs} args - Arguments to update one Repertoire.
     * @example
     * // Update one Repertoire
     * const repertoire = await prisma.repertoire.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RepertoireUpdateArgs>(args: SelectSubset<T, RepertoireUpdateArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Repertoires.
     * @param {RepertoireDeleteManyArgs} args - Arguments to filter Repertoires to delete.
     * @example
     * // Delete a few Repertoires
     * const { count } = await prisma.repertoire.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RepertoireDeleteManyArgs>(args?: SelectSubset<T, RepertoireDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repertoires.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repertoires
     * const repertoire = await prisma.repertoire.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RepertoireUpdateManyArgs>(args: SelectSubset<T, RepertoireUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repertoires and returns the data updated in the database.
     * @param {RepertoireUpdateManyAndReturnArgs} args - Arguments to update many Repertoires.
     * @example
     * // Update many Repertoires
     * const repertoire = await prisma.repertoire.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Repertoires and only return the `id`
     * const repertoireWithIdOnly = await prisma.repertoire.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RepertoireUpdateManyAndReturnArgs>(args: SelectSubset<T, RepertoireUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Repertoire.
     * @param {RepertoireUpsertArgs} args - Arguments to update or create a Repertoire.
     * @example
     * // Update or create a Repertoire
     * const repertoire = await prisma.repertoire.upsert({
     *   create: {
     *     // ... data to create a Repertoire
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repertoire we want to update
     *   }
     * })
     */
    upsert<T extends RepertoireUpsertArgs>(args: SelectSubset<T, RepertoireUpsertArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Repertoires.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireCountArgs} args - Arguments to filter Repertoires to count.
     * @example
     * // Count the number of Repertoires
     * const count = await prisma.repertoire.count({
     *   where: {
     *     // ... the filter for the Repertoires we want to count
     *   }
     * })
    **/
    count<T extends RepertoireCountArgs>(
      args?: Subset<T, RepertoireCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepertoireCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Repertoire.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepertoireAggregateArgs>(args: Subset<T, RepertoireAggregateArgs>): Prisma.PrismaPromise<GetRepertoireAggregateType<T>>

    /**
     * Group by Repertoire.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepertoireGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RepertoireGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepertoireGroupByArgs['orderBy'] }
        : { orderBy?: RepertoireGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RepertoireGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepertoireGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Repertoire model
   */
  readonly fields: RepertoireFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Repertoire.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RepertoireClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapters<T extends Repertoire$chaptersArgs<ExtArgs> = {}>(args?: Subset<T, Repertoire$chaptersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Repertoire model
   */
  interface RepertoireFieldRefs {
    readonly id: FieldRef<"Repertoire", 'String'>
    readonly userId: FieldRef<"Repertoire", 'String'>
    readonly name: FieldRef<"Repertoire", 'String'>
    readonly side: FieldRef<"Repertoire", 'String'>
    readonly description: FieldRef<"Repertoire", 'String'>
    readonly createdAt: FieldRef<"Repertoire", 'DateTime'>
    readonly updatedAt: FieldRef<"Repertoire", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Repertoire findUnique
   */
  export type RepertoireFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter, which Repertoire to fetch.
     */
    where: RepertoireWhereUniqueInput
  }

  /**
   * Repertoire findUniqueOrThrow
   */
  export type RepertoireFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter, which Repertoire to fetch.
     */
    where: RepertoireWhereUniqueInput
  }

  /**
   * Repertoire findFirst
   */
  export type RepertoireFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter, which Repertoire to fetch.
     */
    where?: RepertoireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repertoires to fetch.
     */
    orderBy?: RepertoireOrderByWithRelationInput | RepertoireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repertoires.
     */
    cursor?: RepertoireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repertoires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repertoires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repertoires.
     */
    distinct?: RepertoireScalarFieldEnum | RepertoireScalarFieldEnum[]
  }

  /**
   * Repertoire findFirstOrThrow
   */
  export type RepertoireFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter, which Repertoire to fetch.
     */
    where?: RepertoireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repertoires to fetch.
     */
    orderBy?: RepertoireOrderByWithRelationInput | RepertoireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Repertoires.
     */
    cursor?: RepertoireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repertoires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repertoires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repertoires.
     */
    distinct?: RepertoireScalarFieldEnum | RepertoireScalarFieldEnum[]
  }

  /**
   * Repertoire findMany
   */
  export type RepertoireFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter, which Repertoires to fetch.
     */
    where?: RepertoireWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Repertoires to fetch.
     */
    orderBy?: RepertoireOrderByWithRelationInput | RepertoireOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Repertoires.
     */
    cursor?: RepertoireWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Repertoires from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Repertoires.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Repertoires.
     */
    distinct?: RepertoireScalarFieldEnum | RepertoireScalarFieldEnum[]
  }

  /**
   * Repertoire create
   */
  export type RepertoireCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * The data needed to create a Repertoire.
     */
    data: XOR<RepertoireCreateInput, RepertoireUncheckedCreateInput>
  }

  /**
   * Repertoire createMany
   */
  export type RepertoireCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Repertoires.
     */
    data: RepertoireCreateManyInput | RepertoireCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Repertoire createManyAndReturn
   */
  export type RepertoireCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * The data used to create many Repertoires.
     */
    data: RepertoireCreateManyInput | RepertoireCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Repertoire update
   */
  export type RepertoireUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * The data needed to update a Repertoire.
     */
    data: XOR<RepertoireUpdateInput, RepertoireUncheckedUpdateInput>
    /**
     * Choose, which Repertoire to update.
     */
    where: RepertoireWhereUniqueInput
  }

  /**
   * Repertoire updateMany
   */
  export type RepertoireUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Repertoires.
     */
    data: XOR<RepertoireUpdateManyMutationInput, RepertoireUncheckedUpdateManyInput>
    /**
     * Filter which Repertoires to update
     */
    where?: RepertoireWhereInput
    /**
     * Limit how many Repertoires to update.
     */
    limit?: number
  }

  /**
   * Repertoire updateManyAndReturn
   */
  export type RepertoireUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * The data used to update Repertoires.
     */
    data: XOR<RepertoireUpdateManyMutationInput, RepertoireUncheckedUpdateManyInput>
    /**
     * Filter which Repertoires to update
     */
    where?: RepertoireWhereInput
    /**
     * Limit how many Repertoires to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Repertoire upsert
   */
  export type RepertoireUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * The filter to search for the Repertoire to update in case it exists.
     */
    where: RepertoireWhereUniqueInput
    /**
     * In case the Repertoire found by the `where` argument doesn't exist, create a new Repertoire with this data.
     */
    create: XOR<RepertoireCreateInput, RepertoireUncheckedCreateInput>
    /**
     * In case the Repertoire was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RepertoireUpdateInput, RepertoireUncheckedUpdateInput>
  }

  /**
   * Repertoire delete
   */
  export type RepertoireDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
    /**
     * Filter which Repertoire to delete.
     */
    where: RepertoireWhereUniqueInput
  }

  /**
   * Repertoire deleteMany
   */
  export type RepertoireDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Repertoires to delete
     */
    where?: RepertoireWhereInput
    /**
     * Limit how many Repertoires to delete.
     */
    limit?: number
  }

  /**
   * Repertoire.chapters
   */
  export type Repertoire$chaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    where?: ChapterWhereInput
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    cursor?: ChapterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Repertoire without action
   */
  export type RepertoireDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Repertoire
     */
    select?: RepertoireSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Repertoire
     */
    omit?: RepertoireOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RepertoireInclude<ExtArgs> | null
  }


  /**
   * Model Chapter
   */

  export type AggregateChapter = {
    _count: ChapterCountAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  export type ChapterMinAggregateOutputType = {
    id: string | null
    repertoireId: string | null
    name: string | null
    eco: string | null
    variation: string | null
    rootId: string | null
    startFen: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChapterMaxAggregateOutputType = {
    id: string | null
    repertoireId: string | null
    name: string | null
    eco: string | null
    variation: string | null
    rootId: string | null
    startFen: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChapterCountAggregateOutputType = {
    id: number
    repertoireId: number
    name: number
    eco: number
    variation: number
    rootId: number
    startFen: number
    nodes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChapterMinAggregateInputType = {
    id?: true
    repertoireId?: true
    name?: true
    eco?: true
    variation?: true
    rootId?: true
    startFen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChapterMaxAggregateInputType = {
    id?: true
    repertoireId?: true
    name?: true
    eco?: true
    variation?: true
    rootId?: true
    startFen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChapterCountAggregateInputType = {
    id?: true
    repertoireId?: true
    name?: true
    eco?: true
    variation?: true
    rootId?: true
    startFen?: true
    nodes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChapterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chapter to aggregate.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Chapters
    **/
    _count?: true | ChapterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChapterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChapterMaxAggregateInputType
  }

  export type GetChapterAggregateType<T extends ChapterAggregateArgs> = {
        [P in keyof T & keyof AggregateChapter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChapter[P]>
      : GetScalarType<T[P], AggregateChapter[P]>
  }




  export type ChapterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChapterWhereInput
    orderBy?: ChapterOrderByWithAggregationInput | ChapterOrderByWithAggregationInput[]
    by: ChapterScalarFieldEnum[] | ChapterScalarFieldEnum
    having?: ChapterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChapterCountAggregateInputType | true
    _min?: ChapterMinAggregateInputType
    _max?: ChapterMaxAggregateInputType
  }

  export type ChapterGroupByOutputType = {
    id: string
    repertoireId: string
    name: string
    eco: string
    variation: string
    rootId: string
    startFen: string
    nodes: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ChapterCountAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  type GetChapterGroupByPayload<T extends ChapterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChapterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChapterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChapterGroupByOutputType[P]>
            : GetScalarType<T[P], ChapterGroupByOutputType[P]>
        }
      >
    >


  export type ChapterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repertoireId?: boolean
    name?: boolean
    eco?: boolean
    variation?: boolean
    rootId?: boolean
    startFen?: boolean
    nodes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repertoireId?: boolean
    name?: boolean
    eco?: boolean
    variation?: boolean
    rootId?: boolean
    startFen?: boolean
    nodes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repertoireId?: boolean
    name?: boolean
    eco?: boolean
    variation?: boolean
    rootId?: boolean
    startFen?: boolean
    nodes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>

  export type ChapterSelectScalar = {
    id?: boolean
    repertoireId?: boolean
    name?: boolean
    eco?: boolean
    variation?: boolean
    rootId?: boolean
    startFen?: boolean
    nodes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChapterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "repertoireId" | "name" | "eco" | "variation" | "rootId" | "startFen" | "nodes" | "createdAt" | "updatedAt", ExtArgs["result"]["chapter"]>
  export type ChapterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }
  export type ChapterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }
  export type ChapterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repertoire?: boolean | RepertoireDefaultArgs<ExtArgs>
  }

  export type $ChapterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Chapter"
    objects: {
      repertoire: Prisma.$RepertoirePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      repertoireId: string
      name: string
      eco: string
      variation: string
      rootId: string
      startFen: string
      nodes: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chapter"]>
    composites: {}
  }

  type ChapterGetPayload<S extends boolean | null | undefined | ChapterDefaultArgs> = $Result.GetResult<Prisma.$ChapterPayload, S>

  type ChapterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChapterCountAggregateInputType | true
    }

  export interface ChapterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Chapter'], meta: { name: 'Chapter' } }
    /**
     * Find zero or one Chapter that matches the filter.
     * @param {ChapterFindUniqueArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChapterFindUniqueArgs>(args: SelectSubset<T, ChapterFindUniqueArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chapter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChapterFindUniqueOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChapterFindUniqueOrThrowArgs>(args: SelectSubset<T, ChapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindFirstArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChapterFindFirstArgs>(args?: SelectSubset<T, ChapterFindFirstArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindFirstOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChapterFindFirstOrThrowArgs>(args?: SelectSubset<T, ChapterFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chapters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chapters
     * const chapters = await prisma.chapter.findMany()
     * 
     * // Get first 10 Chapters
     * const chapters = await prisma.chapter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chapterWithIdOnly = await prisma.chapter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChapterFindManyArgs>(args?: SelectSubset<T, ChapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chapter.
     * @param {ChapterCreateArgs} args - Arguments to create a Chapter.
     * @example
     * // Create one Chapter
     * const Chapter = await prisma.chapter.create({
     *   data: {
     *     // ... data to create a Chapter
     *   }
     * })
     * 
     */
    create<T extends ChapterCreateArgs>(args: SelectSubset<T, ChapterCreateArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chapters.
     * @param {ChapterCreateManyArgs} args - Arguments to create many Chapters.
     * @example
     * // Create many Chapters
     * const chapter = await prisma.chapter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChapterCreateManyArgs>(args?: SelectSubset<T, ChapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chapters and returns the data saved in the database.
     * @param {ChapterCreateManyAndReturnArgs} args - Arguments to create many Chapters.
     * @example
     * // Create many Chapters
     * const chapter = await prisma.chapter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chapters and only return the `id`
     * const chapterWithIdOnly = await prisma.chapter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChapterCreateManyAndReturnArgs>(args?: SelectSubset<T, ChapterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Chapter.
     * @param {ChapterDeleteArgs} args - Arguments to delete one Chapter.
     * @example
     * // Delete one Chapter
     * const Chapter = await prisma.chapter.delete({
     *   where: {
     *     // ... filter to delete one Chapter
     *   }
     * })
     * 
     */
    delete<T extends ChapterDeleteArgs>(args: SelectSubset<T, ChapterDeleteArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chapter.
     * @param {ChapterUpdateArgs} args - Arguments to update one Chapter.
     * @example
     * // Update one Chapter
     * const chapter = await prisma.chapter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChapterUpdateArgs>(args: SelectSubset<T, ChapterUpdateArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chapters.
     * @param {ChapterDeleteManyArgs} args - Arguments to filter Chapters to delete.
     * @example
     * // Delete a few Chapters
     * const { count } = await prisma.chapter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChapterDeleteManyArgs>(args?: SelectSubset<T, ChapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chapters
     * const chapter = await prisma.chapter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChapterUpdateManyArgs>(args: SelectSubset<T, ChapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chapters and returns the data updated in the database.
     * @param {ChapterUpdateManyAndReturnArgs} args - Arguments to update many Chapters.
     * @example
     * // Update many Chapters
     * const chapter = await prisma.chapter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Chapters and only return the `id`
     * const chapterWithIdOnly = await prisma.chapter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChapterUpdateManyAndReturnArgs>(args: SelectSubset<T, ChapterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Chapter.
     * @param {ChapterUpsertArgs} args - Arguments to update or create a Chapter.
     * @example
     * // Update or create a Chapter
     * const chapter = await prisma.chapter.upsert({
     *   create: {
     *     // ... data to create a Chapter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chapter we want to update
     *   }
     * })
     */
    upsert<T extends ChapterUpsertArgs>(args: SelectSubset<T, ChapterUpsertArgs<ExtArgs>>): Prisma__ChapterClient<$Result.GetResult<Prisma.$ChapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterCountArgs} args - Arguments to filter Chapters to count.
     * @example
     * // Count the number of Chapters
     * const count = await prisma.chapter.count({
     *   where: {
     *     // ... the filter for the Chapters we want to count
     *   }
     * })
    **/
    count<T extends ChapterCountArgs>(
      args?: Subset<T, ChapterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChapterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChapterAggregateArgs>(args: Subset<T, ChapterAggregateArgs>): Prisma.PrismaPromise<GetChapterAggregateType<T>>

    /**
     * Group by Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChapterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChapterGroupByArgs['orderBy'] }
        : { orderBy?: ChapterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Chapter model
   */
  readonly fields: ChapterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chapter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChapterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repertoire<T extends RepertoireDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RepertoireDefaultArgs<ExtArgs>>): Prisma__RepertoireClient<$Result.GetResult<Prisma.$RepertoirePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Chapter model
   */
  interface ChapterFieldRefs {
    readonly id: FieldRef<"Chapter", 'String'>
    readonly repertoireId: FieldRef<"Chapter", 'String'>
    readonly name: FieldRef<"Chapter", 'String'>
    readonly eco: FieldRef<"Chapter", 'String'>
    readonly variation: FieldRef<"Chapter", 'String'>
    readonly rootId: FieldRef<"Chapter", 'String'>
    readonly startFen: FieldRef<"Chapter", 'String'>
    readonly nodes: FieldRef<"Chapter", 'Json'>
    readonly createdAt: FieldRef<"Chapter", 'DateTime'>
    readonly updatedAt: FieldRef<"Chapter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Chapter findUnique
   */
  export type ChapterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter findUniqueOrThrow
   */
  export type ChapterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter findFirst
   */
  export type ChapterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter findFirstOrThrow
   */
  export type ChapterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapter to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter findMany
   */
  export type ChapterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter, which Chapters to fetch.
     */
    where?: ChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chapters to fetch.
     */
    orderBy?: ChapterOrderByWithRelationInput | ChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Chapters.
     */
    cursor?: ChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * Chapter create
   */
  export type ChapterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The data needed to create a Chapter.
     */
    data: XOR<ChapterCreateInput, ChapterUncheckedCreateInput>
  }

  /**
   * Chapter createMany
   */
  export type ChapterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Chapters.
     */
    data: ChapterCreateManyInput | ChapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Chapter createManyAndReturn
   */
  export type ChapterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * The data used to create many Chapters.
     */
    data: ChapterCreateManyInput | ChapterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chapter update
   */
  export type ChapterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The data needed to update a Chapter.
     */
    data: XOR<ChapterUpdateInput, ChapterUncheckedUpdateInput>
    /**
     * Choose, which Chapter to update.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter updateMany
   */
  export type ChapterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Chapters.
     */
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyInput>
    /**
     * Filter which Chapters to update
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to update.
     */
    limit?: number
  }

  /**
   * Chapter updateManyAndReturn
   */
  export type ChapterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * The data used to update Chapters.
     */
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyInput>
    /**
     * Filter which Chapters to update
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chapter upsert
   */
  export type ChapterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * The filter to search for the Chapter to update in case it exists.
     */
    where: ChapterWhereUniqueInput
    /**
     * In case the Chapter found by the `where` argument doesn't exist, create a new Chapter with this data.
     */
    create: XOR<ChapterCreateInput, ChapterUncheckedCreateInput>
    /**
     * In case the Chapter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChapterUpdateInput, ChapterUncheckedUpdateInput>
  }

  /**
   * Chapter delete
   */
  export type ChapterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
    /**
     * Filter which Chapter to delete.
     */
    where: ChapterWhereUniqueInput
  }

  /**
   * Chapter deleteMany
   */
  export type ChapterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chapters to delete
     */
    where?: ChapterWhereInput
    /**
     * Limit how many Chapters to delete.
     */
    limit?: number
  }

  /**
   * Chapter without action
   */
  export type ChapterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chapter
     */
    select?: ChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chapter
     */
    omit?: ChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChapterInclude<ExtArgs> | null
  }


  /**
   * Model Play
   */

  export type AggregatePlay = {
    _count: PlayCountAggregateOutputType | null
    _min: PlayMinAggregateOutputType | null
    _max: PlayMaxAggregateOutputType | null
  }

  export type PlayMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    source: string | null
    white: string | null
    black: string | null
    result: string | null
    pgn: string | null
    startFen: string | null
    currentFen: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    source: string | null
    white: string | null
    black: string | null
    result: string | null
    pgn: string | null
    startFen: string | null
    currentFen: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    source: number
    white: number
    black: number
    result: number
    pgn: number
    startFen: number
    currentFen: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlayMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    source?: true
    white?: true
    black?: true
    result?: true
    pgn?: true
    startFen?: true
    currentFen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    source?: true
    white?: true
    black?: true
    result?: true
    pgn?: true
    startFen?: true
    currentFen?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    source?: true
    white?: true
    black?: true
    result?: true
    pgn?: true
    startFen?: true
    currentFen?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Play to aggregate.
     */
    where?: PlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plays to fetch.
     */
    orderBy?: PlayOrderByWithRelationInput | PlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plays
    **/
    _count?: true | PlayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayMaxAggregateInputType
  }

  export type GetPlayAggregateType<T extends PlayAggregateArgs> = {
        [P in keyof T & keyof AggregatePlay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlay[P]>
      : GetScalarType<T[P], AggregatePlay[P]>
  }




  export type PlayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayWhereInput
    orderBy?: PlayOrderByWithAggregationInput | PlayOrderByWithAggregationInput[]
    by: PlayScalarFieldEnum[] | PlayScalarFieldEnum
    having?: PlayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayCountAggregateInputType | true
    _min?: PlayMinAggregateInputType
    _max?: PlayMaxAggregateInputType
  }

  export type PlayGroupByOutputType = {
    id: string
    userId: string
    title: string | null
    source: string
    white: string | null
    black: string | null
    result: string
    pgn: string
    startFen: string
    currentFen: string | null
    createdAt: Date
    updatedAt: Date
    _count: PlayCountAggregateOutputType | null
    _min: PlayMinAggregateOutputType | null
    _max: PlayMaxAggregateOutputType | null
  }

  type GetPlayGroupByPayload<T extends PlayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayGroupByOutputType[P]>
            : GetScalarType<T[P], PlayGroupByOutputType[P]>
        }
      >
    >


  export type PlaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    source?: boolean
    white?: boolean
    black?: boolean
    result?: boolean
    pgn?: boolean
    startFen?: boolean
    currentFen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["play"]>

  export type PlaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    source?: boolean
    white?: boolean
    black?: boolean
    result?: boolean
    pgn?: boolean
    startFen?: boolean
    currentFen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["play"]>

  export type PlaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    source?: boolean
    white?: boolean
    black?: boolean
    result?: boolean
    pgn?: boolean
    startFen?: boolean
    currentFen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["play"]>

  export type PlaySelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    source?: boolean
    white?: boolean
    black?: boolean
    result?: boolean
    pgn?: boolean
    startFen?: boolean
    currentFen?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "source" | "white" | "black" | "result" | "pgn" | "startFen" | "currentFen" | "createdAt" | "updatedAt", ExtArgs["result"]["play"]>
  export type PlayInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PlayIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PlayIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PlayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Play"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string | null
      source: string
      white: string | null
      black: string | null
      result: string
      pgn: string
      startFen: string
      currentFen: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["play"]>
    composites: {}
  }

  type PlayGetPayload<S extends boolean | null | undefined | PlayDefaultArgs> = $Result.GetResult<Prisma.$PlayPayload, S>

  type PlayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayCountAggregateInputType | true
    }

  export interface PlayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Play'], meta: { name: 'Play' } }
    /**
     * Find zero or one Play that matches the filter.
     * @param {PlayFindUniqueArgs} args - Arguments to find a Play
     * @example
     * // Get one Play
     * const play = await prisma.play.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayFindUniqueArgs>(args: SelectSubset<T, PlayFindUniqueArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Play that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayFindUniqueOrThrowArgs} args - Arguments to find a Play
     * @example
     * // Get one Play
     * const play = await prisma.play.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Play that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayFindFirstArgs} args - Arguments to find a Play
     * @example
     * // Get one Play
     * const play = await prisma.play.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayFindFirstArgs>(args?: SelectSubset<T, PlayFindFirstArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Play that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayFindFirstOrThrowArgs} args - Arguments to find a Play
     * @example
     * // Get one Play
     * const play = await prisma.play.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plays
     * const plays = await prisma.play.findMany()
     * 
     * // Get first 10 Plays
     * const plays = await prisma.play.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playWithIdOnly = await prisma.play.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayFindManyArgs>(args?: SelectSubset<T, PlayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Play.
     * @param {PlayCreateArgs} args - Arguments to create a Play.
     * @example
     * // Create one Play
     * const Play = await prisma.play.create({
     *   data: {
     *     // ... data to create a Play
     *   }
     * })
     * 
     */
    create<T extends PlayCreateArgs>(args: SelectSubset<T, PlayCreateArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plays.
     * @param {PlayCreateManyArgs} args - Arguments to create many Plays.
     * @example
     * // Create many Plays
     * const play = await prisma.play.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayCreateManyArgs>(args?: SelectSubset<T, PlayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plays and returns the data saved in the database.
     * @param {PlayCreateManyAndReturnArgs} args - Arguments to create many Plays.
     * @example
     * // Create many Plays
     * const play = await prisma.play.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plays and only return the `id`
     * const playWithIdOnly = await prisma.play.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Play.
     * @param {PlayDeleteArgs} args - Arguments to delete one Play.
     * @example
     * // Delete one Play
     * const Play = await prisma.play.delete({
     *   where: {
     *     // ... filter to delete one Play
     *   }
     * })
     * 
     */
    delete<T extends PlayDeleteArgs>(args: SelectSubset<T, PlayDeleteArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Play.
     * @param {PlayUpdateArgs} args - Arguments to update one Play.
     * @example
     * // Update one Play
     * const play = await prisma.play.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayUpdateArgs>(args: SelectSubset<T, PlayUpdateArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plays.
     * @param {PlayDeleteManyArgs} args - Arguments to filter Plays to delete.
     * @example
     * // Delete a few Plays
     * const { count } = await prisma.play.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayDeleteManyArgs>(args?: SelectSubset<T, PlayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plays
     * const play = await prisma.play.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayUpdateManyArgs>(args: SelectSubset<T, PlayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plays and returns the data updated in the database.
     * @param {PlayUpdateManyAndReturnArgs} args - Arguments to update many Plays.
     * @example
     * // Update many Plays
     * const play = await prisma.play.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Plays and only return the `id`
     * const playWithIdOnly = await prisma.play.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Play.
     * @param {PlayUpsertArgs} args - Arguments to update or create a Play.
     * @example
     * // Update or create a Play
     * const play = await prisma.play.upsert({
     *   create: {
     *     // ... data to create a Play
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Play we want to update
     *   }
     * })
     */
    upsert<T extends PlayUpsertArgs>(args: SelectSubset<T, PlayUpsertArgs<ExtArgs>>): Prisma__PlayClient<$Result.GetResult<Prisma.$PlayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayCountArgs} args - Arguments to filter Plays to count.
     * @example
     * // Count the number of Plays
     * const count = await prisma.play.count({
     *   where: {
     *     // ... the filter for the Plays we want to count
     *   }
     * })
    **/
    count<T extends PlayCountArgs>(
      args?: Subset<T, PlayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Play.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayAggregateArgs>(args: Subset<T, PlayAggregateArgs>): Prisma.PrismaPromise<GetPlayAggregateType<T>>

    /**
     * Group by Play.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayGroupByArgs['orderBy'] }
        : { orderBy?: PlayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Play model
   */
  readonly fields: PlayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Play.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Play model
   */
  interface PlayFieldRefs {
    readonly id: FieldRef<"Play", 'String'>
    readonly userId: FieldRef<"Play", 'String'>
    readonly title: FieldRef<"Play", 'String'>
    readonly source: FieldRef<"Play", 'String'>
    readonly white: FieldRef<"Play", 'String'>
    readonly black: FieldRef<"Play", 'String'>
    readonly result: FieldRef<"Play", 'String'>
    readonly pgn: FieldRef<"Play", 'String'>
    readonly startFen: FieldRef<"Play", 'String'>
    readonly currentFen: FieldRef<"Play", 'String'>
    readonly createdAt: FieldRef<"Play", 'DateTime'>
    readonly updatedAt: FieldRef<"Play", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Play findUnique
   */
  export type PlayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter, which Play to fetch.
     */
    where: PlayWhereUniqueInput
  }

  /**
   * Play findUniqueOrThrow
   */
  export type PlayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter, which Play to fetch.
     */
    where: PlayWhereUniqueInput
  }

  /**
   * Play findFirst
   */
  export type PlayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter, which Play to fetch.
     */
    where?: PlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plays to fetch.
     */
    orderBy?: PlayOrderByWithRelationInput | PlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plays.
     */
    cursor?: PlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plays.
     */
    distinct?: PlayScalarFieldEnum | PlayScalarFieldEnum[]
  }

  /**
   * Play findFirstOrThrow
   */
  export type PlayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter, which Play to fetch.
     */
    where?: PlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plays to fetch.
     */
    orderBy?: PlayOrderByWithRelationInput | PlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plays.
     */
    cursor?: PlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plays.
     */
    distinct?: PlayScalarFieldEnum | PlayScalarFieldEnum[]
  }

  /**
   * Play findMany
   */
  export type PlayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter, which Plays to fetch.
     */
    where?: PlayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plays to fetch.
     */
    orderBy?: PlayOrderByWithRelationInput | PlayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plays.
     */
    cursor?: PlayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plays.
     */
    distinct?: PlayScalarFieldEnum | PlayScalarFieldEnum[]
  }

  /**
   * Play create
   */
  export type PlayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * The data needed to create a Play.
     */
    data: XOR<PlayCreateInput, PlayUncheckedCreateInput>
  }

  /**
   * Play createMany
   */
  export type PlayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plays.
     */
    data: PlayCreateManyInput | PlayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Play createManyAndReturn
   */
  export type PlayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * The data used to create many Plays.
     */
    data: PlayCreateManyInput | PlayCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Play update
   */
  export type PlayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * The data needed to update a Play.
     */
    data: XOR<PlayUpdateInput, PlayUncheckedUpdateInput>
    /**
     * Choose, which Play to update.
     */
    where: PlayWhereUniqueInput
  }

  /**
   * Play updateMany
   */
  export type PlayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plays.
     */
    data: XOR<PlayUpdateManyMutationInput, PlayUncheckedUpdateManyInput>
    /**
     * Filter which Plays to update
     */
    where?: PlayWhereInput
    /**
     * Limit how many Plays to update.
     */
    limit?: number
  }

  /**
   * Play updateManyAndReturn
   */
  export type PlayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * The data used to update Plays.
     */
    data: XOR<PlayUpdateManyMutationInput, PlayUncheckedUpdateManyInput>
    /**
     * Filter which Plays to update
     */
    where?: PlayWhereInput
    /**
     * Limit how many Plays to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Play upsert
   */
  export type PlayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * The filter to search for the Play to update in case it exists.
     */
    where: PlayWhereUniqueInput
    /**
     * In case the Play found by the `where` argument doesn't exist, create a new Play with this data.
     */
    create: XOR<PlayCreateInput, PlayUncheckedCreateInput>
    /**
     * In case the Play was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayUpdateInput, PlayUncheckedUpdateInput>
  }

  /**
   * Play delete
   */
  export type PlayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
    /**
     * Filter which Play to delete.
     */
    where: PlayWhereUniqueInput
  }

  /**
   * Play deleteMany
   */
  export type PlayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plays to delete
     */
    where?: PlayWhereInput
    /**
     * Limit how many Plays to delete.
     */
    limit?: number
  }

  /**
   * Play without action
   */
  export type PlayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Play
     */
    select?: PlaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Play
     */
    omit?: PlayOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayInclude<ExtArgs> | null
  }


  /**
   * Model Puzzle
   */

  export type AggregatePuzzle = {
    _count: PuzzleCountAggregateOutputType | null
    _avg: PuzzleAvgAggregateOutputType | null
    _sum: PuzzleSumAggregateOutputType | null
    _min: PuzzleMinAggregateOutputType | null
    _max: PuzzleMaxAggregateOutputType | null
  }

  export type PuzzleAvgAggregateOutputType = {
    seq: number | null
    rating: number | null
  }

  export type PuzzleSumAggregateOutputType = {
    seq: number | null
    rating: number | null
  }

  export type PuzzleMinAggregateOutputType = {
    id: string | null
    seq: number | null
    fen: string | null
    moves: string | null
    rating: number | null
  }

  export type PuzzleMaxAggregateOutputType = {
    id: string | null
    seq: number | null
    fen: string | null
    moves: string | null
    rating: number | null
  }

  export type PuzzleCountAggregateOutputType = {
    id: number
    seq: number
    fen: number
    moves: number
    rating: number
    themes: number
    _all: number
  }


  export type PuzzleAvgAggregateInputType = {
    seq?: true
    rating?: true
  }

  export type PuzzleSumAggregateInputType = {
    seq?: true
    rating?: true
  }

  export type PuzzleMinAggregateInputType = {
    id?: true
    seq?: true
    fen?: true
    moves?: true
    rating?: true
  }

  export type PuzzleMaxAggregateInputType = {
    id?: true
    seq?: true
    fen?: true
    moves?: true
    rating?: true
  }

  export type PuzzleCountAggregateInputType = {
    id?: true
    seq?: true
    fen?: true
    moves?: true
    rating?: true
    themes?: true
    _all?: true
  }

  export type PuzzleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Puzzle to aggregate.
     */
    where?: PuzzleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puzzles to fetch.
     */
    orderBy?: PuzzleOrderByWithRelationInput | PuzzleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PuzzleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puzzles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puzzles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Puzzles
    **/
    _count?: true | PuzzleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PuzzleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PuzzleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PuzzleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PuzzleMaxAggregateInputType
  }

  export type GetPuzzleAggregateType<T extends PuzzleAggregateArgs> = {
        [P in keyof T & keyof AggregatePuzzle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzle[P]>
      : GetScalarType<T[P], AggregatePuzzle[P]>
  }




  export type PuzzleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleWhereInput
    orderBy?: PuzzleOrderByWithAggregationInput | PuzzleOrderByWithAggregationInput[]
    by: PuzzleScalarFieldEnum[] | PuzzleScalarFieldEnum
    having?: PuzzleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PuzzleCountAggregateInputType | true
    _avg?: PuzzleAvgAggregateInputType
    _sum?: PuzzleSumAggregateInputType
    _min?: PuzzleMinAggregateInputType
    _max?: PuzzleMaxAggregateInputType
  }

  export type PuzzleGroupByOutputType = {
    id: string
    seq: number
    fen: string
    moves: string
    rating: number
    themes: string[]
    _count: PuzzleCountAggregateOutputType | null
    _avg: PuzzleAvgAggregateOutputType | null
    _sum: PuzzleSumAggregateOutputType | null
    _min: PuzzleMinAggregateOutputType | null
    _max: PuzzleMaxAggregateOutputType | null
  }

  type GetPuzzleGroupByPayload<T extends PuzzleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PuzzleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PuzzleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleGroupByOutputType[P]>
        }
      >
    >


  export type PuzzleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seq?: boolean
    fen?: boolean
    moves?: boolean
    rating?: boolean
    themes?: boolean
  }, ExtArgs["result"]["puzzle"]>

  export type PuzzleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seq?: boolean
    fen?: boolean
    moves?: boolean
    rating?: boolean
    themes?: boolean
  }, ExtArgs["result"]["puzzle"]>

  export type PuzzleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seq?: boolean
    fen?: boolean
    moves?: boolean
    rating?: boolean
    themes?: boolean
  }, ExtArgs["result"]["puzzle"]>

  export type PuzzleSelectScalar = {
    id?: boolean
    seq?: boolean
    fen?: boolean
    moves?: boolean
    rating?: boolean
    themes?: boolean
  }

  export type PuzzleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "seq" | "fen" | "moves" | "rating" | "themes", ExtArgs["result"]["puzzle"]>

  export type $PuzzlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Puzzle"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seq: number
      fen: string
      moves: string
      rating: number
      themes: string[]
    }, ExtArgs["result"]["puzzle"]>
    composites: {}
  }

  type PuzzleGetPayload<S extends boolean | null | undefined | PuzzleDefaultArgs> = $Result.GetResult<Prisma.$PuzzlePayload, S>

  type PuzzleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PuzzleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PuzzleCountAggregateInputType | true
    }

  export interface PuzzleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Puzzle'], meta: { name: 'Puzzle' } }
    /**
     * Find zero or one Puzzle that matches the filter.
     * @param {PuzzleFindUniqueArgs} args - Arguments to find a Puzzle
     * @example
     * // Get one Puzzle
     * const puzzle = await prisma.puzzle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PuzzleFindUniqueArgs>(args: SelectSubset<T, PuzzleFindUniqueArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Puzzle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PuzzleFindUniqueOrThrowArgs} args - Arguments to find a Puzzle
     * @example
     * // Get one Puzzle
     * const puzzle = await prisma.puzzle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PuzzleFindUniqueOrThrowArgs>(args: SelectSubset<T, PuzzleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Puzzle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleFindFirstArgs} args - Arguments to find a Puzzle
     * @example
     * // Get one Puzzle
     * const puzzle = await prisma.puzzle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PuzzleFindFirstArgs>(args?: SelectSubset<T, PuzzleFindFirstArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Puzzle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleFindFirstOrThrowArgs} args - Arguments to find a Puzzle
     * @example
     * // Get one Puzzle
     * const puzzle = await prisma.puzzle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PuzzleFindFirstOrThrowArgs>(args?: SelectSubset<T, PuzzleFindFirstOrThrowArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Puzzles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Puzzles
     * const puzzles = await prisma.puzzle.findMany()
     * 
     * // Get first 10 Puzzles
     * const puzzles = await prisma.puzzle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const puzzleWithIdOnly = await prisma.puzzle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PuzzleFindManyArgs>(args?: SelectSubset<T, PuzzleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Puzzle.
     * @param {PuzzleCreateArgs} args - Arguments to create a Puzzle.
     * @example
     * // Create one Puzzle
     * const Puzzle = await prisma.puzzle.create({
     *   data: {
     *     // ... data to create a Puzzle
     *   }
     * })
     * 
     */
    create<T extends PuzzleCreateArgs>(args: SelectSubset<T, PuzzleCreateArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Puzzles.
     * @param {PuzzleCreateManyArgs} args - Arguments to create many Puzzles.
     * @example
     * // Create many Puzzles
     * const puzzle = await prisma.puzzle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PuzzleCreateManyArgs>(args?: SelectSubset<T, PuzzleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Puzzles and returns the data saved in the database.
     * @param {PuzzleCreateManyAndReturnArgs} args - Arguments to create many Puzzles.
     * @example
     * // Create many Puzzles
     * const puzzle = await prisma.puzzle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Puzzles and only return the `id`
     * const puzzleWithIdOnly = await prisma.puzzle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PuzzleCreateManyAndReturnArgs>(args?: SelectSubset<T, PuzzleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Puzzle.
     * @param {PuzzleDeleteArgs} args - Arguments to delete one Puzzle.
     * @example
     * // Delete one Puzzle
     * const Puzzle = await prisma.puzzle.delete({
     *   where: {
     *     // ... filter to delete one Puzzle
     *   }
     * })
     * 
     */
    delete<T extends PuzzleDeleteArgs>(args: SelectSubset<T, PuzzleDeleteArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Puzzle.
     * @param {PuzzleUpdateArgs} args - Arguments to update one Puzzle.
     * @example
     * // Update one Puzzle
     * const puzzle = await prisma.puzzle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PuzzleUpdateArgs>(args: SelectSubset<T, PuzzleUpdateArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Puzzles.
     * @param {PuzzleDeleteManyArgs} args - Arguments to filter Puzzles to delete.
     * @example
     * // Delete a few Puzzles
     * const { count } = await prisma.puzzle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PuzzleDeleteManyArgs>(args?: SelectSubset<T, PuzzleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Puzzles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Puzzles
     * const puzzle = await prisma.puzzle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PuzzleUpdateManyArgs>(args: SelectSubset<T, PuzzleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Puzzles and returns the data updated in the database.
     * @param {PuzzleUpdateManyAndReturnArgs} args - Arguments to update many Puzzles.
     * @example
     * // Update many Puzzles
     * const puzzle = await prisma.puzzle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Puzzles and only return the `id`
     * const puzzleWithIdOnly = await prisma.puzzle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PuzzleUpdateManyAndReturnArgs>(args: SelectSubset<T, PuzzleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Puzzle.
     * @param {PuzzleUpsertArgs} args - Arguments to update or create a Puzzle.
     * @example
     * // Update or create a Puzzle
     * const puzzle = await prisma.puzzle.upsert({
     *   create: {
     *     // ... data to create a Puzzle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Puzzle we want to update
     *   }
     * })
     */
    upsert<T extends PuzzleUpsertArgs>(args: SelectSubset<T, PuzzleUpsertArgs<ExtArgs>>): Prisma__PuzzleClient<$Result.GetResult<Prisma.$PuzzlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Puzzles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleCountArgs} args - Arguments to filter Puzzles to count.
     * @example
     * // Count the number of Puzzles
     * const count = await prisma.puzzle.count({
     *   where: {
     *     // ... the filter for the Puzzles we want to count
     *   }
     * })
    **/
    count<T extends PuzzleCountArgs>(
      args?: Subset<T, PuzzleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Puzzle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PuzzleAggregateArgs>(args: Subset<T, PuzzleAggregateArgs>): Prisma.PrismaPromise<GetPuzzleAggregateType<T>>

    /**
     * Group by Puzzle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PuzzleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PuzzleGroupByArgs['orderBy'] }
        : { orderBy?: PuzzleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PuzzleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPuzzleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Puzzle model
   */
  readonly fields: PuzzleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Puzzle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PuzzleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Puzzle model
   */
  interface PuzzleFieldRefs {
    readonly id: FieldRef<"Puzzle", 'String'>
    readonly seq: FieldRef<"Puzzle", 'Int'>
    readonly fen: FieldRef<"Puzzle", 'String'>
    readonly moves: FieldRef<"Puzzle", 'String'>
    readonly rating: FieldRef<"Puzzle", 'Int'>
    readonly themes: FieldRef<"Puzzle", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Puzzle findUnique
   */
  export type PuzzleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter, which Puzzle to fetch.
     */
    where: PuzzleWhereUniqueInput
  }

  /**
   * Puzzle findUniqueOrThrow
   */
  export type PuzzleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter, which Puzzle to fetch.
     */
    where: PuzzleWhereUniqueInput
  }

  /**
   * Puzzle findFirst
   */
  export type PuzzleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter, which Puzzle to fetch.
     */
    where?: PuzzleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puzzles to fetch.
     */
    orderBy?: PuzzleOrderByWithRelationInput | PuzzleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Puzzles.
     */
    cursor?: PuzzleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puzzles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puzzles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Puzzles.
     */
    distinct?: PuzzleScalarFieldEnum | PuzzleScalarFieldEnum[]
  }

  /**
   * Puzzle findFirstOrThrow
   */
  export type PuzzleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter, which Puzzle to fetch.
     */
    where?: PuzzleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puzzles to fetch.
     */
    orderBy?: PuzzleOrderByWithRelationInput | PuzzleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Puzzles.
     */
    cursor?: PuzzleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puzzles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puzzles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Puzzles.
     */
    distinct?: PuzzleScalarFieldEnum | PuzzleScalarFieldEnum[]
  }

  /**
   * Puzzle findMany
   */
  export type PuzzleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter, which Puzzles to fetch.
     */
    where?: PuzzleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Puzzles to fetch.
     */
    orderBy?: PuzzleOrderByWithRelationInput | PuzzleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Puzzles.
     */
    cursor?: PuzzleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Puzzles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Puzzles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Puzzles.
     */
    distinct?: PuzzleScalarFieldEnum | PuzzleScalarFieldEnum[]
  }

  /**
   * Puzzle create
   */
  export type PuzzleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * The data needed to create a Puzzle.
     */
    data: XOR<PuzzleCreateInput, PuzzleUncheckedCreateInput>
  }

  /**
   * Puzzle createMany
   */
  export type PuzzleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Puzzles.
     */
    data: PuzzleCreateManyInput | PuzzleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Puzzle createManyAndReturn
   */
  export type PuzzleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * The data used to create many Puzzles.
     */
    data: PuzzleCreateManyInput | PuzzleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Puzzle update
   */
  export type PuzzleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * The data needed to update a Puzzle.
     */
    data: XOR<PuzzleUpdateInput, PuzzleUncheckedUpdateInput>
    /**
     * Choose, which Puzzle to update.
     */
    where: PuzzleWhereUniqueInput
  }

  /**
   * Puzzle updateMany
   */
  export type PuzzleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Puzzles.
     */
    data: XOR<PuzzleUpdateManyMutationInput, PuzzleUncheckedUpdateManyInput>
    /**
     * Filter which Puzzles to update
     */
    where?: PuzzleWhereInput
    /**
     * Limit how many Puzzles to update.
     */
    limit?: number
  }

  /**
   * Puzzle updateManyAndReturn
   */
  export type PuzzleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * The data used to update Puzzles.
     */
    data: XOR<PuzzleUpdateManyMutationInput, PuzzleUncheckedUpdateManyInput>
    /**
     * Filter which Puzzles to update
     */
    where?: PuzzleWhereInput
    /**
     * Limit how many Puzzles to update.
     */
    limit?: number
  }

  /**
   * Puzzle upsert
   */
  export type PuzzleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * The filter to search for the Puzzle to update in case it exists.
     */
    where: PuzzleWhereUniqueInput
    /**
     * In case the Puzzle found by the `where` argument doesn't exist, create a new Puzzle with this data.
     */
    create: XOR<PuzzleCreateInput, PuzzleUncheckedCreateInput>
    /**
     * In case the Puzzle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PuzzleUpdateInput, PuzzleUncheckedUpdateInput>
  }

  /**
   * Puzzle delete
   */
  export type PuzzleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
    /**
     * Filter which Puzzle to delete.
     */
    where: PuzzleWhereUniqueInput
  }

  /**
   * Puzzle deleteMany
   */
  export type PuzzleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Puzzles to delete
     */
    where?: PuzzleWhereInput
    /**
     * Limit how many Puzzles to delete.
     */
    limit?: number
  }

  /**
   * Puzzle without action
   */
  export type PuzzleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Puzzle
     */
    select?: PuzzleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Puzzle
     */
    omit?: PuzzleOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RepertoireScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    side: 'side',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RepertoireScalarFieldEnum = (typeof RepertoireScalarFieldEnum)[keyof typeof RepertoireScalarFieldEnum]


  export const ChapterScalarFieldEnum: {
    id: 'id',
    repertoireId: 'repertoireId',
    name: 'name',
    eco: 'eco',
    variation: 'variation',
    rootId: 'rootId',
    startFen: 'startFen',
    nodes: 'nodes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChapterScalarFieldEnum = (typeof ChapterScalarFieldEnum)[keyof typeof ChapterScalarFieldEnum]


  export const PlayScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    source: 'source',
    white: 'white',
    black: 'black',
    result: 'result',
    pgn: 'pgn',
    startFen: 'startFen',
    currentFen: 'currentFen',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlayScalarFieldEnum = (typeof PlayScalarFieldEnum)[keyof typeof PlayScalarFieldEnum]


  export const PuzzleScalarFieldEnum: {
    id: 'id',
    seq: 'seq',
    fen: 'fen',
    moves: 'moves',
    rating: 'rating',
    themes: 'themes'
  };

  export type PuzzleScalarFieldEnum = (typeof PuzzleScalarFieldEnum)[keyof typeof PuzzleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    plays?: PlayListRelationFilter
    repertoires?: RepertoireListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    plays?: PlayOrderByRelationAggregateInput
    repertoires?: RepertoireOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    plays?: PlayListRelationFilter
    repertoires?: RepertoireListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RepertoireWhereInput = {
    AND?: RepertoireWhereInput | RepertoireWhereInput[]
    OR?: RepertoireWhereInput[]
    NOT?: RepertoireWhereInput | RepertoireWhereInput[]
    id?: StringFilter<"Repertoire"> | string
    userId?: StringFilter<"Repertoire"> | string
    name?: StringFilter<"Repertoire"> | string
    side?: StringFilter<"Repertoire"> | string
    description?: StringFilter<"Repertoire"> | string
    createdAt?: DateTimeFilter<"Repertoire"> | Date | string
    updatedAt?: DateTimeFilter<"Repertoire"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapters?: ChapterListRelationFilter
  }

  export type RepertoireOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    side?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    chapters?: ChapterOrderByRelationAggregateInput
  }

  export type RepertoireWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RepertoireWhereInput | RepertoireWhereInput[]
    OR?: RepertoireWhereInput[]
    NOT?: RepertoireWhereInput | RepertoireWhereInput[]
    userId?: StringFilter<"Repertoire"> | string
    name?: StringFilter<"Repertoire"> | string
    side?: StringFilter<"Repertoire"> | string
    description?: StringFilter<"Repertoire"> | string
    createdAt?: DateTimeFilter<"Repertoire"> | Date | string
    updatedAt?: DateTimeFilter<"Repertoire"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapters?: ChapterListRelationFilter
  }, "id">

  export type RepertoireOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    side?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RepertoireCountOrderByAggregateInput
    _max?: RepertoireMaxOrderByAggregateInput
    _min?: RepertoireMinOrderByAggregateInput
  }

  export type RepertoireScalarWhereWithAggregatesInput = {
    AND?: RepertoireScalarWhereWithAggregatesInput | RepertoireScalarWhereWithAggregatesInput[]
    OR?: RepertoireScalarWhereWithAggregatesInput[]
    NOT?: RepertoireScalarWhereWithAggregatesInput | RepertoireScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Repertoire"> | string
    userId?: StringWithAggregatesFilter<"Repertoire"> | string
    name?: StringWithAggregatesFilter<"Repertoire"> | string
    side?: StringWithAggregatesFilter<"Repertoire"> | string
    description?: StringWithAggregatesFilter<"Repertoire"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Repertoire"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Repertoire"> | Date | string
  }

  export type ChapterWhereInput = {
    AND?: ChapterWhereInput | ChapterWhereInput[]
    OR?: ChapterWhereInput[]
    NOT?: ChapterWhereInput | ChapterWhereInput[]
    id?: StringFilter<"Chapter"> | string
    repertoireId?: StringFilter<"Chapter"> | string
    name?: StringFilter<"Chapter"> | string
    eco?: StringFilter<"Chapter"> | string
    variation?: StringFilter<"Chapter"> | string
    rootId?: StringFilter<"Chapter"> | string
    startFen?: StringFilter<"Chapter"> | string
    nodes?: JsonFilter<"Chapter">
    createdAt?: DateTimeFilter<"Chapter"> | Date | string
    updatedAt?: DateTimeFilter<"Chapter"> | Date | string
    repertoire?: XOR<RepertoireScalarRelationFilter, RepertoireWhereInput>
  }

  export type ChapterOrderByWithRelationInput = {
    id?: SortOrder
    repertoireId?: SortOrder
    name?: SortOrder
    eco?: SortOrder
    variation?: SortOrder
    rootId?: SortOrder
    startFen?: SortOrder
    nodes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    repertoire?: RepertoireOrderByWithRelationInput
  }

  export type ChapterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChapterWhereInput | ChapterWhereInput[]
    OR?: ChapterWhereInput[]
    NOT?: ChapterWhereInput | ChapterWhereInput[]
    repertoireId?: StringFilter<"Chapter"> | string
    name?: StringFilter<"Chapter"> | string
    eco?: StringFilter<"Chapter"> | string
    variation?: StringFilter<"Chapter"> | string
    rootId?: StringFilter<"Chapter"> | string
    startFen?: StringFilter<"Chapter"> | string
    nodes?: JsonFilter<"Chapter">
    createdAt?: DateTimeFilter<"Chapter"> | Date | string
    updatedAt?: DateTimeFilter<"Chapter"> | Date | string
    repertoire?: XOR<RepertoireScalarRelationFilter, RepertoireWhereInput>
  }, "id">

  export type ChapterOrderByWithAggregationInput = {
    id?: SortOrder
    repertoireId?: SortOrder
    name?: SortOrder
    eco?: SortOrder
    variation?: SortOrder
    rootId?: SortOrder
    startFen?: SortOrder
    nodes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChapterCountOrderByAggregateInput
    _max?: ChapterMaxOrderByAggregateInput
    _min?: ChapterMinOrderByAggregateInput
  }

  export type ChapterScalarWhereWithAggregatesInput = {
    AND?: ChapterScalarWhereWithAggregatesInput | ChapterScalarWhereWithAggregatesInput[]
    OR?: ChapterScalarWhereWithAggregatesInput[]
    NOT?: ChapterScalarWhereWithAggregatesInput | ChapterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Chapter"> | string
    repertoireId?: StringWithAggregatesFilter<"Chapter"> | string
    name?: StringWithAggregatesFilter<"Chapter"> | string
    eco?: StringWithAggregatesFilter<"Chapter"> | string
    variation?: StringWithAggregatesFilter<"Chapter"> | string
    rootId?: StringWithAggregatesFilter<"Chapter"> | string
    startFen?: StringWithAggregatesFilter<"Chapter"> | string
    nodes?: JsonWithAggregatesFilter<"Chapter">
    createdAt?: DateTimeWithAggregatesFilter<"Chapter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Chapter"> | Date | string
  }

  export type PlayWhereInput = {
    AND?: PlayWhereInput | PlayWhereInput[]
    OR?: PlayWhereInput[]
    NOT?: PlayWhereInput | PlayWhereInput[]
    id?: StringFilter<"Play"> | string
    userId?: StringFilter<"Play"> | string
    title?: StringNullableFilter<"Play"> | string | null
    source?: StringFilter<"Play"> | string
    white?: StringNullableFilter<"Play"> | string | null
    black?: StringNullableFilter<"Play"> | string | null
    result?: StringFilter<"Play"> | string
    pgn?: StringFilter<"Play"> | string
    startFen?: StringFilter<"Play"> | string
    currentFen?: StringNullableFilter<"Play"> | string | null
    createdAt?: DateTimeFilter<"Play"> | Date | string
    updatedAt?: DateTimeFilter<"Play"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PlayOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    source?: SortOrder
    white?: SortOrderInput | SortOrder
    black?: SortOrderInput | SortOrder
    result?: SortOrder
    pgn?: SortOrder
    startFen?: SortOrder
    currentFen?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PlayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlayWhereInput | PlayWhereInput[]
    OR?: PlayWhereInput[]
    NOT?: PlayWhereInput | PlayWhereInput[]
    userId?: StringFilter<"Play"> | string
    title?: StringNullableFilter<"Play"> | string | null
    source?: StringFilter<"Play"> | string
    white?: StringNullableFilter<"Play"> | string | null
    black?: StringNullableFilter<"Play"> | string | null
    result?: StringFilter<"Play"> | string
    pgn?: StringFilter<"Play"> | string
    startFen?: StringFilter<"Play"> | string
    currentFen?: StringNullableFilter<"Play"> | string | null
    createdAt?: DateTimeFilter<"Play"> | Date | string
    updatedAt?: DateTimeFilter<"Play"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PlayOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    source?: SortOrder
    white?: SortOrderInput | SortOrder
    black?: SortOrderInput | SortOrder
    result?: SortOrder
    pgn?: SortOrder
    startFen?: SortOrder
    currentFen?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlayCountOrderByAggregateInput
    _max?: PlayMaxOrderByAggregateInput
    _min?: PlayMinOrderByAggregateInput
  }

  export type PlayScalarWhereWithAggregatesInput = {
    AND?: PlayScalarWhereWithAggregatesInput | PlayScalarWhereWithAggregatesInput[]
    OR?: PlayScalarWhereWithAggregatesInput[]
    NOT?: PlayScalarWhereWithAggregatesInput | PlayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Play"> | string
    userId?: StringWithAggregatesFilter<"Play"> | string
    title?: StringNullableWithAggregatesFilter<"Play"> | string | null
    source?: StringWithAggregatesFilter<"Play"> | string
    white?: StringNullableWithAggregatesFilter<"Play"> | string | null
    black?: StringNullableWithAggregatesFilter<"Play"> | string | null
    result?: StringWithAggregatesFilter<"Play"> | string
    pgn?: StringWithAggregatesFilter<"Play"> | string
    startFen?: StringWithAggregatesFilter<"Play"> | string
    currentFen?: StringNullableWithAggregatesFilter<"Play"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Play"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Play"> | Date | string
  }

  export type PuzzleWhereInput = {
    AND?: PuzzleWhereInput | PuzzleWhereInput[]
    OR?: PuzzleWhereInput[]
    NOT?: PuzzleWhereInput | PuzzleWhereInput[]
    id?: StringFilter<"Puzzle"> | string
    seq?: IntFilter<"Puzzle"> | number
    fen?: StringFilter<"Puzzle"> | string
    moves?: StringFilter<"Puzzle"> | string
    rating?: IntFilter<"Puzzle"> | number
    themes?: StringNullableListFilter<"Puzzle">
  }

  export type PuzzleOrderByWithRelationInput = {
    id?: SortOrder
    seq?: SortOrder
    fen?: SortOrder
    moves?: SortOrder
    rating?: SortOrder
    themes?: SortOrder
  }

  export type PuzzleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    seq?: number
    AND?: PuzzleWhereInput | PuzzleWhereInput[]
    OR?: PuzzleWhereInput[]
    NOT?: PuzzleWhereInput | PuzzleWhereInput[]
    fen?: StringFilter<"Puzzle"> | string
    moves?: StringFilter<"Puzzle"> | string
    rating?: IntFilter<"Puzzle"> | number
    themes?: StringNullableListFilter<"Puzzle">
  }, "id" | "seq">

  export type PuzzleOrderByWithAggregationInput = {
    id?: SortOrder
    seq?: SortOrder
    fen?: SortOrder
    moves?: SortOrder
    rating?: SortOrder
    themes?: SortOrder
    _count?: PuzzleCountOrderByAggregateInput
    _avg?: PuzzleAvgOrderByAggregateInput
    _max?: PuzzleMaxOrderByAggregateInput
    _min?: PuzzleMinOrderByAggregateInput
    _sum?: PuzzleSumOrderByAggregateInput
  }

  export type PuzzleScalarWhereWithAggregatesInput = {
    AND?: PuzzleScalarWhereWithAggregatesInput | PuzzleScalarWhereWithAggregatesInput[]
    OR?: PuzzleScalarWhereWithAggregatesInput[]
    NOT?: PuzzleScalarWhereWithAggregatesInput | PuzzleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Puzzle"> | string
    seq?: IntWithAggregatesFilter<"Puzzle"> | number
    fen?: StringWithAggregatesFilter<"Puzzle"> | string
    moves?: StringWithAggregatesFilter<"Puzzle"> | string
    rating?: IntWithAggregatesFilter<"Puzzle"> | number
    themes?: StringNullableListFilter<"Puzzle">
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    plays?: PlayCreateNestedManyWithoutUserInput
    repertoires?: RepertoireCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    plays?: PlayUncheckedCreateNestedManyWithoutUserInput
    repertoires?: RepertoireUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plays?: PlayUpdateManyWithoutUserNestedInput
    repertoires?: RepertoireUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plays?: PlayUncheckedUpdateManyWithoutUserNestedInput
    repertoires?: RepertoireUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepertoireCreateInput = {
    id?: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutRepertoiresInput
    chapters?: ChapterCreateNestedManyWithoutRepertoireInput
  }

  export type RepertoireUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    chapters?: ChapterUncheckedCreateNestedManyWithoutRepertoireInput
  }

  export type RepertoireUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRepertoiresNestedInput
    chapters?: ChapterUpdateManyWithoutRepertoireNestedInput
  }

  export type RepertoireUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUncheckedUpdateManyWithoutRepertoireNestedInput
  }

  export type RepertoireCreateManyInput = {
    id?: string
    userId: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepertoireUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepertoireUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterCreateInput = {
    id?: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    repertoire: RepertoireCreateNestedOneWithoutChaptersInput
  }

  export type ChapterUncheckedCreateInput = {
    id?: string
    repertoireId: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChapterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repertoire?: RepertoireUpdateOneRequiredWithoutChaptersNestedInput
  }

  export type ChapterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repertoireId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterCreateManyInput = {
    id?: string
    repertoireId: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChapterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    repertoireId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayCreateInput = {
    id?: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPlaysInput
  }

  export type PlayUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlaysNestedInput
  }

  export type PlayUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayCreateManyInput = {
    id?: string
    userId: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleCreateInput = {
    id: string
    seq?: number
    fen: string
    moves: string
    rating: number
    themes?: PuzzleCreatethemesInput | string[]
  }

  export type PuzzleUncheckedCreateInput = {
    id: string
    seq?: number
    fen: string
    moves: string
    rating: number
    themes?: PuzzleCreatethemesInput | string[]
  }

  export type PuzzleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    moves?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    themes?: PuzzleUpdatethemesInput | string[]
  }

  export type PuzzleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    fen?: StringFieldUpdateOperationsInput | string
    moves?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    themes?: PuzzleUpdatethemesInput | string[]
  }

  export type PuzzleCreateManyInput = {
    id: string
    seq?: number
    fen: string
    moves: string
    rating: number
    themes?: PuzzleCreatethemesInput | string[]
  }

  export type PuzzleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    moves?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    themes?: PuzzleUpdatethemesInput | string[]
  }

  export type PuzzleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: IntFieldUpdateOperationsInput | number
    fen?: StringFieldUpdateOperationsInput | string
    moves?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    themes?: PuzzleUpdatethemesInput | string[]
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PlayListRelationFilter = {
    every?: PlayWhereInput
    some?: PlayWhereInput
    none?: PlayWhereInput
  }

  export type RepertoireListRelationFilter = {
    every?: RepertoireWhereInput
    some?: RepertoireWhereInput
    none?: RepertoireWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PlayOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RepertoireOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ChapterListRelationFilter = {
    every?: ChapterWhereInput
    some?: ChapterWhereInput
    none?: ChapterWhereInput
  }

  export type ChapterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RepertoireCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    side?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepertoireMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    side?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RepertoireMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    side?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RepertoireScalarRelationFilter = {
    is?: RepertoireWhereInput
    isNot?: RepertoireWhereInput
  }

  export type ChapterCountOrderByAggregateInput = {
    id?: SortOrder
    repertoireId?: SortOrder
    name?: SortOrder
    eco?: SortOrder
    variation?: SortOrder
    rootId?: SortOrder
    startFen?: SortOrder
    nodes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChapterMaxOrderByAggregateInput = {
    id?: SortOrder
    repertoireId?: SortOrder
    name?: SortOrder
    eco?: SortOrder
    variation?: SortOrder
    rootId?: SortOrder
    startFen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChapterMinOrderByAggregateInput = {
    id?: SortOrder
    repertoireId?: SortOrder
    name?: SortOrder
    eco?: SortOrder
    variation?: SortOrder
    rootId?: SortOrder
    startFen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type PlayCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    source?: SortOrder
    white?: SortOrder
    black?: SortOrder
    result?: SortOrder
    pgn?: SortOrder
    startFen?: SortOrder
    currentFen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    source?: SortOrder
    white?: SortOrder
    black?: SortOrder
    result?: SortOrder
    pgn?: SortOrder
    startFen?: SortOrder
    currentFen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    source?: SortOrder
    white?: SortOrder
    black?: SortOrder
    result?: SortOrder
    pgn?: SortOrder
    startFen?: SortOrder
    currentFen?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type PuzzleCountOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    fen?: SortOrder
    moves?: SortOrder
    rating?: SortOrder
    themes?: SortOrder
  }

  export type PuzzleAvgOrderByAggregateInput = {
    seq?: SortOrder
    rating?: SortOrder
  }

  export type PuzzleMaxOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    fen?: SortOrder
    moves?: SortOrder
    rating?: SortOrder
  }

  export type PuzzleMinOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    fen?: SortOrder
    moves?: SortOrder
    rating?: SortOrder
  }

  export type PuzzleSumOrderByAggregateInput = {
    seq?: SortOrder
    rating?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PlayCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput> | PlayCreateWithoutUserInput[] | PlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayCreateOrConnectWithoutUserInput | PlayCreateOrConnectWithoutUserInput[]
    createMany?: PlayCreateManyUserInputEnvelope
    connect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
  }

  export type RepertoireCreateNestedManyWithoutUserInput = {
    create?: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput> | RepertoireCreateWithoutUserInput[] | RepertoireUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RepertoireCreateOrConnectWithoutUserInput | RepertoireCreateOrConnectWithoutUserInput[]
    createMany?: RepertoireCreateManyUserInputEnvelope
    connect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
  }

  export type PlayUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput> | PlayCreateWithoutUserInput[] | PlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayCreateOrConnectWithoutUserInput | PlayCreateOrConnectWithoutUserInput[]
    createMany?: PlayCreateManyUserInputEnvelope
    connect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
  }

  export type RepertoireUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput> | RepertoireCreateWithoutUserInput[] | RepertoireUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RepertoireCreateOrConnectWithoutUserInput | RepertoireCreateOrConnectWithoutUserInput[]
    createMany?: RepertoireCreateManyUserInputEnvelope
    connect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PlayUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput> | PlayCreateWithoutUserInput[] | PlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayCreateOrConnectWithoutUserInput | PlayCreateOrConnectWithoutUserInput[]
    upsert?: PlayUpsertWithWhereUniqueWithoutUserInput | PlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayCreateManyUserInputEnvelope
    set?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    disconnect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    delete?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    connect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    update?: PlayUpdateWithWhereUniqueWithoutUserInput | PlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayUpdateManyWithWhereWithoutUserInput | PlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayScalarWhereInput | PlayScalarWhereInput[]
  }

  export type RepertoireUpdateManyWithoutUserNestedInput = {
    create?: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput> | RepertoireCreateWithoutUserInput[] | RepertoireUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RepertoireCreateOrConnectWithoutUserInput | RepertoireCreateOrConnectWithoutUserInput[]
    upsert?: RepertoireUpsertWithWhereUniqueWithoutUserInput | RepertoireUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RepertoireCreateManyUserInputEnvelope
    set?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    disconnect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    delete?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    connect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    update?: RepertoireUpdateWithWhereUniqueWithoutUserInput | RepertoireUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RepertoireUpdateManyWithWhereWithoutUserInput | RepertoireUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RepertoireScalarWhereInput | RepertoireScalarWhereInput[]
  }

  export type PlayUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput> | PlayCreateWithoutUserInput[] | PlayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayCreateOrConnectWithoutUserInput | PlayCreateOrConnectWithoutUserInput[]
    upsert?: PlayUpsertWithWhereUniqueWithoutUserInput | PlayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayCreateManyUserInputEnvelope
    set?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    disconnect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    delete?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    connect?: PlayWhereUniqueInput | PlayWhereUniqueInput[]
    update?: PlayUpdateWithWhereUniqueWithoutUserInput | PlayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayUpdateManyWithWhereWithoutUserInput | PlayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayScalarWhereInput | PlayScalarWhereInput[]
  }

  export type RepertoireUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput> | RepertoireCreateWithoutUserInput[] | RepertoireUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RepertoireCreateOrConnectWithoutUserInput | RepertoireCreateOrConnectWithoutUserInput[]
    upsert?: RepertoireUpsertWithWhereUniqueWithoutUserInput | RepertoireUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RepertoireCreateManyUserInputEnvelope
    set?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    disconnect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    delete?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    connect?: RepertoireWhereUniqueInput | RepertoireWhereUniqueInput[]
    update?: RepertoireUpdateWithWhereUniqueWithoutUserInput | RepertoireUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RepertoireUpdateManyWithWhereWithoutUserInput | RepertoireUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RepertoireScalarWhereInput | RepertoireScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRepertoiresInput = {
    create?: XOR<UserCreateWithoutRepertoiresInput, UserUncheckedCreateWithoutRepertoiresInput>
    connectOrCreate?: UserCreateOrConnectWithoutRepertoiresInput
    connect?: UserWhereUniqueInput
  }

  export type ChapterCreateNestedManyWithoutRepertoireInput = {
    create?: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput> | ChapterCreateWithoutRepertoireInput[] | ChapterUncheckedCreateWithoutRepertoireInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutRepertoireInput | ChapterCreateOrConnectWithoutRepertoireInput[]
    createMany?: ChapterCreateManyRepertoireInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type ChapterUncheckedCreateNestedManyWithoutRepertoireInput = {
    create?: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput> | ChapterCreateWithoutRepertoireInput[] | ChapterUncheckedCreateWithoutRepertoireInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutRepertoireInput | ChapterCreateOrConnectWithoutRepertoireInput[]
    createMany?: ChapterCreateManyRepertoireInputEnvelope
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutRepertoiresNestedInput = {
    create?: XOR<UserCreateWithoutRepertoiresInput, UserUncheckedCreateWithoutRepertoiresInput>
    connectOrCreate?: UserCreateOrConnectWithoutRepertoiresInput
    upsert?: UserUpsertWithoutRepertoiresInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRepertoiresInput, UserUpdateWithoutRepertoiresInput>, UserUncheckedUpdateWithoutRepertoiresInput>
  }

  export type ChapterUpdateManyWithoutRepertoireNestedInput = {
    create?: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput> | ChapterCreateWithoutRepertoireInput[] | ChapterUncheckedCreateWithoutRepertoireInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutRepertoireInput | ChapterCreateOrConnectWithoutRepertoireInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutRepertoireInput | ChapterUpsertWithWhereUniqueWithoutRepertoireInput[]
    createMany?: ChapterCreateManyRepertoireInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutRepertoireInput | ChapterUpdateWithWhereUniqueWithoutRepertoireInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutRepertoireInput | ChapterUpdateManyWithWhereWithoutRepertoireInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type ChapterUncheckedUpdateManyWithoutRepertoireNestedInput = {
    create?: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput> | ChapterCreateWithoutRepertoireInput[] | ChapterUncheckedCreateWithoutRepertoireInput[]
    connectOrCreate?: ChapterCreateOrConnectWithoutRepertoireInput | ChapterCreateOrConnectWithoutRepertoireInput[]
    upsert?: ChapterUpsertWithWhereUniqueWithoutRepertoireInput | ChapterUpsertWithWhereUniqueWithoutRepertoireInput[]
    createMany?: ChapterCreateManyRepertoireInputEnvelope
    set?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    disconnect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    delete?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    connect?: ChapterWhereUniqueInput | ChapterWhereUniqueInput[]
    update?: ChapterUpdateWithWhereUniqueWithoutRepertoireInput | ChapterUpdateWithWhereUniqueWithoutRepertoireInput[]
    updateMany?: ChapterUpdateManyWithWhereWithoutRepertoireInput | ChapterUpdateManyWithWhereWithoutRepertoireInput[]
    deleteMany?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
  }

  export type RepertoireCreateNestedOneWithoutChaptersInput = {
    create?: XOR<RepertoireCreateWithoutChaptersInput, RepertoireUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: RepertoireCreateOrConnectWithoutChaptersInput
    connect?: RepertoireWhereUniqueInput
  }

  export type RepertoireUpdateOneRequiredWithoutChaptersNestedInput = {
    create?: XOR<RepertoireCreateWithoutChaptersInput, RepertoireUncheckedCreateWithoutChaptersInput>
    connectOrCreate?: RepertoireCreateOrConnectWithoutChaptersInput
    upsert?: RepertoireUpsertWithoutChaptersInput
    connect?: RepertoireWhereUniqueInput
    update?: XOR<XOR<RepertoireUpdateToOneWithWhereWithoutChaptersInput, RepertoireUpdateWithoutChaptersInput>, RepertoireUncheckedUpdateWithoutChaptersInput>
  }

  export type UserCreateNestedOneWithoutPlaysInput = {
    create?: XOR<UserCreateWithoutPlaysInput, UserUncheckedCreateWithoutPlaysInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlaysInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPlaysNestedInput = {
    create?: XOR<UserCreateWithoutPlaysInput, UserUncheckedCreateWithoutPlaysInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlaysInput
    upsert?: UserUpsertWithoutPlaysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlaysInput, UserUpdateWithoutPlaysInput>, UserUncheckedUpdateWithoutPlaysInput>
  }

  export type PuzzleCreatethemesInput = {
    set: string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PuzzleUpdatethemesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PlayCreateWithoutUserInput = {
    id?: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayCreateOrConnectWithoutUserInput = {
    where: PlayWhereUniqueInput
    create: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput>
  }

  export type PlayCreateManyUserInputEnvelope = {
    data: PlayCreateManyUserInput | PlayCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RepertoireCreateWithoutUserInput = {
    id?: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    chapters?: ChapterCreateNestedManyWithoutRepertoireInput
  }

  export type RepertoireUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    chapters?: ChapterUncheckedCreateNestedManyWithoutRepertoireInput
  }

  export type RepertoireCreateOrConnectWithoutUserInput = {
    where: RepertoireWhereUniqueInput
    create: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput>
  }

  export type RepertoireCreateManyUserInputEnvelope = {
    data: RepertoireCreateManyUserInput | RepertoireCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PlayUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayWhereUniqueInput
    update: XOR<PlayUpdateWithoutUserInput, PlayUncheckedUpdateWithoutUserInput>
    create: XOR<PlayCreateWithoutUserInput, PlayUncheckedCreateWithoutUserInput>
  }

  export type PlayUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayWhereUniqueInput
    data: XOR<PlayUpdateWithoutUserInput, PlayUncheckedUpdateWithoutUserInput>
  }

  export type PlayUpdateManyWithWhereWithoutUserInput = {
    where: PlayScalarWhereInput
    data: XOR<PlayUpdateManyMutationInput, PlayUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayScalarWhereInput = {
    AND?: PlayScalarWhereInput | PlayScalarWhereInput[]
    OR?: PlayScalarWhereInput[]
    NOT?: PlayScalarWhereInput | PlayScalarWhereInput[]
    id?: StringFilter<"Play"> | string
    userId?: StringFilter<"Play"> | string
    title?: StringNullableFilter<"Play"> | string | null
    source?: StringFilter<"Play"> | string
    white?: StringNullableFilter<"Play"> | string | null
    black?: StringNullableFilter<"Play"> | string | null
    result?: StringFilter<"Play"> | string
    pgn?: StringFilter<"Play"> | string
    startFen?: StringFilter<"Play"> | string
    currentFen?: StringNullableFilter<"Play"> | string | null
    createdAt?: DateTimeFilter<"Play"> | Date | string
    updatedAt?: DateTimeFilter<"Play"> | Date | string
  }

  export type RepertoireUpsertWithWhereUniqueWithoutUserInput = {
    where: RepertoireWhereUniqueInput
    update: XOR<RepertoireUpdateWithoutUserInput, RepertoireUncheckedUpdateWithoutUserInput>
    create: XOR<RepertoireCreateWithoutUserInput, RepertoireUncheckedCreateWithoutUserInput>
  }

  export type RepertoireUpdateWithWhereUniqueWithoutUserInput = {
    where: RepertoireWhereUniqueInput
    data: XOR<RepertoireUpdateWithoutUserInput, RepertoireUncheckedUpdateWithoutUserInput>
  }

  export type RepertoireUpdateManyWithWhereWithoutUserInput = {
    where: RepertoireScalarWhereInput
    data: XOR<RepertoireUpdateManyMutationInput, RepertoireUncheckedUpdateManyWithoutUserInput>
  }

  export type RepertoireScalarWhereInput = {
    AND?: RepertoireScalarWhereInput | RepertoireScalarWhereInput[]
    OR?: RepertoireScalarWhereInput[]
    NOT?: RepertoireScalarWhereInput | RepertoireScalarWhereInput[]
    id?: StringFilter<"Repertoire"> | string
    userId?: StringFilter<"Repertoire"> | string
    name?: StringFilter<"Repertoire"> | string
    side?: StringFilter<"Repertoire"> | string
    description?: StringFilter<"Repertoire"> | string
    createdAt?: DateTimeFilter<"Repertoire"> | Date | string
    updatedAt?: DateTimeFilter<"Repertoire"> | Date | string
  }

  export type UserCreateWithoutRepertoiresInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    plays?: PlayCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRepertoiresInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    plays?: PlayUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRepertoiresInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRepertoiresInput, UserUncheckedCreateWithoutRepertoiresInput>
  }

  export type ChapterCreateWithoutRepertoireInput = {
    id?: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChapterUncheckedCreateWithoutRepertoireInput = {
    id?: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChapterCreateOrConnectWithoutRepertoireInput = {
    where: ChapterWhereUniqueInput
    create: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput>
  }

  export type ChapterCreateManyRepertoireInputEnvelope = {
    data: ChapterCreateManyRepertoireInput | ChapterCreateManyRepertoireInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRepertoiresInput = {
    update: XOR<UserUpdateWithoutRepertoiresInput, UserUncheckedUpdateWithoutRepertoiresInput>
    create: XOR<UserCreateWithoutRepertoiresInput, UserUncheckedCreateWithoutRepertoiresInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRepertoiresInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRepertoiresInput, UserUncheckedUpdateWithoutRepertoiresInput>
  }

  export type UserUpdateWithoutRepertoiresInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plays?: PlayUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRepertoiresInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plays?: PlayUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChapterUpsertWithWhereUniqueWithoutRepertoireInput = {
    where: ChapterWhereUniqueInput
    update: XOR<ChapterUpdateWithoutRepertoireInput, ChapterUncheckedUpdateWithoutRepertoireInput>
    create: XOR<ChapterCreateWithoutRepertoireInput, ChapterUncheckedCreateWithoutRepertoireInput>
  }

  export type ChapterUpdateWithWhereUniqueWithoutRepertoireInput = {
    where: ChapterWhereUniqueInput
    data: XOR<ChapterUpdateWithoutRepertoireInput, ChapterUncheckedUpdateWithoutRepertoireInput>
  }

  export type ChapterUpdateManyWithWhereWithoutRepertoireInput = {
    where: ChapterScalarWhereInput
    data: XOR<ChapterUpdateManyMutationInput, ChapterUncheckedUpdateManyWithoutRepertoireInput>
  }

  export type ChapterScalarWhereInput = {
    AND?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
    OR?: ChapterScalarWhereInput[]
    NOT?: ChapterScalarWhereInput | ChapterScalarWhereInput[]
    id?: StringFilter<"Chapter"> | string
    repertoireId?: StringFilter<"Chapter"> | string
    name?: StringFilter<"Chapter"> | string
    eco?: StringFilter<"Chapter"> | string
    variation?: StringFilter<"Chapter"> | string
    rootId?: StringFilter<"Chapter"> | string
    startFen?: StringFilter<"Chapter"> | string
    nodes?: JsonFilter<"Chapter">
    createdAt?: DateTimeFilter<"Chapter"> | Date | string
    updatedAt?: DateTimeFilter<"Chapter"> | Date | string
  }

  export type RepertoireCreateWithoutChaptersInput = {
    id?: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutRepertoiresInput
  }

  export type RepertoireUncheckedCreateWithoutChaptersInput = {
    id?: string
    userId: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepertoireCreateOrConnectWithoutChaptersInput = {
    where: RepertoireWhereUniqueInput
    create: XOR<RepertoireCreateWithoutChaptersInput, RepertoireUncheckedCreateWithoutChaptersInput>
  }

  export type RepertoireUpsertWithoutChaptersInput = {
    update: XOR<RepertoireUpdateWithoutChaptersInput, RepertoireUncheckedUpdateWithoutChaptersInput>
    create: XOR<RepertoireCreateWithoutChaptersInput, RepertoireUncheckedCreateWithoutChaptersInput>
    where?: RepertoireWhereInput
  }

  export type RepertoireUpdateToOneWithWhereWithoutChaptersInput = {
    where?: RepertoireWhereInput
    data: XOR<RepertoireUpdateWithoutChaptersInput, RepertoireUncheckedUpdateWithoutChaptersInput>
  }

  export type RepertoireUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRepertoiresNestedInput
  }

  export type RepertoireUncheckedUpdateWithoutChaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutPlaysInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    repertoires?: RepertoireCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlaysInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    repertoires?: RepertoireUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlaysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlaysInput, UserUncheckedCreateWithoutPlaysInput>
  }

  export type UserUpsertWithoutPlaysInput = {
    update: XOR<UserUpdateWithoutPlaysInput, UserUncheckedUpdateWithoutPlaysInput>
    create: XOR<UserCreateWithoutPlaysInput, UserUncheckedCreateWithoutPlaysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlaysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlaysInput, UserUncheckedUpdateWithoutPlaysInput>
  }

  export type UserUpdateWithoutPlaysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repertoires?: RepertoireUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlaysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repertoires?: RepertoireUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PlayCreateManyUserInput = {
    id?: string
    title?: string | null
    source?: string
    white?: string | null
    black?: string | null
    result?: string
    pgn?: string
    startFen?: string
    currentFen?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RepertoireCreateManyUserInput = {
    id?: string
    name: string
    side: string
    description?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    white?: NullableStringFieldUpdateOperationsInput | string | null
    black?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    currentFen?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RepertoireUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUpdateManyWithoutRepertoireNestedInput
  }

  export type RepertoireUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chapters?: ChapterUncheckedUpdateManyWithoutRepertoireNestedInput
  }

  export type RepertoireUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    side?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterCreateManyRepertoireInput = {
    id?: string
    name: string
    eco?: string
    variation?: string
    rootId: string
    startFen: string
    nodes: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChapterUpdateWithoutRepertoireInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterUncheckedUpdateWithoutRepertoireInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChapterUncheckedUpdateManyWithoutRepertoireInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eco?: StringFieldUpdateOperationsInput | string
    variation?: StringFieldUpdateOperationsInput | string
    rootId?: StringFieldUpdateOperationsInput | string
    startFen?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}