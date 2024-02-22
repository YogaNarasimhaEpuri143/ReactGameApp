import { useState, useEffect } from "react";
import { AxiosRequestConfig, CanceledError } from "axios";
import apiClient from "../services/api-client";
import Error from "axios";

interface FetchResponse<T> {
  count: number;
  results: T[];
}

const useData = <T>(
  endPoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[]
) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      const controller = new AbortController();

      setLoading(true);

      apiClient
        .get<FetchResponse<T>>(endPoint, {
          signal: controller.signal,
          ...requestConfig,
        }) // Associated with the abort signal of the controller.
        .then((res: { data: { results: T[] } }) => {
          setData(res.data.results);
          setLoading(false);
        })
        .catch((err: Error) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
        });

      return () => controller.abort(); // cleanup function get called, during unmounting of the Component & when dependency changes
    },
    deps ? [...deps] : []
  );

  return { data, error, isLoading };
};

export default useData;
