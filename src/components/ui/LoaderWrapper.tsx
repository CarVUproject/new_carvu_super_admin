'use client';
import React from 'react';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

type LoaderWrapperPropsTypes = {
  children: React.ReactNode;
};

const LoaderWrapper: React.FC<LoaderWrapperPropsTypes> = ({ children }) => {
  return (
    <ProgressProvider height="8px" color="#088F01" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
};
export default LoaderWrapper;
