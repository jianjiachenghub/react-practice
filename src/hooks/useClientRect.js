import React, { useRef,useState,useCallback} from 'react';

export default function MeasureExample() {
    const [rect, ref] = useClientRect();
    return (
      <>
        <h1 ref={ref}>Hello, world</h1>
        {rect !== null &&
          <h2>The above header is {Math.round(rect.height)}px tall</h2>
        }
      </>
    );
  }
  
  function useClientRect() {
    const [rect, setRect] = useState(null);
    const ref = useCallback(node => {
        console.log(node)
      if (node !== null) {
        setRect(node.getBoundingClientRect());
      }
    }, []);
    return [rect, ref];
  }
  