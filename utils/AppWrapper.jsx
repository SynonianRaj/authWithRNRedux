import React, { useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from '../App';

import { store, persistor } from '../redux/store';

import NetworkStatusHandler from './NetworkStatusHandler';


export default function AppWrapper (){
  console.log("Hii, From AppWrapper")
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NetworkStatusHandler>
          <App />
        </NetworkStatusHandler>
      </PersistGate>
    </Provider>
  );
};


// export default function AppWrapper (){
//   console.log("Hii, From AppWrapper")
//   return (
//     <Provider store={store}>
//         <NetworkStatusHandler>
//           <App />
//         </NetworkStatusHandler>
//     </Provider>
//   );
// };
