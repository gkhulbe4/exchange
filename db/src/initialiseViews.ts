import { pool } from "./db";

export async function initialiseViews() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);

  await pool.query(`
    DROP MATERIALIZED VIEW IF EXISTS klines_1m CASCADE;
    DROP MATERIALIZED VIEW IF EXISTS klines_15m CASCADE;
    DROP MATERIALIZED VIEW IF EXISTS klines_30m CASCADE;
    DROP MATERIALIZED VIEW IF EXISTS klines_1h CASCADE;
    DROP MATERIALIZED VIEW IF EXISTS klines_1d CASCADE;
  `);

  await pool.query(`
    DROP TABLE IF EXISTS trades CASCADE;
  `);

  // i should create an index on market
  await pool.query(`
        CREATE TABLE trades (
            id            BIGSERIAL,        
            trade_time    TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
            buyer_id      VARCHAR(20),        
            seller_id     VARCHAR(20),      
            side          VARCHAR(4) NOT NULL,        
            price         NUMERIC(20, 8) NOT NULL,  
            quantity      NUMERIC(20, 8) NOT NULL,
            volume        NUMERIC(38, 16) GENERATED ALWAYS AS (price * quantity) STORED,
            market        VARCHAR(10) NOT NULL, 
            PRIMARY KEY   (id, trade_time) 
        );
        SELECT create_hypertable('trades', 'trade_time');
  `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 minute', trade_time) AS bucket,
        first(price, trade_time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, trade_time) AS close,
        sum(volume) AS volume,
        market
    FROM trades
    GROUP BY bucket, market;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_15m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('15 minutes', trade_time) AS bucket,
        first(price, trade_time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, trade_time) AS close,
        sum(volume) AS volume,
        market
    FROM trades
    GROUP BY bucket, market;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_30m
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('30 minutes', trade_time) AS bucket,
        first(price, trade_time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, trade_time) AS close,
        sum(volume) AS volume,
        market
    FROM trades
    GROUP BY bucket, market;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1h
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 hour', trade_time) AS bucket,
        first(price, trade_time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, trade_time) AS close,
        sum(volume) AS volume,
        market
    FROM trades
    GROUP BY bucket, market;
    `);

  await pool.query(`CREATE MATERIALIZED VIEW klines_1d
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 day', trade_time) AS bucket,
        first(price, trade_time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, trade_time) AS close,
        sum(volume) AS volume,
        market
    FROM trades
    GROUP BY bucket, market;
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
