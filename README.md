# Getting Started
## Install Node
1. Make sure you have [brew](http://brew.sh) installed.
2. Run
    ```
    brew update
    brew install node
    ```
    
3. Make sure you have the newest version of node. 
    ```
    node --version
    >>> v6.6.0
    ```
    Something above 6.5 is fine. (This is because of node's [ES6](https://github.com/lukehoban/es6features) support.)

## Get the code
1. To get the code in this repository, run 
    ```
    git clone https://github.com/rshkv/vbb-bot.git
    ```
    A folder named _vbb-bot_ will be created.
    
2. We need some other people's code too. Go inside that folder with
    ```
    cd vbb-bot
    ```
    and run
    ```
    npm install
    ```
    This has the [node package manager](https://www.npmjs.com) install all the dependencies defined in [package.json](https://github.com/rshkv/vbb-bot/blob/master/package.json).

## Access token
To use the API you need an access token. We'll give you one.
Put it in the [config.js](https://github.com/rshkv/vbb-bot/blob/master/config.js) file.