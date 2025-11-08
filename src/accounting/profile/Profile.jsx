import Chat from "../../components/Chat.jsx";


const Profile = ({setSignedIn}) => {
    return (
        <div>
            <Chat setSignedIn={setSignedIn}/>
        </div>
    );
};

export default Profile;