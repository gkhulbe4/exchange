import { pool } from "./db";

export async function initialiseViews() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);

  await pool.query(`
        DROP TABLE IF EXISTS "tata_prices";
        CREATE TABLE "tata_prices"(
            time            TIMESTAMPTZ(6) NOT NULL,
            price   DOUBLE PRECISION,
            volume      DOUBLE PRECISION,
            currency_code   VARCHAR (10)
        );
        
        SELECT create_hypertable('tata_prices', 'time');
    `);

  await pool.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1m;`);
  await pool.query(`DROP MATERIALIZED VIEW IF EXISTS klines_15m;`);
  await pool.query(`DROP MATERIALIZED VIEW IF EXISTS klines_30m;`);
  await pool.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1h;`);
  await pool.query(`DROP MATERIALIZED VIEW IF EXISTS klines_1d;`);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 minute', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM tata_prices
    GROUP BY bucket, currency_code;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_15m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('15 minutes', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM tata_prices
    GROUP BY bucket, currency_code;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_30m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('30 minutes', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM tata_prices
    GROUP BY bucket, currency_code;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1h
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 hour', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM tata_prices
    GROUP BY bucket, currency_code;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1d
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 day', time) AS bucket,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(volume) AS volume,
        currency_code
    FROM tata_prices
    GROUP BY bucket, currency_code;
    `);

  await pool.query(`
    SELECT add_continuous_aggregate_policy('klines_1m',
        start_offset => INTERVAL '1 day',
        end_offset   => INTERVAL '1 minute',
        schedule_interval => INTERVAL '1 minute');

    SELECT add_continuous_aggregate_policy('klines_15m',
        start_offset => INTERVAL '7 days',
        end_offset   => INTERVAL '15 minutes',
        schedule_interval => INTERVAL '15 minutes');

    SELECT add_continuous_aggregate_policy('klines_30m',
        start_offset => INTERVAL '14 days',
        end_offset   => INTERVAL '30 minutes',
        schedule_interval => INTERVAL '30 minutes');

    SELECT add_continuous_aggregate_policy('klines_1h',
        start_offset => INTERVAL '30 days',
        end_offset   => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');

    SELECT add_continuous_aggregate_policy('klines_1d',
        start_offset => INTERVAL '365 days',
        end_offset   => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 day');
    `);
}
