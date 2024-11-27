# appbuilder-pwa

A template for building a Progressive Web App with [Scripture App Builder](https://software.sil.org/scriptureappbuilder).

## Prerequisites

-   Visual Studio Code
-   Node 20.9.0+ (we recommend using [Volta](https://volta.sh) to manage the Node versions)

## Usage

You will need to download the latest version of [Scripture App Builder](https://software.sil.org/scriptureappbuilder/download/) to use this project without the provided example data.

### Develop

Install dependencies with `npm install`.

The PWA depends on data files generated by Scripture App Builder. There is example data provided in the repo. To convert the base data files and run the PWA, do one of the following:

#### Example Data

-   Run `npm run extract:example <project_name>` to generate data from projects in the `test_data/projects`. For example, `web_gospels` is an SAB project name and `hanga` is a DAB project name.
-   Run `npm run dev` to start the development server.

#### Scripture App Builder Project

-   Run `Build PWA Data Files` in Scripture App Builder to generate the the base data files from a project
-   Run `npm run dev` to convert the base data files to a format needed for the PWA and run the development server. Changes to the base database files are watched and applied to the running PWA.

> Contact [chris_hubbard@sil.org](mailto:chris_hubbard@sil.org) for the feature key to enable `Build PWA Data Files`

> Note: The book conversion step can take up to several minutes depending on the amount of scripture in the project and the speed of your computer's hard drive.

### Build

Run `npm run build` to build an app with the data provided by `Build PWA Data Files`.

Run `npm run build:examples` to build an app with the example data.

The production build can be viewed by running `npm run preview`.
The production build can be deployed to a public webserver for testing using [Surge](https://surge.sh).

### Testing

Scripture App Builder PWA uses [Vitest](https://vitest.dev/guide/) for unit tests. See that added test files and tests adhere to the [Front End Testing Style Guide](https://github.com/nikeshghimire77/unit-testing-styleguide).

```bash
├── scripts
│   ├── scripture-reference-utils.test.ts
│   └── scripture-reference-utils.ts
```

Run `npm test` to run created test files.

### Deployment

This project is configured by default with the static adaptor, which will allow deployment on any platform that requires a static site.

### Data Sandbox

The project uses [Proskomma](https://github.com/Proskomma/proskomma-core) ([docs](https://doc.proskomma.bible/en/latest/)) which is a JavaScript Scripture Runtime Engine for reading USFM. It provides a GraphQL interface to the data.

It is useful to be able to directly query the data during development. The `data-sandbox` sub-project is a conversion of [diegesis-apollo-sandbox](https://github.com/Proskomma/diegesis-apollo-sandbox) to use the data generated by the `convert` sub-project for the PWA.

After you have run `Build PWA Data Files` from Scripture App Builder to populate files in the `/data` directory, then run these commands.

```bash
npm install
npm run convert
cd data-sandbox
npm install
cd ..
npm run sandbox
```

Open a browser to http://localhost:2468/graphql to query the Scripture data using GraphQL.
