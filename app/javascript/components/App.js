import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

class App extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Header />
        <Main />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
