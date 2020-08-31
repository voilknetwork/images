import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import "./style.css";

export default class FilesUploadComponent extends Component {

    constructor(props) {
        super(props);
        let cookies = new Cookies();
        this.state = {
          username: cookies.get("BEARS_USERNAME"),
          pass: cookies.get("BEARS_posting"),
          active_pubkey: cookies.get("BEARS_postingPUB"),
            file: null,
            files: null,
            selectedsize: 0,
            message: "Drop images in the dashed box or click on it.",
            result: null,
            min: 0,
            max: 0,
            now: 0,
        }
        this.onFilesChange = this.onFilesChange.bind(this);
        this.onSubmitFiles = this.onSubmitFiles.bind(this);
    }

    onFilesChange(e) {
        let files = e.target.files;
        this.setState({now: 0, max: 0, min: 0})
        
        let size = 0;
        for (let i = 0; i < files.length; i++) {    
            size += files[i].size;
        }
        
        this.setState({ selectedsize: size,max:size,files: e.target.files, message: e.target.files.length + " files selected" })
    }

    onSubmitFiles(e) {
        e.preventDefault()
        
        const formData = new FormData()
        let { files } = this.state;

        if(files ==null || files == undefined) {
            this.setState({message: "Select at least 1 file.."})
            return
        }
        let URIpost
        if(this.state.username=="null"||this.state.username==null||this.state.username==undefined)
        URIpost = "https://graphql.voilk.com/upload/files/"
        else
        URIpost = "https://graphql.voilk.com/upload/files/"+this.state.username+"/"+this.state.pass

        let images = [];

        let size = 0;
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            size += files[i].size;
            images.push(element);
        }
        this.setState({selectedsize: size})
        images.forEach(img => {
            formData.append("photos", img)
        })
        const config = {
            onUploadProgress: progressEvent => {
                this.setState({now: progressEvent.loaded})
            }, // TO SHOW UPLOAD STATUS
            
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(URIpost, formData, config, {
        }).then(res => {
            console.log(res.data);
            this.setState({ result: res.data })
        })
    }


    render() {
        return (
            <div class="container">
                <br/>
                <br/>
                <img src="../images/logo.png" alt=""/>
                <div class="card">
                    <div class="card-heading"><strong>Upload Files</strong> <small>Drag and drop image files in the dashed box below.</small></div>
                    <div class="card-body">
                    
                    <h5>or Select files from your computer</h5>
                    {(this.state.username==undefined||this.state.username=="null")?<p><a href="/login">login</a> to save files for later use 
                    <br/>
                    or <a href="https://voilk.com/register">create an account</a>
                    </p>:
                    <p>hi! {this.state.username} <br /> 
                    <a href={"/@"+this.state.username}>click here</a> to view your photos. <br />
                    or <a href="/logout">logout</a>
                    </p>}
                        
                        <form onSubmit={this.onSubmitFiles} >
                            
                                <div class="form-group">
                                    <label class="upload-drop-zone">
                                        <input type="file" name="photos" id="photos" onChange={this.onFilesChange} multiple />
                                    </label>
                                </div>
                                
                                <p>{this.state.message+ " ("+(this.state.selectedsize/1000000).toFixed(2)+" MB)"}</p>
                                
                                <button type="submit" class="btn btn-lg btn-primary"> Upload </button>
                           
                        </form>
                        <br />
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" 
                            aria-valuenow={this.state.now} 
                            aria-valuemin={this.state.min} 
                            aria-valuemax={this.state.max} 
                            style={{ width: ((this.state.now*100)/this.state.max).toFixed(2) +"%" }}>
                                <span class="sr-only">{" ("+(this.state.now/1000000).toFixed(2)+" MB)"} Complete</span>
                            </div>
                        </div>
{this.state.result == null ? null : <div class="js-upload-finished">
                                 
                        
                            <h3>Uploaded files information</h3>
                            <div class="container">

                                   <div className="row">

                                    {this.state.result.files.map((file, index) => {
                                        
                                        return (
                                            <div className="col-md-3" key={index}>
                                                <img width="100%" src={file.metadata.fileurl}></img>
                                                <a href={file.metadata.fileurl} target="_blank" class="list-group-item list-group-item-success"><span class="badge alert-success pull-right">Success</span>Open Image</a>
                                                <input type="text" 
                                                name="text" id="text" 
                                                readOnly
                                                className="form-control" value={file.metadata.fileurl}
                                                onClick = {(e) => {
                                                    var copyText = e.target.value
                                                    /* Copy the text inside the text field */
                                                    navigator.clipboard.writeText(copyText)
                                                  
                                                    /* Alert the copied text */
                                                    alert("Copied the text: " + copyText);
                                                }}
                                                />

                                            </div>
                                        )
                                    })}

                                </div>
                            

                            </div>
                        </div>}
                    </div>
                </div>



                {/* <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input type="file" name="file" id="file" onChange={this.onFileChange} />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Upload</button>
                        </div>
                    </form>
                
                <form onSubmit={this.onSubmitFiles}>
                <div class="custom-file mb-3">
                    <input type="file" name="photos" id="photos" onChange={this.onFilesChange} multiple />
                    <label for="photos" class="custom-file-label">Choose Files</label>
                </div>
                <input type="submit" value="Submit" class="btn btn-primary btn-block"/>
                </form> */}

            </div>
        )
    }
}