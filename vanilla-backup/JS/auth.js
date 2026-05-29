// File: js/auth.js
const auth = {
    currentUser: null,
    users: [],
  
    mockSignup(userData) {
      return new Promise((resolve, reject) => {
        // Check if user exists
        if (this.users.some(u => u.email === userData.email)) {
          reject(new Error('Email already exists'));
          return;
        }
  
        // Add new user
        const user = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date()
        };
        this.users.push(user);
        this.currentUser = user;
        
        // Save to localStorage
        localStorage.setItem('codora_users', JSON.stringify(this.users));
        localStorage.setItem('codora_currentUser', JSON.stringify(user));
        
        resolve(user);
      });
    },
  
    mockLogin(email, password) {
      return new Promise((resolve, reject) => {
        const user = this.users.find(u => u.email === email);
        
        if (!user || user.password !== password) {
          reject(new Error('Invalid email or password'));
          return;
        }
  
        this.currentUser = user;
        localStorage.setItem('codora_currentUser', JSON.stringify(user));
        resolve(user);
      });
    },
  
    init() {
      // Load users from localStorage
      const savedUsers = localStorage.getItem('codora_users');
      if (savedUsers) this.users = JSON.parse(savedUsers);
      
      // Load current session
      const currentUser = localStorage.getItem('codora_currentUser');
      if (currentUser) this.currentUser = JSON.parse(currentUser);
    }
  };
  
  // Initialize when loaded
  auth.init();