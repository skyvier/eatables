#!/bin/bash

SOURCE="../src/mongodb_handler/*.js ../src/public/javascript/*.js ../src/public/javascript/eatables/*.js ../src/*.js"
DESTINATION="./js/"

jsdoc $SOURCE --destination $DESTINATION
