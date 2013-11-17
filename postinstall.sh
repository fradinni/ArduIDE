npm install -g nw-gyp
cd node_modules/serialport
nw-gyp rebuild --target=0.8.0
cd ../..
echo "Post install [Finished]"