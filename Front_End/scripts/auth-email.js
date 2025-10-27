function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email address is already in use',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Invalid email address format',
    'auth/user-not-found': 'Invalid email or password',
    'auth/wrong-password': 'Invalid email or password',
    'auth/too-many-requests': 'Too many login attempts. Please try again later',
    'auth/network-request-failed': 'Network error occurred'
  };
  return errorMessages[errorCode] || 'An error occurred';
}

// 新規登録
window.registerWithEmail = async function(email, password) {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    

    await saveUserProfile(user, 'password');
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// ログイン
window.loginWithEmail = async function(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    await updateLastLogin(user.uid);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};


window.resetPassword = async function(email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};


async function saveUserProfile(user, authProvider) {
  const db = firebase.firestore();
  
  try {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      authProvider: authProvider,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}


async function updateLastLogin(uid) {
  const db = firebase.firestore();
  
  try {
    await db.collection('users').doc(uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.log('Creating user profile...');
    const user = firebase.auth().currentUser;
    if (user) {
      await saveUserProfile(user, 'password');
    }
  }
}


window.validatePassword = function(password) {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};
window.validateEmail = function(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address format';
  }
  return null;
};
