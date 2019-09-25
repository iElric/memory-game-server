import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    // load this PairOfTiles react components into the root DOM
    ReactDOM.render(<PairOfTiles/>, root);
}

class PairOfTiles extends React.Component {
    constructor(props) {
        super(props);
        let tileArray = this.initTiles();
        this.state = {
            tiles: tileArray,
            isVisible: Array(16).fill(false),
            isClickable: Array(16).fill(true),
            // only register valid click
            numGuesses: 0,
            // store the previous click(first click), -1 means the next click should be first guess
            prevClickIndex: -1
        }
    }

    // generate an random array of length 16 with characters from A to H, each characters appear twice
    initTiles() {
        let tiles = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
        // Returns a shuffled copy of the list, using a version of the Fisher-Yates shuffle
        return _.shuffle(tiles);
    }

    // check if this is a first guess
    isFirstGuess() {
        return this.state.prevClickIndex === -1;
    }


    renderTile(index) {
        // pass the property to the function component, let the component decide how to render it
        return (
            // When React sees an element representing a user-defined component, it passes JSX attributes to this
            // component as a single object. We call this object “props”.
            <Tile value={this.state.tiles[index]} isVisible={this.state.isVisible[index]}
                  onTileClick={() => this.handleClick(index)}/>
        )
    }

    handleClick(index) {
        if (this.isFirstGuess()) {
            // first guess
            if (this.state.isClickable[index]) {
                /*this.state.isVisible[index] = true;
                this.state.isClickable[index] = false;
                this.state.numGuesses++;
                this.state.prevClickIndex = index;*/
                this.setState({
                    //TODO: refactor a function out!!
                    isVisible: _.map(this.state.isVisible, (t, i) => {
                        if (i === index) {
                            return true;
                        } else {
                            return t;
                        }
                    }),
                    isClickable: _.map(this.state.isClickable, (t, i) => {
                        if (i === index) {
                            return false;
                        } else {
                            return t;
                        }
                    }),
                    numGuesses: this.state.numGuesses + 1,
                    prevClickIndex: index
                }, () => {
                    console.log(this.state);
                });

            }
        } else {
            // second guess
            if (this.state.isClickable[index]) {
                // keep the previous index in a local variable since we want to
                let temp = this.state.prevClickIndex;
                // this is a default state(we assume successful match), if the latter match happens, the state stay no
                // change. Otherwise we set a delay and modify the state. In this way, we can spare an extra render.
                this.setState({
                    // set this tile visible
                    isVisible: _.map(this.state.isVisible, (t, i) => {
                        if (i === index) {
                            return true;
                        } else {
                            return t;
                        }
                    }),
                    // set this tile not clickable
                    isClickable: _.map(this.state.isClickable, (t, i) => {
                        if (i === index) {
                            return false;
                        } else {
                            return t;
                        }
                    }),
                    numGuesses: this.state.numGuesses + 1,
                    prevClickIndex: -1
                }), ()=>{console.log(this.state)};
                // if two click did not match
                if (!(this.state.tiles[index] === this.state.tiles[this.state.prevClickIndex])) {
                    setTimeout(() => this.setState({
                        // make both invisible
                        isVisible: _.map(this.state.isVisible, (t, i) => {
                            if (i === index || i === temp) {
                                return false;
                            } else {
                                return t;
                            }
                        }),
                        // make both clickable
                        isClickable: _.map(this.state.isClickable, (t, i) => {
                            if (i === index || i === temp) {
                                return true;
                            } else {
                                return t;
                            }
                        }),
                    },()=>{console.log(this.state)}), 1000)
                }
            }

        }


    }


    render() {
        return (
            //TODO: not really that elegant, may refactor this to a loop
            <div className="board">
                <div className="board-row">
                    {this.renderTile(0)}
                    {this.renderTile(1)}
                    {this.renderTile(2)}
                    {this.renderTile(3)}
                </div>
                <div className="board-row">
                    {this.renderTile(4)}
                    {this.renderTile(5)}
                    {this.renderTile(6)}
                    {this.renderTile(7)}
                </div>
                <div className="board-row">
                    {this.renderTile(8)}
                    {this.renderTile(9)}
                    {this.renderTile(10)}
                    {this.renderTile(11)}
                </div>
                <div className="board-row">
                    {this.renderTile(12)}
                    {this.renderTile(13)}
                    {this.renderTile(14)}
                    {this.renderTile(15)}
                </div>
            </div>
        )
    }
}

// this is function components, accept a single object argument with data and return a react element
// this function render a single tile as a button
// always start a component name with a capital letter
function Tile(props) {
    // TODO: handle the logic that whether this tile should be seen or not. Visibility should only decided by isVisible
    //  property
    let {value, isVisible, onTileClick} = props;
    if (isVisible) {
        return (
            <button className="tile" onClick={onTileClick}>
                {value}
            </button>
        )
    } else {
        return (
            <button className="tile" onClick={onTileClick}>
                {/* do not render value*/}
            </button>
        )
    }


}

