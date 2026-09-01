CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  geom geometry(Polygon, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS buildings_geom_gix
ON buildings
USING GIST (geom);
