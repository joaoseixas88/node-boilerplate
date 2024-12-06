import Database from "@/Database";
import { Mapper } from "@/Helpers/Mapper";
import { Knex } from "knex";


export abstract class BaseRepository<Model extends object = any> {
  constructor(
    private readonly tableName: string,
    private readonly idColumnName: string,
  ) {}

  query(dbParams?: { trx?: Knex.Transaction }) {
    const transaction = dbParams?.trx ? dbParams.trx : Database
    return transaction.from<Model>(this.tableName);
  }

  async create(
    model: Partial<Model>,
    trx?: Knex.Transaction,
  ): Promise<Model[]> {
    const transaction = trx ? trx : Database;
    const createdValue = await transaction(this.tableName)
      .insert(model)
      .returning<Model>('*');

    return createdValue;
  }

  async updateById(
    id: number,
    model: Partial<Model>,
    trx?: Knex.Transaction,
  ): Promise<Model> {
    const transaction = trx ? trx : Database;
    await transaction
      .from(this.tableName)
      .where(this.idColumnName, id)
      .update(model);
    return this.findById(id, trx);
  }

  /**
   * @method update
   * @description Updates records in the database based on specified conditions.
   * @param {{ where: Partial<Model>, payload: Partial<Model> }} params - An object containing the `where` clause to filter records and the `payload` with updated fields.
   * @param {Knex.Transaction} [trx] - Optional Knex transaction to be used during the update.
   * @returns {Promise<void>} Does not return a value.
   */
  async update(
    {
      payload,
      where: query,
    }: {
      where: Partial<Model>;
      payload: Partial<Model>;
    },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const transaction = trx ? trx : Database;
    await transaction.from(this.tableName).where(query).update(payload);
  }

  /**
   * @method findById
   * @description Finds a record in the database by its ID.
   * @param {number} id - The ID of the record to retrieve.
   * @param {Knex.Transaction} [trx] - Optional Knex transaction to be used during the query.
   * @returns {Promise<Model>} - Returns the found model record.
   */
  async findById(id: number, trx?: Knex.Transaction): Promise<Model> {
    const transaction = trx ? trx : Database;
    const result = await transaction
      .from(this.tableName)
      .where(this.idColumnName, id);
    return result[0];
  }

  /**
   * @method findOne
   * @description Finds the first record in the database that matches the provided query.
   * @param {Partial<Model>} model - A partial model object representing the search conditions.
   * @param {Knex.Transaction} [trx] - Optional Knex transaction to be used during the query.
   * @returns {Promise<Model>} Returns the found model record, or undefined if no record is found.
   */
  async findOne(model: Partial<Model>, trx?: Knex.Transaction): Promise<Model> {
    const transaction = trx ? trx : Database;
    const result = transaction.from(this.tableName).where(model).first();
    return result;
  }

  /**
   * @method findMany
   * @description Finds multiple records in the database that match the provided query. If no query is provided, returns all records.
   * @param {Partial<Model>} [model] - An optional partial model object representing the search conditions.
   * @param {Knex.Transaction} [trx] - Optional Knex transaction to be used during the query.
   * @returns {Promise<Model[]>} Returns an array of matching model records or empty array of none is found.
   */
  async findMany(
    model?: Partial<Model>,
    trx?: Knex.Transaction,
  ): Promise<Model[]> {
    const transaction = trx ? trx : Database;
    const cleanedObject = Mapper.clearNullOrUndefinedKeys(model);
    const result = transaction.from(this.tableName);
    if (cleanedObject) {
      result.where(cleanedObject);
    }
    return await result;
  }
}
