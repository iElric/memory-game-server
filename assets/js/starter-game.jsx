import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    console.log('this is channel', channel);
    // load this PairOfTiles react components into the root DOM
    ReactDOM.render(<PairOfTiles channel={channel}/>, root);
}

class PairOfTiles extends React.Component {

    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {
            tiles: [],
            numGuesses: 0,
            mismatch: false
        };

        this.channel.join()
            .receive("ok", this.getView.bind(this))
            .receive("error", resp => {
                console.log("Unable to join", resp)
            });
    }

    // set the initial state
    getView({game}) {
        this.setState(game);
    }

    renderTile(index) {
        // pass the property to the function component, let the component decide how to render it
        return (
            // When React sees an element representing a user-defined component, it passes JSX attributes to this
            // component as a single object. We call this object “props”.
            <Tile value={this.state.tiles[index]}
                  onTileClick={() => this.handleClick(index)}/>
        )
    }

    renderTiles(num) {
        //let that = this;
        let tiles = [];
        for (let i = 0; i < num; i++) {
            tiles.push(this.renderTile(i));
        }
        return tiles;
    }

    reStart() {
        this.channel.push("restart").receive("ok", this.receiveView.bind(this));
    }

    // Control the difficulty of the game by change 24 to a smaller number
    getScore() {
        if (this.state.numGuesses <= 24) {
            return 100;
        } else {
            return 100 - (this.state.numGuesses - 24);
        }
    }

    isCompleted() {
        return _.reduce(this.state.tiles, (m, n) => (m !== "") && (n !== ""));
    }

    handleClick(index) {
        this.channel.push("click", {index: index}).receive("ok", this.getView.bind(this));
        if (this.state.mismatch) {
            setTimeout(() => {
                this.channel.push("mismatch").receive("ok", this.getView.bind(this));
            })
        }
    }

    render() {
        return (
            <div>
                <p className="title">Tile matching Game</p>
                <Status guess={this.state.numGuesses} score={this.getScore()} isFinished={this.isCompleted()}/>
                <div className="board">
                    {this.renderTiles(16)}
                </div>
                <Restart onRestartClick={() => this.reStart()}/>

            </div>
        )
    }
}

// this is function components, accept a single object argument with data and return a react element
// this function render a single tile as a button
// always start a component name with a capital letter
function Tile(props) {
    let {value, onTileClick} = props;

    return (
        <button className="tile" onClick={onTileClick}>
            {value}
        </button>
    )

}

function Restart(props) {
    let {onRestartClick} = props;
    return (
        <button className="restart" onClick={onRestartClick}>
            Restart
        </button>
    )

}

// return the status. If game not complete, return number of guesses. Otherwise return guesses and score.
function Status(props) {
    let {guess, score, isFinished} = props;
    if (isFinished) {
        return (
            <p className="status">You win!!! Guess: {guess}, Score: {score}</p>
        )
    } else {
        return (
            <p className="status">Guess: {guess} </p>
        )
    }
}
