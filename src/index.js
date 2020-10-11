import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props){// 受控组件、函数式组件
  return (
    <button className="square" onClick={()=>props.onClick()}>
      {props.value}
    </button>
  );
};

class Board extends React.Component {// 类组件
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>;
  };
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

class Game extends React.Component {
  constructor(props){// 初始化 state
    super(props)
    this.state = {
      history:[{// 历史数组，元素为对象squares：[]
        squares:Array(9).fill(null),
      }],
      xIsNext:true,// 下一步是否为X
      stepNumber: 0,// 步骤
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);// ????
    const current = history[history.length-1] // 最后一个状态
    const squares = current.squares.slice()// 创建一个 squares 的拷贝而不是直接修改它,不变形的优点（拷贝最后一个状态）
    if(calculateWinner(squares) || squares[i]){// 如果有一方胜利了，则游戏结束
      return;
    }
    squares[i]= this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history:history.concat([{// 添加历史记录
        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext,
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:step%2===0,
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step,move)=>{
      const desc = move?'Go to move #'+move :'Go to game start';
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;// 状态条
    if(winner){// 有人赢了
      status = "Winner: "+winner
    }else{// 游戏继续
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) =>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// 计算胜利的一方
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
     [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
