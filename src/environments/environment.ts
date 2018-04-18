// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
  	apiKey: "AIzaSyADHtFuM_KST7j7MgvO7yjYQ49pqrD1qOQ",
    authDomain: "agendaautonomia.firebaseapp.com",
    databaseURL: "https://agendaautonomia.firebaseio.com",
    projectId: "agendaautonomia",
    storageBucket: "agendaautonomia.appspot.com",
    messagingSenderId: "131196472512"
  },
  sitetitle: "GRACCS"
};
