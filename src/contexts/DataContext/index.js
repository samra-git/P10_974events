import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);  // ajout de last à un state local
  const getData = useCallback(async () => {
    try {
      const dataLoaded = await api.loadData()
      setData(dataLoaded);
      setLast(dataLoaded.events.sort((evtA, evtB) => new Date(evtB.date) - new Date(evtA.date))[0])
    
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
    
  },[data]);  
  


  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last // last défini
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;



// import PropTypes from "prop-types";
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const DataContext = createContext({});

// export const api = {
//   loadData: async () => {
//     const json = await fetch("/events.json");
//     return json.json();
//   },
// };

// export const DataProvider = ({ children }) => {
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
//   const [last, setLast] = useState(null);
//   const getData = useCallback(async () => {
//     try {
//       const loadedData = await api.loadData();
//       setData(loadedData);
//       const currentDate = new Date();
//       const lastEvent = loadedData.events
//         .filter(
//           (event) => new Date(event.date).getTime() < currentDate.getTime()
//         )
//         .sort(
//           (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//         )[0];
//       setLast(lastEvent);
//     } catch (err) {
//       setError(err);
//     }
//   }, []);
//   useEffect(() => {
//     if (data) return;
//     getData();
//   });

//   return (
//     <DataContext.Provider
//       // eslint-disable-next-line react/jsx-no-constructed-context-values
//       value={{
//         data,
//         error,
//         last,
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };

// DataProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useData = () => useContext(DataContext);

// export default DataContext;
