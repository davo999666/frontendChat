import { useState } from "react";
import SignIn from "./gust/SignIn.jsx";
import SignUp from "./gust/SignUp.jsx";
import Profile from "./profile/Profile.jsx";

const Index = () => {
    const [userHasProfile, setUserHasProfile] = useState(true);
    const [signedIn, setSignedIn] = useState(false);


    return (
        <div>
            {!signedIn && (
                <>
                    {userHasProfile ? (
                        <SignIn setUserHasProfile={setUserHasProfile} setSignedIn={setSignedIn}/>
                    ) : (
                        <SignUp setUserHasProfile={setUserHasProfile} setSignedIn={setSignedIn}/>
                    )}
                </>
            )}
            {signedIn && <Profile setSignedIn={setSignedIn} />}
        </div>
    );
};

export default Index;
