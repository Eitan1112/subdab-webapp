import React from "react";
import styles from './index.module.css'
import Header from '../components/header'
import Form from '../components/form'
import Head from 'next/head'

class App extends React.Component {
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
    if (this.state.running) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  injectGA () {
    if (typeof window == 'undefined' || window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
  
    gtag('config', 'UA-110003673-3');
  };

  render() {
    return (
      <div className={styles.App} id="app">
        <Head>          
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-110003673-3"></script>
          <script>{this.injectGA()}</script>

          <title>Syncit - Automatic Subtitles Syncer</title>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta httpEquiv="Content-Type" content="text/html; charset=ISO-8859-1"></meta>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Header />
        <Form setRunning={(running) => this.setState({ running })} />
      </div>
    )
  }
}

export default App;
