// import fs from 'fs';
// import path from 'path';
// import { Express } from 'express';

// const App = (app: Express) => {
//     fs
//         .readdirSync(__dirname)
//         .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.ts")))
//         .forEach(file => import(path.resolve(__dirname, file))
//         .then(module => module.default(app)));
// }

// export default App;
