// instalación de proyecto en debian 11

// instalar paquetes necesarios
apt install git nodejs npm -y
npm install --global yarn
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

// reiniciar sesión shell

nvm install 14.20.1
nvm use 14.20.1

cd dentalinx/backend/
yarn install
yarn run dev

cd dentalinx/frontend/
yarn install
yarn run dev
