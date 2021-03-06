import React from 'react'
import { Form, FormGroup,FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap'
import {subscribeToEvent, emitEvent, sendRequest} from '../utils/serverhome-api'
import './Wikipedia.css';

class Globe extends React.Component {

    constructor(props){
        super(props);
        this.state = { searchValue: "",
                       searchResult: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (event) {
        this.setState({
            searchValue: event.target.value
        });
    }

    handleSubmit (event) {
        console.log("emit event globesearchresult : "+this.state.searchValue);
        emitEvent("globesearchresult", this.state.searchValue);
        if(event)
            event.preventDefault();
    }

    componentDidMount(){
        var self= this;
        subscribeToEvent("globesearchresult", function(data){
            self.setState({
                searchResult: data.title +"</br>"+ data.drapeau+"</br>"+ data.text_info1+"</br>"+ data.text_info2
            });
            console.log(data);
        });
      /*  var lastPart = window.location.href.split("/").pop();
        if(lastPart !== "wikipedia"){
            this.state.searchValue= lastPart;
            this.handleSubmit(null);
        }
      */
    }

    render() {
        var result = this.state.searchResult ?
             <div dangerouslySetInnerHTML={{ __html: this.state.searchResult }} />
            : "";
        return (
            <div className='plugincontent plugin-wikipedia'>
                <Form onSubmit={this.handleSubmit} inline>
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>Search</ControlLabel>{' '}
                        <FormControl type="text" placeholder="terms" value={this.state.searchValue} onChange={this.handleChange} />
                    </FormGroup>{' '}
                    <Button type="submit"><Glyphicon glyph="search" /> </Button>
                </Form>
                <div className="shortResult">

                    <cite>{this.state.shortResult}</cite>
                </div>
                <div className="titre">

                    {result}
                </div>
            </div>
        );
    }
};

export default Globe;