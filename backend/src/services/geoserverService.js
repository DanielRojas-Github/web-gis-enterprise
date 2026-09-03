import {
  env,
} from "../config/env.js";

import {
  GeoServerError,
} from "../errors/GeoServerError.js";

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
    typeName,
    options = {}
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

        srsName:
          GEOSERVER_SRS,
      });


    if (
      options.bbox
    ) {

      params.set(
        "bbox",
        `${options.bbox},${GEOSERVER_SRS}`
      );

    }


    if (
      options.count !== undefined
    ) {

      params.set(
        "count",
        String(
          options.count
        )
      );

    }


    if (
      options.startIndex !== undefined
    ) {

      params.set(
        "startIndex",
        String(
          options.startIndex
        )
      );

    }


    if (
      options.sortBy
    ) {

      params.set(
        "sortBy",
        options.sortBy
      );

    }


    if (
      options.propertyName
    ) {

      params.set(
        "propertyName",
        options.propertyName
      );

    }

    if (
      options.cqlFilter
    ) {

      params.set(
        "CQL_FILTER",
        options.cqlFilter
      );

    }


    const url =
      `${env.geoserver.url}/${GEOSERVER_WORKSPACE}/ows?${params.toString()}`;

   const controller =
  new AbortController();

const timeout =
  setTimeout(
    () => {

      controller.abort();

    },
    env.geoserver.timeout
  );


    let response;


    try {

      response =
        await fetch(
          url,
          {
            signal:
              controller.signal,
          }
        );

    } catch (error) {

      if (
        error.name ===
        "AbortError"
      ) {

        throw new GeoServerError({
          message:
            "GeoServer request timed out",
          statusCode:
            504,
          code:
            "GEOSERVER_TIMEOUT",
        });

      }


      throw new GeoServerError({
        message:
          "GeoServer is unavailable",
        statusCode:
          503,
        code:
          "GEOSERVER_UNAVAILABLE",
      });

    } finally {

      clearTimeout(
        timeout
      );

    }

    if (!response.ok) {

      throw new GeoServerError({
        message:
          `GeoServer WFS request failed: ${response.status}`,
        statusCode:
          502,
        code:
          "GEOSERVER_WFS_ERROR",
      });

    }


    try {

      return await response.json();

    } catch (error) {

      throw new GeoServerError({
        message:
          "GeoServer returned an invalid WFS response",
        statusCode:
          502,
        code:
          "GEOSERVER_INVALID_RESPONSE",
      });

    }


    return response.json();

  }
}


export const geoserverService =
  new GeoServerService();