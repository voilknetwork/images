import React, { Component } from 'react';
import FilesUploadComponent from '../components/FileUploadComponent';

class Welcome extends Component {
    state = {  }
    render() { 
        return ( 
        <div className="App" >
        <FilesUploadComponent />
        </div> );
    }
}
 
export default Welcome;