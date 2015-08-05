#!/bin/bash

SOURCE="../src/mongodb_handler/*.js ../src/public/javascript/*.js ../src/public/javascript/eatables/*.js ../src/*.js"
DESTINATION="./js/"

if [ "$1" == "-gen" ]; then
   jsdoc $SOURCE --destination $DESTINATION
   echo "documentation has been generated"
elif [ "$1" == "-size" ]; then
   COMMENTS=`grep -e '^ *\/\/' -e '^ *\/\*' $SOURCE | wc -l`
   wc -l $SOURCE
   echo ""
   echo " $COMMENTS of these lines are comments. Way to go! ;)"
else
   echo "Usage: doc [option]"
   echo "-gen  : generates documentation to eatables/doc/js"
   echo "-size : reports javascript source information"
fi
