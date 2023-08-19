import React, { useState, useEffect } from "react";
import { useContext, useRef } from "react";
import { UserDataContext } from "../../../context/Context";

class InputHandler extends React.Component {
    static contextType = UserDataContext;
  constructor(props) {
    super(props);
    this.mylink = "";
    this.provided_data = "";
    this.idf ="";
    this.itemid = "";
    this.item_Link_Obj = this.props.myobj ;
    this.textInput = React.createRef();
    this.state = {
      itemName: this.props.myobj.itemname,
      searchResults: [],
      selectedItemIndex: 0,
      isShown:false,
    };


  }
  componentDidMount() {
    const userContext = this.context;
    if(this.props.myobj.page === "spbill"){
      if(this.props.myobj.idf !== "items"){
        this.textInput.current.focus();
      }
    }
}

  fetchSearchResults = async (mylink) => {
    try {
      const response = await fetch(mylink, {
        method: "GET",
        mode: "cors",
      });
      const data = await response.json();
      this.setState({ searchResults: data });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  handleItemNameChange = (event) => {
    this.setState({selectedItemIndex:0});
    // console.log("inputhandler ----- ",this.item_Link_Obj.id);

    const { value } = event.target;
    // console.log("inputhandler----- ",value);
    
    this.setState({ itemName: value });
    
    this.mylink = 
      
      this.item_Link_Obj.links +
      "idf=" + 
      this.item_Link_Obj.idf  +
      "&getcolumn=" +
      this.item_Link_Obj.colname +
      "&limit=" +
      this.item_Link_Obj.limit +
      "&action=" +
      this.item_Link_Obj.action +
      "&type=itemsearch&name=" +
      value +
      "&cs=" +
      this.item_Link_Obj.cs +
      "&limit=" +
      this.item_Link_Obj.limit;
    this.provided_data = this.item_Link_Obj.provided_data;
    this.fetchSearchResults(this.mylink);
    console.log(">>>>> ",this.state.searchResults)
    
    if (this.item_Link_Obj.idf === "items") {
      if(this.state.searchResults.length > 0){
        console.log("<ser>>> ", this.state.searchResults)
        this.populateGridData(this.state.searchResults[0]);
        this.props.rowdatahandler(this.props.myobj, value, this.state.searchResults[0], 'text' );
      }
  }


  };

  populateGridData = (value) => {
    for(const[k,v] of Object.entries(value)){
      this.context.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {...ps.recdic.grid ,
        [this.item_Link_Obj.id] : {...ps.recdic.grid[this.item_Link_Obj.id],[k]:v}},},}));
      if(this.props.myobj.cs === "customer"){
        if(k=== "srate"){
          this.context.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {...ps.recdic.grid ,
            [this.item_Link_Obj.id] : {...ps.recdic.grid[this.item_Link_Obj.id],['rate']:parseFloat(v)}},},}));
        }
      }
      else {
        if(k === 'prate'){
          this.context.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {...ps.recdic.grid ,
            [this.item_Link_Obj.id] : {...ps.recdic.grid[this.item_Link_Obj.id],['rate']:parseFloat(v)}},},}));
        }
      }
    }
}

  handleItemClick = (value) => {
    
    console.log(this.context.store.recdic);
    if (this.item_Link_Obj.idf === "supplier" || this.item_Link_Obj.idf === "customer") {
      console.log(this.context.store.recdic);
      let newpantemplate = { ...this.context.store.recdic.pantemplate }; // issued 1
      for(const[k,v] of Object.entries(value)){
        newpantemplate[k] = v;
      }

      this.setState({ itemName: value.name, searchResults: []});
      this.context.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: newpantemplate,},}))
      
    } else if (this.item_Link_Obj.idf === "items") {
      this.setState({ itemName: value.name, searchResults: []});
      this.itemid = value.itemid;
      this.populateGridData(value);
    }
    this.props.rowdatahandler(this.props.myobj, value.name, value, 'select' );
  };

  handleKeyDown = (event) => {
    const { searchResults, selectedItemIndex } = this.state;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = selectedItemIndex > 0 ? selectedItemIndex - 1 : searchResults.length - 1;
      this.setState({ selectedItemIndex: prevIndex });
      this.populateGridData(this.state.searchResults[prevIndex]);
      this.props.rowdatahandler(this.props.myobj, event.target.value , this.state.searchResults[prevIndex], 'text' );
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = selectedItemIndex < searchResults.length - 1 ? selectedItemIndex + 1 : 0;
      console.log("down next ind ",nextIndex, " selectedItemIndex -- ", selectedItemIndex);
      this.setState({ selectedItemIndex: nextIndex });
      this.populateGridData(this.state.searchResults[nextIndex]);
      this.props.rowdatahandler(this.props.myobj,event.target.value , this.state.searchResults[nextIndex], 'text' );
    } else if (event.key === "Enter") {
      event.preventDefault();
  
      const { searchResults, selectedItemIndex } = this.state;
      if(searchResults.length === 0){
        alert("Add New Supplier if Required");
        return ;
      }
      if (selectedItemIndex !== -1) {
        const selectedItem = searchResults[selectedItemIndex];
        this.handleItemClick(selectedItem);
      }
    }
  };
  render() {
    const { searchResults,  selectedItemIndex, isShown ,hoveredItemIndex } = this.state;
    const spanStyles = {
      display: "block",
      padding: "10px",
      cursor: "pointer",
      width: "100%",
      background: "transparent", // Set a transparent background by default
      // transition: "background-color 0.3s ease-in-out", // Add a smooth transition effect
    };
  
    if (selectedItemIndex !== -1) {
      // If there is a selected item, apply a different background color
      spanStyles.background = "#f1f1f1";
    }

    const hoverColor = "#3ddc8d";
  
    const data = this.provided_data;
    const itemNameSearch =  (
      searchResults.map((result, index) => (
        <span
          className="dropdownthing-span"
          key={result._id}
          onClick={() => this.handleItemClick(result)}
          style={{
            ...spanStyles,
            background:
              selectedItemIndex === index
                ? "#3ddc8d"
                : hoveredItemIndex === index
                ? hoverColor
                : "transparent",
          }}
          onMouseEnter={() => {
            if (selectedItemIndex !== index) {
              this.setState({ hoveredItemIndex: index });
            }
          }}
          onMouseLeave={() => {
            if (selectedItemIndex !== index) {
              this.setState({ hoveredItemIndex: null });
            }
          }}
        >

          {result[data]}
        </span>
      ))
    )
  
    const shouldApplyWidth = parseInt(this.item_Link_Obj.widthstyle);
    const inputStyles = {
      width: shouldApplyWidth ? "200px" : "5rem",
    };
    return (
      <div id="myDropdown" style={{ position: "relative" }}>
        <input
          type="text"
          onFocus={() => this.setState({ isShown: true })}
          onBlur={() => this.setState({ isShown: false })}
          placeholder={this.item_Link_Obj.info}
          id={this.props.id}
          value={this.state.itemName}
          onChange={this.handleItemNameChange}
          onKeyDown={this.handleKeyDown}
          ref={this.textInput}
          style={inputStyles}
        />
        <div className="dropdownthing">{itemNameSearch}</div>
      </div>
    );
  }
}
export default InputHandler;
