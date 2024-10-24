#! /bin/bash
#
 docker build -t nginxapp . && docker run -p 8000:80 nginxapp
