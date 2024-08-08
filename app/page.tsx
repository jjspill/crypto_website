'use client';

import React, { useEffect, useState } from 'react';
import { unparse } from 'papaparse';
import { JSONTree } from 'react-json-tree';
import styles from './website.module.css';
import { accData } from './utils/chart';
import { useData } from './hooks/useData';
import { GraphDisplay } from './components/chart';

interface DataItem {
  _id: string;
  // yourFieldName: string; // replace with actual fields from your MongoDB documents
}

export default function Home() {
  const { data, graphData, updated } = useData();

  const downloadCSV = () => {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const date = new Date();

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', getFilename());
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="text-center w-[90%] md:w-[50%]">
        <h1 className="text-4xl text-white pt-20">OilDog Crypto Bot</h1>
        {data.length === 0 && <p className="text-white">Loading...</p>}
        {data.length > 0 && (
          <p className="text-white">
            Updated: {new Date(updated).toLocaleString()}
          </p>
        )}
        {data.length > 0 && (
          <button
            className={`${styles.creepInBg} border-2 border-green-400 text-white p-2 m-10 mt-5 rounded-lg`}
            onClick={downloadCSV}
            type="button"
          >
            Download CSV
          </button>
        )}
        {Object.keys(graphData || {}).length > 0 && (
          <GraphDisplay graphData={graphData} />
        )}
        {data.length > 0 && (
          <div className="bg-gray-800 p-1 mb-10 rounded-lg min-h-[400px]">
            {/* <pre className="text-white">{JSON.stringify(data, null, 2)}</pre> */}
            <div className="text-left min-w-full overflow-x-auto md:overflow-hidden">
              <JSONTree
                data={data}
                theme={myCustomTheme}
                invertTheme={false}
                hideRoot={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const myCustomTheme = {
  scheme: 'custom',
  author: 'your name',
  base00: '#1f2937', // background color
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#4ade80', // default text color
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#4ade80', // key colors
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#4ade80', // string color
  base0C: '#a1efe4',
  base0D: '#66d9ef', // number color
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

function getFilename() {
  const date = new Date();

  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed in JS, add 1
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `data_${month}_${day}_${hour}_${minute}.csv`;
}
