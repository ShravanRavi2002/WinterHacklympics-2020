
import React, {useState} from 'react';


const Route = ({route}) => {
    // const [path, setPath] = useState([]);
    // const [cost, setCost] = useState();
    // setCost(route[route.length - 1]);
    // setPath(route.slice(0, route.length - 2));
    const cost = route[route.length - 1];
    const path = route.slice(0, route.length - 1);
    var color = 'red';
    if (cost < 300)
        color = 'green';
    else if (cost < 500)
        color = 'yellow';
    else if (cost < 1000)
        color =  'orange';
    else
        color = 'red';

    return(
        <div 
            className="route-container"
        >

            <div style={{
                color: color,
                padding: 10}}>
                {path.join('  ✈  ')}
                {" " + cost}
            </div>

        </div>
    )   
}
export default Route;