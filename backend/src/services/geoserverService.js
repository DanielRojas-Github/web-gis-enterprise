import {
  env,
} from "../config/env.js";


const GEOSERVER_WORKSPACE =
  "webgis";

const GEOSERVER_DATASTORE =
  "webgis_postgis";

const GEOSERVER_DB_HOST =
  "postgres";

const GEOSERVER_DB_PORT =
  "5432";

const GEOSERVER_SRS =
  "EPSG:4326";


class GeoServerService {

  getAuthHeaders() {

    const credentials =
      `${env.geoserver.user}:${env.geoserver.password}`;

    const encodedCredentials =
      Buffer
        .from(credentials)
        .toString("base64");

    return {
      Authorization:
        `Basic ${encodedCredentials}`,
    };

  }


  async checkConnection() {

    const url =
      `${env.geoserver.url}/ows?service=WMS&request=GetCapabilities`;

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `GeoServer connection failed: ${response.status}`
      );

    }

    return {
      success: true,
      status: response.status,
    };

  }


  async getWorkspaces() {

    const url =
      `${env.geoserver.url}/rest/workspaces.json`;

    const response =
      await fetch(
        url,
        {
          headers:
            this.getAuthHeaders(),
        }
      );

    if (!response.ok) {

      throw new Error(
        `GeoServer REST authentication failed: ${response.status}`
      );

    }

    return response.json();

  }


  async createWorkspace(
    name
  ) {

    const url =
      `${env.geoserver.url}/rest/workspaces`;

    const response =
      await fetch(
        url,
        {
          method:
            "POST",

          headers: {
            ...this.getAuthHeaders(),

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              workspace: {
                name,
              },
            }),
        }
      );

    if (!response.ok) {

      throw new Error(
        `GeoServer workspace creation failed: ${response.status}`
      );

    }

    return {
      success: true,
      status:
        response.status,
      location:
        response.headers.get(
          "location"
        ),
    };

  }


  async createPostGISDataStore() {

    const url =
      `${env.geoserver.url}/rest/workspaces/${GEOSERVER_WORKSPACE}/datastores`;

    const response =
      await fetch(
        url,
        {
          method:
            "POST",

          headers: {
            ...this.getAuthHeaders(),

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              dataStore: {

                name:
                  GEOSERVER_DATASTORE,

                connectionParameters: {

                  host:
                    GEOSERVER_DB_HOST,

                  port:
                    GEOSERVER_DB_PORT,

                  database:
                    env.db.name,

                  user:
                    env.db.user,

                  passwd:
                    env.db.password,

                  dbtype:
                    "postgis",

                },

              },
            }),
        }
      );

    if (!response.ok) {

      throw new Error(
        `GeoServer datastore creation failed: ${response.status}`
      );

    }

    return {
      success: true,
      status:
        response.status,
      location:
        response.headers.get(
          "location"
        ),
    };

  }


  async publishLayer({
    name,
    title,
  }) {

    const url =
      `${env.geoserver.url}/rest/workspaces/${GEOSERVER_WORKSPACE}/datastores/${GEOSERVER_DATASTORE}/featuretypes`;

    const response =
      await fetch(
        url,
        {
          method:
            "POST",

          headers: {
            ...this.getAuthHeaders(),

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              featureType: {

                name,

                nativeName:
                  name,

                title,

                srs:
                  GEOSERVER_SRS,

                enabled:
                  true,

              },
            }),
        }
      );

    if (!response.ok) {

      throw new Error(
        `GeoServer layer publication failed: ${response.status}`
      );

    }

    return {
      success: true,
      status:
        response.status,
      location:
        response.headers.get(
          "location"
        ),
    };

  }


  async publishRoadsLayer() {

    return this.publishLayer({
      name:
        "roads",

      title:
        "Roads",
    });

  }


  async publishBuildingsLayer() {

    return this.publishLayer({
      name:
        "buildings",

      title:
        "Buildings",
    });

  }


  async getFeatures(
    typeName
  ) {

    const params =
      new URLSearchParams({
        service:
          "WFS",

        version:
          "2.0.0",

        request:
          "GetFeature",

        typeNames:
          `${GEOSERVER_WORKSPACE}:${typeName}`,

        outputFormat:
          "application/json",
      });

    const url =
      `${env.geoserver.url}/${GEOSERVER_WORKSPACE}/ows?${params.toString()}`;

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `GeoServer WFS request failed: ${response.status}`
      );

    }

    return response.json();

  }

}


export const geoserverService =
  new GeoServerService();