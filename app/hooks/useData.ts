import { useEffect, useState } from 'react';
import { accData, DataItem, GraphItem } from '../utils/chart';
import { isAfter, isEqual, parseISO } from 'date-fns';

interface UseDataReturn {
  data: DataItem[];
  graphData: GraphItem;
  updated: string;
}

export const useData = (): UseDataReturn => {
  const [data, setData] = useState<DataItem[]>([]);
  const [graphData, setGraphData] = useState<GraphItem>({});
  const [updated, setUpdated] = useState<string>('');

  useEffect(() => {
    fetch('/api', {})
      .then((response) => response.json())
      .then((data: any) => {
        const cutoffDate = parseISO('2024-08-06T07:00');
        const filteredData = data.data.filter((item: any) => {
          const itemDate = parseISO(item.timestamp);
          return isAfter(itemDate, cutoffDate) || isEqual(itemDate, cutoffDate);
        });

        setData(filteredData);
        setGraphData(accData(filteredData));
        setUpdated(data.updated);
      });
  }, []);

  console.log(data, graphData, updated);

  return { data, graphData, updated };
};
