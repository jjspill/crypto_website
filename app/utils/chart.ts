export interface DataItem {
  [key: string]: any;
}

export interface GraphItem {
  [key: string]: any[];
}

export function accData(data: DataItem[]): GraphItem {
  const acc: Record<string, any> = {};

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      acc[key].push(item[key]);
    });
  });

  return acc;
}
