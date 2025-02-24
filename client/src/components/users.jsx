import React, { Component } from 'react';
import { getAllUsers, getFollowing, getFollowers } from '../services/userService';
import GenericPagination from "./common/genericPagination";
import paginate from "../utility/paginate";
import FilterList from "./common/filterList";
import SearchBoxInput from "./common/searchBoxInput";
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
var moment = require('moment');

class Users extends Component {
    state = { 
        users:[],
        types:[],
        currentPage: 1,
    itemsPerPage: 20,
    searchQuery: "",
    selectedType: null,
    selectedFollowType:null,
    followTypes:[],
    followers:[],
    following:[],
    done:false
     }

     async componentDidMount() {
      console.log("mounting");

        const {data} = await getAllUsers();
        const types=["All Users","Admin", "Owner", "Reader", "Critic", "Author"];
        const followTypes=["All Users","Followers","Following"];
        const{data:following} = await getFollowing(this.props.user._id);
        const{data:followers}=await getFollowers(this.props.user._id);
        this.setState({ users: data, types,followTypes,followers,following,done:true });
      }

      handlePageChange = page => {
        this.setState({ currentPage: page });
      };
    
      handleTypeSelect = selectedType => {
        this.setState({ selectedType, currentPage: 1 });
      };
    
      handleTitleSearch = q => {
        this.setState({ searchQuery: q, currentPage: 1 });
      };

      handleFollowTypeSelect=selectedFollowType=>{
        this.setState({ selectedFollowType, currentPage: 1 });
      }


      getDataOnCurrentPage = () => {
        //1.searchquery
        //2.filter by genre--get totalcount
        //3. paginate
    
        let titleQueryFiltered = [...this.state.users];
        if(this.state.selectedFollowType && this.state.selectedFollowType != "All Users"){
            if(this.state.selectedFollowType=="Followers")
                titleQueryFiltered=[...this.state.followers];
            else if(this.state.selectedFollowType=="Following")
                titleQueryFiltered=[...this.state.following];    
        }
        let searchFiltered=titleQueryFiltered;
        if (this.state.searchQuery != "")
          //if there is a query
          searchFiltered = titleQueryFiltered.filter(b =>
            b.firstName.toUpperCase().includes(this.state.searchQuery.toUpperCase())|| (b.lastName && b.lastName.toUpperCase().includes(this.state.searchQuery.toUpperCase()))
          );
        
        
        let genreFiltered = searchFiltered;
        if (this.state.selectedType && this.state.selectedType != "All Users") {
          genreFiltered = searchFiltered.filter(
            user => user.TYPE == this.state.selectedType
          );
        }
        const totalCount = genreFiltered.length;
    
        const users = paginate(
          genreFiltered,
          this.state.currentPage,
          this.state.itemsPerPage
        );
        return { totalCount, users };
      };


      render() {
        if(!this.state.done)
        return <div className="row">
            <div className="col">
            <ReactLoading type={"bars"} color={"black"}/>
            <h2>Loading.... Please wait</h2>
            </div>
        </div> 

        const propUser=this.props.user;  
    
        const pagedData = this.getDataOnCurrentPage();
        const totalCount = pagedData.totalCount;
        const pagedUsers= pagedData.users;
        return (
          <div className="row">
            <div className="col-3">
              <FilterList
                choices={this.state.types}
                selectedChoice={this.state.selectedType}
                onChoiceSelect={this.handleTypeSelect}
              />
              <br/>
              {propUser&&propUser.TYPE!="Admin" && (<FilterList
                choices={this.state.followTypes}
                selectedChoice={this.state.selectedFollowType}
                onChoiceSelect={this.handleFollowTypeSelect}
              />)}
            </div>
            <div className="col">
            {propUser && propUser.TYPE=="Admin" && (<Link
              to="/users/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New User
            </Link>)}
              <p>{totalCount} Users found.</p>
              <div className="row">
                  <SearchBoxInput
                    placeholder="Search by Name..."
                    value={this.state.titleQuery}
                    onChange={this.handleTitleSearch}
                  />
             </div>
    
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Last Name</th>
                    <th>Type</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Date Of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map(user => { if(user) return(                    
                    <tr key={user._id}>
                      <td><Link to={`/users/${user._id}`}>{user.firstName}</Link></td>
                      <td>{user.lastName}</td>
                      <td>{user.TYPE}</td>
                      <td>{user.email}</td>
                      <td>{user.gender}</td>
                      <td>{this.formatDate( user.dateOfBirth)}</td>
                    </tr>
                  )}
                  )}
                </tbody>
              </table>
            </div>
            <GenericPagination
                totalItems={totalCount}
                itemsPerPage={this.state.itemsPerPage}
                currentPage={this.state.currentPage}
                onPageChange={this.handlePageChange}
              />
          </div>
        );
      }

      formatDate(date){
        var fomatted_date = moment(date).format('YYYY-DD-MM');
        return fomatted_date;

      }
}
 
export default Users;