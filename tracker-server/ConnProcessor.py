import datetime
import logging
import socket
import threading

import requests


log = logging.getLogger("main")


class ConnProcessor(threading.Thread):
    """ A Thread is created with every incoming connection """
    id = None

    def __init__(self, client, addr):
        threading.Thread.__init__(self)
        self.client = client
        self.addr = addr
        self.should_terminate = False

    def run(self):
        log.debug(">>>Connection from {}:{}".format(self.addr[0], self.addr[1]))
        self.client.settimeout(120)

        while True:
            if self.should_terminate:
                break

            try:
                data = self.client.recv(1024)
            except socket.timeout:
                if self.id:
                    self.send_message("({}AP01HSO)".format(self.id))
            else:
                if data:
                    self.process_message(data.decode('ascii'))
                else:
                    print("no msg!")
                    break

        log.debug(">>>finished", flush=True)
        self.client.close()

    def process_message(self, msg):
        location = self.parse_location(msg)
        if not location:
            pass

        tracker_id, longitude, latitude, speed = location
        response = requests.post('backend:8000/api/locations/', {
            'tracker_id': tracker_id,
            'speed': speed,
            'point': f'POINT({latitude} {longitude})'
        })

        if not response.status_code == 201:
            log.error(f"Location post failed on backend, err {response.status_code}")
            log.error(response.data)
            pass

    def send_message(self, msg):
        log.debug("[{}] sending: {}".format(datetime.datetime.now(), msg))
        self.client.sendall(bytes(msg, 'ascii'))

    def parse_location(self, msg):
        log.debug(f'Got message: {msg}')
        msg = msg.split(",")
        if "N" not in msg or "E" not in msg or "A" not in msg:
            log.error("No coordinates found from revieced message")
            return

        try:
            latitude = float(msg[4])
            longitude = float(msg[6])
            speed = float(msg[8])
        except ValueError:
            log.error("Invalid coordinates or speed (not a number)s")
            return

        tracker_id = msg[0].split("*")[1]
        latitude_ind = msg[5]
        longitude_ind = msg[7]

        if latitude_ind != "N":
            latitude = - latitude

        if longitude_ind != "E":
            longitude = - longitude

        return (tracker_id, longitude, latitude, speed)
