import React,{ useState, useEffect} from 'react';
import fetch from 'fetch';

/**
 * @param {String} url 
 * @param {Object} initState 
 */
const useFetch = (url, initState) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setDate] = useState(initState);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () =>{
      setIsLoading(true);
      try {
        const res = await fetch(url);
        setDate(res);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    }
    fetchData();

  }, [url]);

  return [
    data,
    isLoading,
    isError,
  ];
}

export default function MeasureExample() {
    const [data, isLoading,isError] = useFetch('www.jianjiacheng.com:3001',{name:1});
    if(isError){
        alert('请求错误')
    }

    return (
      <>
        <button >fetchData</button>
      </>
    );
  }
