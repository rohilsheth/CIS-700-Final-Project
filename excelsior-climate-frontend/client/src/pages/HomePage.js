import React from 'react';

import MenuBar from '../components/MenuBar';


class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          temp: 0
        }
    }


    componentDidMount() {
      const startingTime = new Date('December 19, 2022 19:38:00');
      setInterval(() => {
        const currentTime = new Date();
        const timeDifference = currentTime - startingTime;
        const secondsSinceStartingTime = timeDifference / 1000;

        const valueToIncreaseBy = 0.0000000011206949854696092 * secondsSinceStartingTime;
        const newValue = 14.9756486321 + valueToIncreaseBy;

        this.setState({temp: newValue.toFixed(10)});
      }, 1000);


      

    }

    render() {
        return (
            <div>
                <MenuBar />
                <h1>{this.state.temp}</h1>
               

            </div>
        )
    }
}

export default HomePage

