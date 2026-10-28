CREATE TABLE IF NOT EXISTS public_facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  facility_type VARCHAR(40) NOT NULL CHECK (
    facility_type IN (
      'school',
      'health_center',
      'municipal_office',
      'community_center',
      'sports_center',
      'library',
      'other'
    )
  ),
  status VARCHAR(24) NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'inactive', 'under_maintenance')
  ),
  managing_department VARCHAR(120),
  geom geometry(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS public_facilities_geom_gix
ON public_facilities
USING GIST (geom);
