import React, { Component } from 'react';
import axios from 'axios';
import { Grid } from 'react-bootstrap';
import jstz from 'jstimezonedetect';
import timezoneJS from 'timezone-js';


class App extends Component {

  //constructor
  constructor(props) {
    super(props);
    this.state = {displayedEvents: []};
  }

  //Communication with the server
  componentDidMount() {
    //use axios to make the call
    axios.get("/events")
    //promise
    .then(res => {
      var events = res.data.events;
      //sort the data
      events = events.sort((a,b) => {
        var c = new Date(a.start_time);
        var d = new Date(b.start_time);
        return c-d;
      });      
      //need displayedEvents and allEvents for proper search filtering
      this.setState({
        displayedEvents: events,
        allEvents: events
      });      
    });
  }

  //On search input (Every key)
  handleSearch(event) {
    var searchQuery = event.target.value.toLowerCase();
    //Filter the events for things that we searched for
    //We need the allEvents field on line 31, so we dont lose all the events
    var filteredEvents = this.state.allEvents.filter(function(el) {
      var searchValue = el.title.toLowerCase() + " " + el.location.toLowerCase();
      return searchValue.indexOf(searchQuery) !== -1;
    });

    //set the displayed events to our filtered events
    this.setState({
      displayedEvents: filteredEvents
    });
  }

  render() {
    return ( 
      //Responsiveness from bootstrap
      <Grid className="wrapper">      
      <input type="text" placeholder="Search by title or location" className="form-control search-field" onChange={this.handleSearch.bind(this)}/>
      <ul className="eventList"> 
      {this.state.displayedEvents.map((event) => {
          return (
            <div key={event.title}>
                  <li>
                    <div className="title">{event.title}</div>
                    <div className="location">Location: {event.location}</div>
                    <div className="startTime">Start Time: {event.start_time}</div>
                    <div className="endTime">End Time: {event.end_time}</div>                    
                  </li>
            </div>
          )
        })}
      </ul>
      </Grid>
    )
  }
}

export default App;
