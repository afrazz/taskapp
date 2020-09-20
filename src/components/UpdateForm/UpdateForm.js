import React from 'react';
import './UpdateForm.css';
import Select from 'react-select';

// Whether verified or not
const verifiedData = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
]

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.candidates.id,
            firstName: this.props.candidates.firstName,
            email: this.props.candidates.email,
            verified: this.props.candidates.verified
        }
    }

    // When name and email input field changes
    onInputChange = (event) => {
        switch(event.target.name) {
            case 'firstName':
                this.setState({firstName: event.target.value})
                break;
            case 'email':
                this.setState({email: event.target.value})
                break;
            default:
                return;
        }
    }

    // Verified selection field changes
    onSelectChange = (event) => {
        this.setState({verified: event.value})
    }

    // Validating email address
    validateEmail = (emailField) => {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(emailField) === false) {
            return false;
        }
        return true;
    }
    

    // Update button press
    onUpdateSubmit = () => {
        const { _id, firstName, email, verified } = this.state;
        let error = document.querySelector('.error-msg');
        if(firstName.length <= 2) {
            error.textContent = 'Name atleast 3 char';
        } else if(!this.validateEmail(email)) {
            error.textContent = 'Valid Email required';
        } else {
            // Updating candidate information
            fetch('http://18.188.185.178:3002/put/candidate', {
                method: 'put',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    id : _id,
                    set : {
                        firstName: firstName,
                        email: email,
                        verified: verified	
                    }
                })
            })
            .then(resp => resp.json())
            .then(data => {
                const { candidates, LoadCandidateData, settingBackCandidates } = this.props;
                if(data.data) {
                    LoadCandidateData({...candidates, ...this.state});
                    settingBackCandidates();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            })
            this.props.toggle();
        } 
    }

    onCloseClick = () => {
        this.props.toggle()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onEnterClick = (event) => {
        if(event.key === 'Enter'){
            this.onUpdateSubmit()
        }
    }


    render() {
        const { firstName, email, verified } = this.state
        return (
            <div className="update-form" onKeyPress={this.onEnterClick}>
                <div id="box">
                    <p className="close-btn" onClick={this.onCloseClick}>&#x2716;</p>
                    <div className="error-msg" style={{textAlign: 'center', fontWeight: 'bold'}}></div>
                    <h3>Change Updates</h3>
                    <form>
                        <div className="fav-section"> 
                            <label id="fav-movie">Name</label>    
                            <input type="text" className="fav-mov-inp" placeholder={firstName} name="firstName" onChange={this.onInputChange} />
                        </div>
                        <div className="fav-section"> 
                            <label id="fav-actor">Email</label> 
                            <input type="email" className="fav-mov-inp" placeholder={email} name="email" onChange={this.onInputChange} />
                        </div>
                        <div className="fav-section"> 
                            <label id="fav-actor">Verified</label> 
                            <Select options={verifiedData} placeholder={verified ? 'Yes': 'No'} className="category" onChange={this.onSelectChange} />
                        </div>
                    </form>
                    <input type="submit" value="Save Changes" onClick={this.onUpdateSubmit}/>
                </div>
            </div>
        )
    }

}