# sn-filter-pane

A new Filter pane based on Nebula Listbox.  
***!EXPERIMENTAL!***  

## Usage

```js
npm install sn-filter-pane
```

## How to run locally
In sense-client run the backend:
```js
yarn docker
```

Clone the Nebula repository at: https://github.com/qlik-oss/nebula.js

From the root folder of Nebula repository:
```js
yarn && yarn build:dev
cd commands/serve
yarn && yarn build:dev
```

From the folder ./nebula.js/commands/serve link the dependency with npm (since npm is used in sn-filter-pane):
```js
npm link
```

In the root folder of the sn-filter-pane repository install the packages, link the filter-pane to Nebula and start the project:
```js
npm i
npm link @nebula.js/cli-serve
npm run start
```

### Releasing

Simply run the [create-release](https://github.com/qlik-oss/sn-filter-pane/actions/workflows/create-release.yaml) workflow.

It requires a branch to deploy as a parameter, this should _always_ be `main`.

You need to be a collaborator to run this workflow.