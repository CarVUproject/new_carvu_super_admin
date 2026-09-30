'use client';
import store from '@/store/store';
import React from 'react';
import { Provider } from 'react-redux';

type ReduxProviderPropsTypes = {
  children: React.ReactNode;
};

const ReduxProvider: React.FC<ReduxProviderPropsTypes> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
