# GeoServer Node Client

Node.js / JavaScript Client for the [GeoServer REST API](https://docs.geoserver.org/stable/en/user/rest/).

**CAUTION: This is highly bleeding edge, heavily under development and therefore breaking changes can be made at every time!**

### API-Docs ###

Detailed API-Docs can be found [here](https://meggsimum.github.io/geoserver-node-client/index.html).

### Meta information

Compatible with [GeoServer](https://geoserver.org)

  - v2.19.x
  - v2.18.x
  - v2.17.x (no more maintained and officially deprecated)

### Setup

Run as local checkout (mainly for development purposes)

```shell
git clone https://github.com/meggsimum/geoserver-node-client

cd geoserver-node-client

npm install

npm run demo
```


### Unit Tests

First start a GeoServer, e.g. by using this Docker container:

```shell
docker run \
  -p 8080:8080 \
  -v /path/to/geoserver_mnt:/opt/geoserver_data \
  meggsimum/geoserver:2.18.2
```

Then, in an other terminal, run:

```shell
npm run test
```

### Who do I talk to? ###

* meggsimum (Christian Mayer) - info __at## meggsimum ~~dot** de

### Credits

This project was initiated by [meggsimum](https://meggsimum.de) within the [mFund](https://www.bmvi.de/EN/Topics/Digital-Matters/mFund/mFund.html) research project [SAUBER](https://sauber-projekt.de/).
<p><img src="https://sauber-projekt.de/wp-content/uploads/2018/12/SAG_SAUBER_Logo_Dez3_transparent-1-e1543843688935.png" alt="SAUBER Logo" width="200"/></p>.

<img src="https://sauber-projekt.de/wp-content/uploads/2018/12/mfund-logo-download-e1547545420815-300x77.jpg" alt="mFund Logo" width="300"/>
<img src="https://sauber-projekt.de/wp-content/uploads/2019/06/BMVI_Fz_2017_Office_Farbe_de_Bundestag-400x402.png" alt="BMVI Logo" height="200"/>
