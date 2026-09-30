'use client';
import { useGetTodoQuery } from '@/features/demo/demoSlice';
import React from 'react';
import EnvlopeIcon from '../icons/EnvlopeIcon';

const DemoComponent = () => {
  /**-RTK-**/
  //queries
  const { data: todoData } = useGetTodoQuery(2);
  console.log('todoData', todoData);

  return (
    <div>
      <EnvlopeIcon className="text-green-500 w-[80px] h-[80px] animate-bounce" />
      <p>A demo golobal component for explaining the folder structure.</p>
    </div>
  );
};

export default DemoComponent;
