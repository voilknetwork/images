import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "../components/style.css"
class Images extends Component {
    constructor(props) {
        super(props);
        let cookies = new Cookies();
        this.state = {
          username: cookies.get("BEARS_USERNAME"),
          pass: cookies.get("BEARS_posting"),
          active_pubkey: cookies.get("BEARS_postingPUB"),
            files: null,
            selectedsize: 0,
            message: "Drop images in the dashed box or click on it.",
            result: null,
        }
    
    }
    componentDidMount(){
        let name;
        if (this.props.match.params === undefined) {
          name = "bilalhaider";
        } else {
          name = this.props.match.params.username;
        }
        

        fetch('https://graphql.voilk.com/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: '{ get_files_of_user(username: "'+name+'") { _id username filename uploadDate metadata {fileurl}} }' }),
                })
                .then(res => res.json())
                .then(res => {
                    let data = res.data.get_files_of_user;
                    console.log(res.data)
                    if(data!==null)
                    {
                        console.log(data)
                        this.setState({result: data})
                    }
                })
    }

    render() { 
        let name;
        if (this.props.match.params === undefined) {
          name = "bilalhaider";
        } else {
          name = this.props.match.params.username;
        }
        return ( 
        <div className="App">
        <div class="js-upload-finished">
        <br/>
                <br/>
                <img src="../images/logo.png" alt=""/>
            <br/>
        <h3>{name}'s Photos shown below</h3>
        <div class="container">
            <a href="/home">Click here</a> to upload more photos



            {this.state.result == null ? null : <div className="row">
                

                {this.state.result.map((file, index) => {
                    
                    return (
                        <div className="col-md-3" key={index}>
                            <div className="card">
    <div className="card-body">
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
</div>
                        </div>
                    )
                })}

            </div>}

        </div>
    </div></div> );
    }
}
 
export default Images;