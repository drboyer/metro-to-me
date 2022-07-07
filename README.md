# metro2.me

WORK IN PROGRESS

Website to show walkability from every Washington Metro station

## Development

This is primarily a Vue.js based webpage. It uses YARN for package management.

To stand up a local copy of the website, clone the repo, run `yarn install`, then run `yarn serve`.

### References

I used [@bfreeds' mapbox-vue-example repo](https://github.com/bfreeds/mapbox-vue-example) as heavy influence for how to set up this project. :bow:

### Configuration

To run the backend services, you'll need to set these two environment variables:

* `WMATA_API_KEY`
* `MAPBOX_ACCESS_TOKEN`