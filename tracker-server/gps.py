#!/usr/bin/python

import configparser
import logging
import socket
import threading

from ConnProcessor import ConnProcessor


# Read config
config = configparser.ConfigParser()
config.read("config.txt")

# Setup logger
logger = logging.getLogger("main")
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s',
                              datefmt='%d.%m.%y %H:%M')
console = logging.StreamHandler()
console.setFormatter(formatter)
file_handler_error = logging.FileHandler('./logs/tracker.error.log', mode="a")
file_handler_error.setFormatter(formatter)
file_handler_error.setLevel(logging.ERROR)
file_handler_debug = logging.FileHandler('./logs/tracker.debug.log', mode="a")
file_handler_debug.setFormatter(formatter)
file_handler_debug.setLevel(logging.DEBUG)

logger.addHandler(file_handler_debug)
logger.addHandler(file_handler_error)
logger.addHandler(console)

# Start the server
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
host = config.get('server', 'host')
port = config.getint('server', 'port')
logger.info("Starting server on {}:{}".format(host, port))
s.bind((host, port))
s.listen(5)


# Start listening
while True:
    try:
        client, addr = s.accept()
    except KeyboardInterrupt:
        break

    thread = ConnProcessor(client, addr, config.get("backend", "url"))
    thread.start()

# Terminate threads
for t in threading.enumerate():
    if hasattr(t, 'should_terminate'):
        t.should_terminate = True

s.close()
logger.info("Bye!")
