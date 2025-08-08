// app.js

const supabase = supabase.createClient(
  'https://smcteblolwhfxcpngmvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY3RlYmxvbHdoZnhjcG5nbXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Nzk1MTUsImV4cCI6MjA3MDA1NTUxNX0.PWlZFiVv2E0Jah7tYGOGrbqkPwhxPoLhe0anINp0z3s'
);

// LOGIN
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) alert('Login error: ' + error.message);
  });
}

// LOGOUT
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
}

// DASHBOARD PAGE
const coinInput = document.getElementById('coin-name');
const createBtn = document.getElementById('create-coin-btn');
const coinList = document.getElementById('coin-list');

(async () => {
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (!user && window.location.pathname.includes('dashboard')) {
    window.location.href = 'index.html';
    return;
  }

  // Create coin
  if (createBtn) {
    createBtn.addEventListener('click', async () => {
      const name = coinInput.value;
      if (!name) return alert('Enter a name');

      const { error } = await supabase.from('coins').insert({
        name: name,
        created_by: user.id
      });

      if (!error) {
        coinInput.value = '';
        loadCoins();
      } else {
        alert('Error creating coin');
      }
    });
  }

  // Load coins
  async function loadCoins() {
    const { data, error } = await supabase
      .from('coins')
      .select('*')
      .order('created_at', { ascending: false });

    if (coinList) {
      coinList.innerHTML = '';
      data.forEach((coin) => {
        const li = document.createElement('li');
        li.textContent = coin.name;
        coinList.appendChild(li);
      });
    }
  }

  if (coinList) loadCoins();
})();
