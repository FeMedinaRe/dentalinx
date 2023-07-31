// Instalación y configuración de proyecto en servidor debian 11

$ sudo apt install git nodejs npm
$ npm install --global yarn
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
// reiniciar sesión bash
$ nvm install 14.20.1
$ nvm use 14.20.1
$ mkdir dentalinx
$ cd dentalinx
$ git clone https://github.com/FeMedinaRe/dentalinx.git

// backend
$ cd backend
$ yarn install 
$ yarn start

// frontend
$ cd frontend
$ yarn install
$ yarn start