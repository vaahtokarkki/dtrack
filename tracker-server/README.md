# Simple server for H02 GPS Protocol

Based on [TK102-2 Server](https://github.com/marck0z/gps_tk102-2), currently only [TKSTAR TK909](https://www.aliexpress.com/popular/tkstar-tk909.html) tracker is supported. This is just a simple server to receive messages from tracker, save and forward those to the backend server.

## Installation
Create file `config.txt` where is stored following parameters:

```
[server]
host = 0.0.0.0
port = 5001

[backend]
url = http://backend:8000
```

On server section host and port is where server will be listening for incoming connections. Backend url is where received locations are posted, with a tracker id.


## Usage
When a message is received from a tracker, we try to parse the tracker id, location and speed from it. If all found and valid, send the data to backend using endpoint `/api/locations/`.

**Note**: You have to have a device with same tracker id on backend, see backend configuration for creating a device with tracker id. You can find out the deivces tracker id from logs of this server.