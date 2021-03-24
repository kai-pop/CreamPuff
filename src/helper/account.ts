import firebase from "firebase/app";
import "firebase/auth";

export function getUserId() {
    return firebase.auth().currentUser?.uid;
}