import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";
import axios from "axios";
import Members from "./components/Members/Members";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      first_name: "",
      last_name: "",
      buttonDisabled: false,
      formStatus: "create",
      memberIdSelected: null,
    };
  }

  componentDidMount() {
    // untuk mengambil data ke suatu server gunakan perintah axios.get
    axios
      .get("https://reqres.in/api/users?page=2")
      .then((response) => {
        this.setState({ members: response.data.data });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  inputOnChangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    var payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    };

    //url untuk form create
    var url = "";

    if (this.state.formStatus == "create") {
      url = "https://reqres.in/api/users";
      this.addMember(url, payload);
    } else {
      //untuk form edit
      url = "https://reqres.in/api/users/${this.state.memberIdSelected}";
      this.editMember(url, payload);
    }
  };

  addMember = (url, payload) => {
    axios
      .post(url, payload)
      .then((response) => {
        var members = [...this.state.members];
        members.push(response.data);
        this.setState({ members, buttonDisabled: false, first_name: "", last_name: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editButtonHandler = (member) => {
    this.setState({
      first_name: member.first_name,
      last_name: member.last_name,
      formStatus: "Edit",
      memberIdSelected: member.id,
    });
  };

  editMember = (url, payload) => {
    axios
      .put(url, payload)
      .then((response) => {
        var members = [...this.state.members];
        var indexMember = members.findIndex((member) => member.id === this.state.memberIdSelected);

        //mengganti data yang ada dalam state member dan index yg sesuai
        members[indexMember].first_name = response.data.first_name;
        members[indexMember].last_name = response.data.last_name;

        this.setState({
          members,
          buttonDisabled: false,
          first_name: "",
          last_name: "",
          formStatus: "create",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteButtonHandler = (id) => {
    var url = "https://reqres.in/api/users/${id}";

    axios
      .delete(url)
      .then((response) => {
        if (response.status === 204) {
          var members = [...this.state.members];
          var index = members.findIndex((member) => member.id === id);
          members.splice(index, 1);
          this.setState({ members });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="container">
        <h1>Haltev IT Learning Center</h1>
        <div className="row">
          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Member</h2>

            <div className="row">
              <Members members={this.state.members} editButtonClick={(member) => this.editButtonHandler(member)} deleteButtonClick={(id) => this.deleteButtonHandler(id)} />
            </div>
          </div>

          <div className="col-md-6" style={{ border: "1px solid black" }}>
            <h2>Form {this.state.formStatus} </h2>
            <form onSubmit={this.onSubmitHandler}>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" name="first_name" value={this.state.first_name} onChange={this.inputOnChangeHandler} />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" name="last_name" value={this.state.last_name} onChange={this.inputOnChangeHandler} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={this.state.buttonDisabled}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
