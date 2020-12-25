import React, {useState} from 'react';


const Route = ({route}) => {
    // const [path, setPath] = useState([]);
    // const [cost, setCost] = useState();
    // setCost(route[route.length - 1]);
    // setPath(route.slice(0, route.length - 2));
    const cost = route[route.length - 1];
    const path = route.slice(0, route.length - 1);
    return(
        <div className="route-container">
            
            <div>
                {path.join(' -> ')}
            </div>
            <div>
                {cost}
            </div>

        </div>
    )   
}
export default Route;