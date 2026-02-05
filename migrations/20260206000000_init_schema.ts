import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hr_users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('age').notNullable();
    table.string('designation').notNullable();
    table.date('hiring_date').notNullable();
    table.date('date_of_birth').notNullable();
    table.decimal('salary', 12, 2).notNullable();
    table.string('photo_path').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary();
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE');
    table.date('date').notNullable();
    table.timestamp('check_in_time', { useTz: false }).notNullable();
    table.unique(['employee_id', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('attendance');
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.dropTableIfExists('hr_users');
}
