import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  )
}

/* ===================================== GAME component======================================================= */

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

}


/* ===================================== GAME component======================================================= */

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ square: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    }

  }
  render() {
    const history = this.state.history;
    let currentSquare = history[this.state.stepNumber];
    let squares = currentSquare.square;
    let winner = this.calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner' + winner;
    } else {
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {
      let desc = move ? 'Go to step#' + move : 'Go to start of game';
      return (
        <div>
          <li key={step}>
            <button onClick={() => this.JumpTo(move)}>{desc}</button>
          </li>
        </div>
      );
    })
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  JumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: (stepNumber % 2 === 0)
    })
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    let currentSquare = history[this.state.stepNumber];
    let squares = currentSquare.square.slice();
    if (this.calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let updatedHistory = this.state.history.concat([{ square: squares }])
    this.setState({
      history: updatedHistory,
      stepNumber: this.state.history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
