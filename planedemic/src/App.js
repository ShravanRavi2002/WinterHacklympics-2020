import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import { sendData } from './API';
import Route from './components/route'





function App() {
  const [routes, setRoutes] = useState([]);
  const FindPath = async (data) => {
    // run backend processes on start and dest airports
    const paths = await sendData(data)
    console.log(paths)
    setRoutes(paths)
  }


  // const getOtherPaths = () =>{
  //   for(var i = 0; i < routes.length - 1; i++) 
  //     <Route route={routes[i]}/>
  // }

  // function Paths() {
  //   // return ( <div className = 'pathsElement'>
  //   //   {(routes.length > 0 ? 
  //   //   (<div>
  //   //     <BestRoute route={routes[routes.length - 1]} />
  //   //     {getOtherPaths()}
  //   //   </div>) :
  //   //   null)}
  //   // </div>
  //   // )
  // }

  // handles getting the information from the client
  const { register, handleSubmit } = useForm();
  return (
    <div className="App">
      <header className="App-header">
        Planedemic
        <p>Find the safest flight route based on minimal risk of exposure to Covid-19</p>
      </header>
      <br/>
      <div>
        <form onSubmit={handleSubmit(FindPath)}>
            <input  name="start" placeholder="Start Airport" ref={register} />
            <input name="dest" placeholder="Destination Airport" ref={register} />
            <input type="submit"/>
        </form>
      </div>
      <br/>

      <div>
          {routes.map(route => <Route route={route} />)}
      </div>
    </div>
  );
}

export default App;
