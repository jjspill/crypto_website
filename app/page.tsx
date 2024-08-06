'use client';

import React, { useEffect, useState } from 'react';
import { unparse } from 'papaparse';
import { JSONTree } from 'react-json-tree';

interface DataItem {
  _id: string;
  // yourFieldName: string; // replace with actual fields from your MongoDB documents
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data: DataItem[]) => setData(data));
  }, []);

  const downloadCSV = () => {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
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
          <>
            <button
              className="border-2 border-green-400 text-white p-2 m-10 rounded-lg"
              onClick={downloadCSV}
            >
              Download CSV
            </button>
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
          </>
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
