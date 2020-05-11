# Dog tracker frontend
Here is located the frontend for Dog Tracker. Built with React, Redux and apisauce.

## Installation
Currently frontend can be run only with provided docker-compose. See backend documentation for first run.

Rename `.env.example` to `.env` and add backend url (without _/api_). On provided docker-compose configuration the default value for local development is `https://localhost`. If you want to use Sentry, add `REACT_APP_SENTRY_DSN` with your Sentry DSN value.

## App structure

This app layout is built mainly with [Bootsrap](https://react-bootstrap.github.io/) on top of [Leaflet](https://leafletjs.com/) map. Some minor components (including icons) are used from [Material UI](https://material-ui.com/).

### Api
Api access is implemented with [apisauce](https://github.com/infinitered/apisauce). Api requests can be done with api instance from utils:
```JavaScript
import api from 'utils/api'

async () => {
    const resp = await api.get("/devices/")
    if (!resp.ok)
        return // Handle the error
    // Do something with the response
}
```

### Redux stores

This app has six different Redux stores:
* **Map state**, state of map (position and zoom) and couple actions to manipulate the map.
* **Settings state**, state of application, including to which device to keep the map centered, menu state etc. _TODO: Combine this with map state?_
* **User state**, state of user details, including tokens for api access.
* **Notifications state**, state of notification. For example if user denies geolocation, a notification is displayed.
* **Devices state**, state of devices displayed on map (including user location). When new locations is polled from api, the location are stored to this state.
* **Tracks state**, state of saved tracks (fetched from api). A track contains list of locations and some metadata of track. All tracks contains also data is track currently visible on map.

### CSS Styles

All styles are implemented with [Sass](https://sass-lang.com/). Styles are located in `src/styles/`. Main colors can be imported from `src/styles/Colors.scss`.

## Built with
* React
* Redux and rexud thunk
* Apisauce
* [Leaflet](https://leafletjs.com/)
* Bootstrap
* Material UI
* [SASS](https://sass-lang.com/)