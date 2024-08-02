import React, { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    let value
    try {
      value = JSON.parse(
        window.localStorage.getItem(key) || JSON.stringify(defaultValue)
      )
    } catch (e) {
      console.log(e)
      value = defaultValue;
    }
    return value;
  })
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  const wrappedSetState = (newValue) => {
    try{
       window.localStorage.setItem(key, JSON.stringify(newValue)); 
    }catch(e){
        console.error(`failed to save to localStorage: ${e}`)
    }
    setState(newValue);
  };

  return [state, wrappedSetState];
}


export default useLocalStorageState;