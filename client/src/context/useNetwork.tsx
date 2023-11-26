import {  ReactElement, createContext, useContext } from 'react';
import NetworkInterface from '../api/network/networkInterface';
import Http from '../api/network/network';

interface Props {
  children: ReactElement;
}

const NetworkContext = createContext({
  network: new NetworkInterface(new Http()),
});

export const NetworkProvider = ({ children }: Props) => {
  const apiClient = new Http();
  const network = new NetworkInterface(apiClient);

  return (
    <NetworkContext.Provider value={{ network }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  return useContext(NetworkContext);
};
