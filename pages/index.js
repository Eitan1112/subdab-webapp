import React from "react";
import styles from './index.module.css'
import Header from '../components/header'
import Form from '../components/form'

class App extends React.Component{
  state = {
    running: false
  }
  
  componentDidMount() {
    window.addEventListener('beforeunload', this.beforeunload.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
  }

  beforeunload(e) {
    if(this.state.running) {
      e.preventDefault();
      e.returnValue = true;
    }
  }
  
  render() {
    return (
      <div className={styles.App} id="app">
        <Header />
        <Form  setRunning={(running) => this.setState({running})} />
      </div>
    )
  }
}

export default App;
