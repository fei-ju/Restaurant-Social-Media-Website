import RestaurantBox from "../RestaurantBox";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from "react";
import { useEffect } from "react";
import config from "../../../config.json";
const RestaurantMultiBoxes = () => {
    const [query, setQuery] = useState("")
    const baseurl = config.baseurl + "/restaurant_general/search/"
    const [url, seturl] = useState(baseurl)
    const [load, setLoad] = useState(0)
    const [boxes, setBoxes] = useState([])
    useEffect(() => {
        if (url === null) {
            return
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                seturl(data.next)
                // add to the setbox if restaurant.id is not in the set
                let newBoxes = data.results.map(restaurant => {
                    if (boxes.find(box => box.id === restaurant.id) === undefined) {
                        return <RestaurantBox key={restaurant.id} restaurant={restaurant} />
                    }
                })
                setBoxes(boxes.concat(newBoxes))
            })
    }, [load])
    useEffect(() => {

        fetch(baseurl + "?q=" + query)
            .then(response => response.json())
            .then(data => {
                seturl(data.next)
                console.log(url)
                setBoxes(data.results.map(restaurant => <RestaurantBox restaurant={restaurant} key={restaurant.id} />))
            })
    }, [query])


    /*

        {restaurants.map(restaurant => (
                
            ))}

    */


    return (
        <>
            <div style={{
                alignItems: 'center',
                width: '60%',
                margin: 'auto',
                justifyContent: 'center',
                marginTop: '50px',
                backgroundColor: 'white',
            }}>
                <TextField placeholder="Type a restaurant, food, or address..." label="Search" variant="outlined" fullWidth onChange={(event, id) => setQuery(event.target.value)} 
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '80%',
                    margin: 'auto',
                    marginTop: '30px',
                }}
            >


                {boxes}
            </div>
            <div
                style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    marginBottom: '30px',

                }}
            >
                
                {url === null ? null :<Button variant="contained" color="primary" onClick={() => {
                setLoad(load + 1)
            }}>Click me to load more...</Button>}
            </div>

        </>
    )
}

export default RestaurantMultiBoxes;