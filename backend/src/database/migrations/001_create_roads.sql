CREATE TABLE IF NOT EXISTS roads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  geom geometry(LineString, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS roads_geom_gix
ON roads
USING GIST (geom);