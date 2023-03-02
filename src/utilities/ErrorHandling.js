import {errAlt} from './Alerts'; 

const errhandling = (errcode) => {
    switch (errcode) {
        case "auth/user-not-found":
            errAlt("This Email Is Not Registered");
            break;
        case "auth/wrong-password":
            errAlt("This Password Is Wrong");
            break;
        case "auth/too-many-requests":
            errAlt("Try Later");
            break;
        case "auth/email-already-in-use":
            errAlt("Email Already Used");
            break;
        default: 
            errAlt("Something Went Wrong");
    }
}

export {errhandling};