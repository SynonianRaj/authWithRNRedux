// NetworkStatusHandler.jsx
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from '../components/NoNetworkScreen';

const NetworkStatusHandler = ({ children }) => {
  console.log("Hii, From NetWorkStatusHandler")
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isOffline ? <NoInternetScreen onRetry={() => setIsOffline(false)} /> : children;
};

export default NetworkStatusHandler;
