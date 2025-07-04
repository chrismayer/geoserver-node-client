import fetch from 'node-fetch';
import { getGeoServerResponseText, GeoServerResponseError } from './util/geoserver.js';
import AboutClient from './about.js';

/**
 * Client for GeoServer layergroups
 *
 * @module LayerGroupClient
 */
export default class LayerGroupClient {
  /**
   * Creates a GeoServer REST LayerGroupClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  constructor(url, auth) {
    this.url = url;
    this.auth = auth;
  }

  /**
   * @typedef {object} bounds
   * @property {number} minx The minimum x coordinates. Default: -180
   * @property {number} miny The minimum y coordinates. Default: -90
   * @property {number} maxx The maximum x coordinates. Default: 180
   * @property {number} maxy The maximum y coordinates. Default: 90
   * @property {String} crs The crs of the bounds. Default: 'EPSG:4326'
   */

  /**
   * Create a GeoServer layergroup by the given workspace, layerGroupName, layers and options
   * @param {String} workspace The name of the workspace
   * @param {String} layerGroupName The name of the layer group
   * @param {Array.<String>} layers List of layers to be added to the group. Must be in same workspace as layergroup
   * @param {String} options.mode The mode of the layergroup. Default to SINGLE
   * @param {String} options.layerGroupTitle The title of the layergroup.
   * @param {bounds} options.bounds The bounds of the layer group.
   *
   * @throws Error if request fails
   *
   * @returns {string} A string with layer group location or undefined if not found
   */
  async create(workspace, layerGroupName, layers, layerGroupOptions) {
    const options = {
      mode: 'SINGLE',
      layerGroupTitle: '',
      abstractTxt: '',
      bounds: {
        minx: -180,
        maxx: -90,
        miny: 180,
        maxy: 90,
        crs: 'EPSG:4326'
      },
      ...layerGroupOptions
    };
    const publishedLayers = [];
    const styles = [];
    for (const l of layers) {
      publishedLayers.push({
        '@type': 'layer',
        name: `${workspace}:${l}`,
        href: `${this.url}/workspaces/${workspace}/layers/${l}.json`
      });
      // use default style by define empty string
      styles.push('');
    }
    const body = {
      layerGroup: {
        name: layerGroupName,
        workspace: {
          name: workspace
        },
        publishables: {
          published: publishedLayers
        },
        styles: {
          style: styles
        },
        ...options
      }
    };
    const response = await fetch(`${this.url}/workspaces/${workspace}/layergroups`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const grc = new AboutClient(this.url, this.auth);
      if (await grc.exists()) {
        // GeoServer exists, but requested item does not exist, we return empty
        return;
      } else {
        // There was a general problem with GeoServer
        const geoServerResponse = await getGeoServerResponseText(response);
        throw new GeoServerResponseError(null, geoServerResponse);
      }
    }
    // get resource location from response header
    const location = response.headers.get('location');

    // return resource location
    return location;
  }

  /**
   * Returns a GeoServer layergroup by the given workspace and layergroup name,
   * e.g. "myWs:myLayergroup".
   *
   * @param {String} workspace The name of the workspace
   * @param {String} layerGroupName The name of the layer group to query
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object with layer group information or undefined if it cannot be found
   */
  async get(workspace, layerGroupName) {
    const response = await fetch(
      `${this.url}/workspaces/${workspace}/layergroups/${layerGroupName}.json`,
      {
        credentials: 'include',
        method: 'GET',
        headers: {
          Authorization: this.auth
        }
      }
    );

    if (!response.ok) {
      const grc = new AboutClient(this.url, this.auth);
      if (await grc.exists()) {
        // GeoServer exists, but requested item does not exist,  we return empty
        return;
      } else {
        // There was a general problem with GeoServer
        const geoServerResponse = await getGeoServerResponseText(response);
        throw new GeoServerResponseError(null, geoServerResponse);
      }
    }
    return response.json();
  }

  /**
   * Updates an existing GeoServer layergroup
   *
   * @param {String} workspace The name of the workspace
   * @param {String} layerName The name of the layergroup to update
   * @param {Object} layerGroupDefinition The updated definiton of the layergroup
   *
   * @throws Error if request fails
   */
  async update(workspace, layerGroupName, layerGroupDefinition) {
    const url = `${this.url}/workspaces/${workspace}/layergroups/${layerGroupName}.json`;
    const response = await fetch(url, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(layerGroupDefinition)
    });

    if (!response.ok) {
      const geoServerResponse = await getGeoServerResponseText(response);
      throw new GeoServerResponseError(null, geoServerResponse);
    }
  }
}
