import "knex";
declare module "knex" {
  namespace Knex {
    interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      if(
        condition: boolean,
        callback: (query: Knex.QueryBuilder<TRecord, TResult>) => void
      ): Knex.QueryBuilder<TRecord, TResult>;
      findByColumnLikeInsensitive(
        columnName: keyof TRecord,
        value: string | undefined | null
      ): Knex.QueryBuilder<TRecord, TResult>;
    }
  }
}
